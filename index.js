const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
require('dotenv').config();
const io = new Server(server,{
  origin: '*'
});

let room='';
let count = 0;
const userList = new Map();

const getData = () => {
  if (userList.size > 0) {
    const arr = [];
    userList.forEach((value, key) => {
      const obj = { userName: value, socketId: key };
      arr.push(obj);
    });
    return JSON.stringify(arr);
  } else {
    return JSON.stringify([]);
  }
}

io.on("connection", (socket) => {
  if (socket.id) {
    userList.set(socket.id, `User ${socket.id}`);
  }
  if (userList.size >= 1) {
    socket.broadcast.emit("new-user-joined", "newuser");
  }
  socket.on("disconnect", () => {
    if (socket.id) {
      userList.delete(socket.id);
    }
    socket.broadcast.emit("user-disconnected", "newuser");
  });

  socket.on('getData',data=>{
    const res = getData();
    console.log("Data Request From Client Side ::::::::::",res);
    socket.broadcast.emit('incomingData',{arr : res});

  });
});

server.listen(process.env.PORT, () => {
  console.log("Server is running on PORT ::",process.env.PORT);
});