const CommunityService = require("../services/community");
module.exports = function (io) {
    io.on("connection", socket => {
        console.log("welcome to socket ");
        socket.on("send", async function (msg) {
            await new CommunityService().send(socket, msg)
        });
    })
    io.on("connection", socket => {
        console.log("welcome to socket ");
        socket.on("getChat", async function (msg) {
            await new CommunityService().getChat(socket, msg)
        });
    })
};