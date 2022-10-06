"use strict";
const webpush = require('web-push');

/**
 * Settings VAPID
 */

 const vapidKeys = {
    "publicKey": "BNDAl3-ES2V08t5bTL-3YuexUNceQr8c4Cel79zqP3A4GUxsDscRc2JEAWmYmAvJwtOxsYqMl4pR9dD1hZ1ofqg",
    "privateKey": "2Do30rag4btNtnqy2elxsg1HeRMfSa7eOlwKKqgmex0"
  }
  
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );


const sendNotifications = (req, res) => {

    const pushSubscription = {
        endpoint: 'https://fcm.googleapis.com/fcm/send/fJWs7GK1Fr4:APA91bGCH2GYixJyL2sandVt1e15xiVRHDJLwgFltzh_NeV3jDk3uHwHNroLOh0l8ol7ymfLb4A0ijiIkXXXreTFGHrz9iVlVAXTXlCuDn_GXOcQNV8YMgzjyad9Plmf1HNnX8AysNio',
        keys: {
            auth: 'UbAi7d24uU7WkMZf1yj3tw',
            p256dh: 'BNQ6GObmIZ6vrK1NnC9u1eNC6Jx5wUIl819MftNq7_1vUqSUvmpLW6Bk2QsYteZ5QWEU2KoNyhC_tzff_DjL24M'
        }
    };

    

    const payload = {
        "notification": {
            "title": "Alerta de nivel 4 (Amenaza)",
            "body": "Hemos detectado a una persona de nivel 4 en el recinto.",
            "vibrate": [100, 50, 100],
            "image": "https://avatars2.githubusercontent.com/u/15802366?s=460&u=ac6cc646599f2ed6c4699a74b15192a29177f85a&v=4",
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]
        }
    }

    webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload))
        .then(res => {
            console.log('Push enviada con exito');
        }).catch(err => {
            console.log('Error', err);
        })

    res.send({ data: 'Push enviada exitosamente' })

}

module.exports = {
    sendNotifications,
};