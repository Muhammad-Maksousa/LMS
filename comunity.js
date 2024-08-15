import {Messages} from diretory/models/messages
const {Server} = require("socket.io");
const {mongoose} = require("mongoose");

//initializing our server
//8080 is our server port 

const server = new Server(8080,{
     cors: {
    origin: ["http://localhost:3000"],
  })

//we then map our users to the group
const userRooms = {}

//this will allow any one to join the group chat
server.on("connection", (socket)=>{
  socket.on("join-room",(userId, groupRoomId)=>{
//we check if the userId and groupId is present
          if( userId && groupId){
            socket.join(groupId)
          console.log(`User ${userId} joined room ${groupRoomId}`);

           // Map the user to the room
          userRooms[socket.id] = groupRoomId;
        }
    })

socket.on("send-message", async(userId, groupRoomId,Message)=>{
    //we set the mongoose and connect to dp
    //NB, its better to set the connection else where, but im aiming for simplicity
     mongoose.set("strictQuery", true);
  
     const mongoUri =process.env.MONGO_URI
      if (!mongoUri) {
        console.log("Mongo uri isnt define");
      }

      await mongoose.connect(`${mongoUri}`, {
        dbName: "dbname",
        bufferCommands: false, // Disable command buffering
        socketTimeoutMS: 10000,

    // we save the passed message to the message scema
      const newMessage = new Messages({
            roomId:groupRoomId,
            message
            creator: userId
        }

        newMessage.save()
      if(roomId && userRooms[socket.id] === groupRoomId) {
          //this will send messages to all the group memebers
            socket.to(groupRoomId).emit("receive-message", message);
  
              //this will send message to the sender
            socket.emit("receive-message", message);
        }
}

}