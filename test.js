const { admin } = require('./scr/helpers/firabase.js');
let notification = { 'notification': { title: "title", body: "body" } };
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
let fcmTokens = "eryNCsEKQBKwOzSXsFogxM:APA91bHXFxcHX9Lw4HwlkQV-Fre12a68psXnH_iaV5s2pdzv2iGe4SGK9hSdS8PQQrYff4emwCVklN2msvjutTa6qLLPjCbqvv1atqpxYMO3dTjBDPDApf4Xq07taGoDCjaeLIYDnN13";
admin.messaging().sendToDevice(fcmTokens, notification, notification_options)
    .then(function (response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
        console.log("Error sending message:", error);
    });