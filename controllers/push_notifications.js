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
    'mailto:contacto@oeneika.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );


const sendNotifications = (req, res) => {
    console.log(req.body);
    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            auth: req.body.auth,
            p256dh: req.body.p256dh
        }
    };

    const payload = {
        "notification": {
            "title": "Alerta de nivel 4 (Amenaza)",
            "body": "Hemos detectado a una persona de nivel 4 en el recinto.",
            "vibrate": [100, 50, 100],
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

    res.send({ data: 'Push enviada exitosamente :D' })

}

module.exports = {
    sendNotifications,
};