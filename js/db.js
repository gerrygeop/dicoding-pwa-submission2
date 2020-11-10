const idbPromised = idb.open('football-database', 1, upgradedDB => {
    if (!upgradedDB.objectStoreNames.contains('match')) {
        upgradedDB.createObjectStore("match", {keyPath: "id"});
    }
});

const dbInsertMatch = match => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            let tx = db.transaction("match", "readwrite");
            let store = tx.objectStore("match");
            store.put(match);
            return tx;
        })
        .then(tx => {
            if (tx.complete) {
                toast('Match saved.');
                resolve(true);
            } else {
                reject(new Error(`Insert DB Error: ${tx.onerror}`));
            }
        })
    })
};


const dbDeleteMatch = matchId => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const tx = db.transaction("match", "readwrite");
            tx.objectStore("match").delete(matchId);
            return tx;
        })
        .then(tx => {
            if (tx.complete) {
                toast('Match deleted.');
                showAllSaved();
                resolve(true)
            } else {
                reject(new Error(tx.onerror))
            }
        })
    })
};


const dbGetAllMatches = () => {
    return new Promise((resolve, reject) => {
        idbPromised.then(db => {
            const tx = db.transaction("match", "readonly");
            return tx.objectStore("match").getAll();
        })
        .then(data => {
            if (data !== undefined) {
                resolve(data);
            } else {
                reject(new Error("Match Saved not found."));
            }
        })
    })
};