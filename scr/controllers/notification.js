const NotificationService = require("../services/notification");
const UserService = require("../services/user");
const { responseSender } = require("../helpers/wrappers/response-sender");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secretKey = require("../helpers/db/config.secret");
module.exports = {
    send: async (req, res) => {
        const { body } = req;
        let notification = { 'notification': { title: body.title, body: body.body } };
        /*const users = await new UserService({}).getAll();
        let userFcmTokens = [];
        for (i = 0; i < users.length; i++)
            userFcmTokens[i] = users[i].fcm;*/
        let userFcmTokens = "eryNCsEKQBKwOzSXsFogxM:APA91bHXFxcHX9Lw4HwlkQV-Fre12a68psXnH_iaV5s2pdzv2iGe4SGK9hSdS8PQQrYff4emwCVklN2msvjutTa6qLLPjCbqvv1atqpxYMO3dTjBDPDApf4Xq07taGoDCjaeLIYDnN13";
        await new NotificationService({}).sendNotificationsToOneOrAll(userFcmTokens, notification);
        responseSender(res, "success");
    }
};