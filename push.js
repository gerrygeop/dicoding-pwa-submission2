let webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BEe-lw0SmMe3BYaw9CMn-PMNdunfSdGPgCM_yWHd4_7Do2NHyuNP0UTcQK_aHwvCJjeU61gSTphICCENbxeQ5BI",
    "privateKey": "wcf2gYgdAAbxEyfbguDSP0gfT9q6nlppdIvKKP1GrtA"
};

webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

let pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cL4ZPbKXCQA:APA91bHAIaqP7h0IzD9p8ZrSynHVWrYI9ObclCwtc1-hKwuDSEIk34DVCR9OYYUPEXcg0EdsMGk7EHlMwBtuWNKgApWE1AOC8N17YgpQeD4T2TYfzyaEKGKwCqA-iT1K_limQZdm7pBA",
    "keys": {
        "p256dh": "BGxt7lHnII7wpc5HgilzC4FgbpyFKDhgeLRHBAfxjmw+TMc88ljCNidsBi4bwoKByzFXXuUzgZ7sEtesw4Oo1RU=",
        "auth": "5/hdrI911S43b6LUMsMbMw=="
    }
};

let payload = 'Selamat! Aplikasi anda dapat menerima push notifikasi! horeeee...';

let options = {
    gcmAPIKey: '467827753243',
    TTL: 60
};

webPush.sendNotification(
    pushSubscription,
    payload,
    options
);