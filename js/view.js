function showStanding(data) {
    let standingEl = '';
    data.standings[0].table.forEach(standing => {
        standingEl += `
            <tr>
                <td class="bold">${standing.position}</td>
                <td class="flex-standing">
                    <img class="mr-10" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="logo" width="20">
                    <a class="black-text">${standing.team.name}</a>
                </td>
                <td>${standing.points}</td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
            </tr>
        `;
    });
    document.getElementById('table-body').innerHTML = standingEl;
    document.getElementById('preloader').innerHTML = '';
}


function showMatches(data) {
    let matchEl = '';
    
    data.matches.forEach(match => {
        let score = '-';
        let status = 'P';
        let statusClass = '';

        if (match.status === "FINISHED") {
            score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
            status = 'FT';
            statusClass = 'green lighten-1';
        } else if(match.status === "POSTPONED") {
            score = '-';
            statusClass = 'red';
        } else {
            status = `${new Date(match.utcDate).toLocaleDateString()}`;
            statusClass = 'text-italic status-match-padding';
        }

        matchEl += `
            <a class="modal-trigger black-text" href="#modal1" onclick="getMatchById(${match.id})">
                <div class="row blue-grey lighten-5 match-padding card-match">
                    <div class="col s12 m2 l1 white-text ${statusClass}">${status}</div>
                    <div class="col s4 m4 l4">${match.homeTeam.name}</div>
                    <div class="col s4 m2 l3">${score}</div>
                    <div class="col s4 m4 l4">${match.awayTeam.name}</div>
                </div>
            </a>
        `;

        document.getElementById('btn-matchday').innerHTML = `
            <div class="flex">
                Matchday - ${match.matchday}
                <i class="material-icons ml-10">arrow_drop_down</i>
            </div>
        `;
    });

    document.getElementById('list-matches').innerHTML = matchEl;
    document.getElementById('preloader').innerHTML = '';

    const dropDown = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDown);

    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    let listDropdown = '';
    for (let i = 1; i <= 38; i++) {
        listDropdown += `<li><a onclick="getAllMatches(${i})">${i}</a></li>`;
    }
    document.getElementById('dropdown1').innerHTML = listDropdown;
    
}

function showModals(match) {
    let modals = '';
    let score = '-';
    let status = 'P';
    let statusClass = '';

    if (match.status === "FINISHED") {
        score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
        status = 'FT';
        statusClass = 'green lighten-1';
    } else if(match.status === "POSTPONED") {
        score = '-';
        statusClass = 'red';
    } else {
        status = '';
    }

    modals = `
        <div class="modal-content">
            <div class="center-align section">
                <strong class="p-4 white-text ${statusClass}">${status}</strong>
            </div>
            <div class="row center-align">
                <div class="col s12 m5">
                    <strong>${match.homeTeam.name}</strong>
                </div>
                <div class="col s1 push-s5 m2">
                    <strong>${score}</strong>
                </div>
                <div class="col s12 m5">
                    <strong>${match.awayTeam.name}</strong>
                </div>
            </div>
            <div class="center-align">
                <small class="flex"><i class="tiny material-icons">place</i>${match.venue}</small>
                <small>
                    ${new Date(match.utcDate).toLocaleTimeString()}
                    <span>|</span>
                    ${new Date(match.utcDate).toLocaleDateString()}
                </small>
            </div>
        </div>
        <div class="modal-footer">
            <button id="save-match" class="waves-effect waves-light btn-flat red lighten-1 white-text">Simpan</button>
        </div>
    `;

    document.getElementById('modal1').innerHTML = modals;

    document.getElementById('save-match').onclick = () => {
        dbInsertMatch(match);
        const modals = document.querySelector('.modal');
        M.Modal.getInstance(modals).close();
    }
}



function showAllSaved() {
    dbGetAllMatches().then(matches => {
        let listMatch = '';
        if (matches.length === 0) listMatch = `<h5 class="center">Tidak ada match yang disimpan.</h5>`;

        matches.forEach(match => {
            let score = '-';
            let status = 'P';
            let statusClass = '';

            if (match.status === "FINISHED") {
                score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
                status = 'FT';
                statusClass = 'green lighten-1';
            } else if(match.status === "POSTPONED") {
                score = '-';
                statusClass = 'red';
            } else {
                status = '';
            }

            listMatch += `
                <div class="card">
                    <div class="section center-align">
                        <strong class="p-4 white-text ${statusClass}">${status}</strong>
                    </div>
                    <div class="row center-align">
                        <div class="col s12 m5">
                            <strong>${match.homeTeam.name}</strong>
                        </div>
                        <div class="col s1 push-s5 m2">
                            <strong>${score}</strong>
                        </div>
                        <div class="col s12 m5">
                            <strong>${match.awayTeam.name}</strong>
                        </div>
                    </div>
                    <div class="center-align">
                        <small class="flex"><i class="tiny material-icons">place</i>${match.venue}</small>
                        <small>
                            ${new Date(match.utcDate).toLocaleTimeString()}
                            <span>|</span>
                            ${new Date(match.utcDate).toLocaleDateString()}
                        </small>
                    </div>
                    <div class="section right-align mr-10">
                        <a id="delete-match" class="waves-effect waves-light btn-flat red lighten-1 white-text" onclick="dbDeleteMatch(${match.id})">Hapus</a>
                    </div>
                </div>
            `;
        });

        document.getElementById('match-saved').innerHTML = listMatch;
        document.getElementById('preloader').innerHTML = '';
    });
}


function toast(text) {
    return M.toast({html: `<p class="orange-text text-lighten-2">${text}</p>`, classes: 'blue-grey darken-4'});
}

const preLoader = 
`<div class="preloader-wrapper active">
    <div class="spinner-layer spinner-red-only">
        <div class="circle-clipper left">
            <div class="circle"></div>
        </div>
        <div class="gap-patch">
            <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
            <div class="circle"></div>
        </div>
    </div>
</div>`;
