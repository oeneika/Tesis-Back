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
        endpoint: 'https://fcm.googleapis.com/fcm/send/dHQWp85gOIY:APA91bG3uezKMMlYmUsuzTIC4FTkun3bZ9oI43HdI_wzNBx1mmS9BKX8yYH9v3mbs3qI8a2jhQ3gTEubcyFwHoTF7dEFzndz-OAKxuoCTEbqiTs275dGrFo_UWaSw5zldsFwS2_JR-z2',
        keys: {
            auth: '8ZFrj8fhemAIn9bUC1xsoA',
            p256dh: 'BNk5lvjblCVpjlmsnd4gwck2rqFvbrz-40uGzAhet7Dz4sWLsYAWJQZcHBqBcuI0sJhdx5VgbBZ8DfgvQEAwl4U'
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