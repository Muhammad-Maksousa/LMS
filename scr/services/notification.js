const {admin} = require('../helpers/firabase.js');

class NotificationService {

    async sendNotificationsToOneOrAll(fcmTokens, notification) {
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        if (Array.isArray(fcmTokens)) {
            for (let i = 0; i < fcmTokens.length; i++)
                admin.messaging().sendToDevice(fcmTokens[i], notification, notification_options)
        } else {
            admin.messaging().sendToDevice(fcmTokens, notification, notification_options)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });
        }
    };
    async sendNotificationToTeacher(fcm,notification){
        const notification_options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        };
        admin.messaging().sendToDevice(fcm, notification, notification_options)
                .then(function (response) {
                    console.log("Successfully sent message:", response);
                })
                .catch(function (error) {
                    console.log("Error sending message:", error);
                });
    }
}

module.exports = NotificationService;