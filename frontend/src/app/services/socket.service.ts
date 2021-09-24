import { Injectable } from '@angular/core';
const io = require("socket.io-client");

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket = io("http://localhost:3000");

  constructor() { }

  AddNewTicket(service_id){
    this.socket.emit("AddNewTicket",(service_id))
  }

  NewMessageByAgent(user_id,service_id){
    this.socket.emit("NewMessageByAgent",({user_id,service_id}))
  }

  NewMessageByUser(agent_id){
    this.socket.emit("NewMessageByUser",(agent_id))
  }

  AccepteTicket(agent_id){
    this.socket.emit("AccepteTicket",(agent_id))
  }
}
