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
        endpoint: 'https://fcm.googleapis.com/fcm/send/dKegcieFu2Y:APA91bF0iPYE998eBNu7XTxFwxuld9hC5Q9LVHnbq2TjgmuPl-odZSnxTPKfmM6PSvPRgC0Q5TULcCWnNyGf7RsjMec7OCXRYoXHytmwpJzcLYUGHFcQGwNfRrTXxomkIo0jAtCf-8Mr',
        keys: {
            auth: 'zABBFLWDpBoXbUA6N9_Cew',
            p256dh: 'BLjgPWxijTvmnfh-1uhfvx0qWr9slj3Av6sCtVKj5bXv50hgBEElNGndrKlPlhhMcOo5OU_cP7WdnHt9ywIKfMM'
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

    res.send({ data: 'Push enviada exitosamente :D' })

}

module.exports = {
    sendNotifications,
};