if ("serviceWorker" in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
        requestPermission();
    });
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

function registerServiceWorker() {
    return navigator.serviceWorker
        .register("/service-worker.js")
        .then(reg => {
            console.log(`Pendaftaran ServiceWorker Berhasil: ${reg.scope}`);
            return reg;
        })
        .catch(error => console.log(`Pendaftaran ServiceWorker Gagal: ${error}`));
}

function requestPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(result => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if(result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            navigator.serviceWorker.ready.then(() => {
                if (('PushManager' in window)) {
                    navigator.serviceWorker.getRegistration().then(reg => {
                        reg.pushManager.subscribe({
                            userVisibleOnly: true,
                            applicationServerKey: urlBase64ToUint8Array("BEe-lw0SmMe3BYaw9CMn-PMNdunfSdGPgCM_yWHd4_7Do2NHyuNP0UTcQK_aHwvCJjeU61gSTphICCENbxeQ5BI")
                        })
                        .then(subscribe => {
                            console.log('Subscribe berhasil endpoint: ', subscribe.endpoint);
                            console.log('Subscribe berhasil p256dh key: ', btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('p256dh')))));
                            console.log('Subscribe berhasil auth key: ', btoa(String.fromCharCode.apply(null, new Uint8Array(subscribe.getKey('auth')))));
                        })
                        .catch(error => console.error('Tidak dapat melakukan subscribe ', error.message));
                    });
                }
            });
            
        });
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}