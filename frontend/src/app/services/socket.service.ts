import { Injectable } from '@angular/core';
const io = require("socket.io-client");

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket = io("http://localhost:3000");

  constructor() { }

  AddNewTicket(service_id){
    console.log("Ajout d'un nouveau Ticket du service: "+service_id)
    this.socket.emit("AddNewTicket",service_id)
  }

  NewMessageByAgent(user_id,service_id){
    console.log("Ajout d'un nouveau Message pour: "+user_id+" du service: "+service_id)
    this.socket.emit("NewMessageByAgent",{user_id,service_id})
  }

  NewMessageByUser(agent_id){
    console.log("Ajout d'un nouveau Message pour l'agent: "+agent_id)
    this.socket.emit("NewMessageByUser",agent_id)
  }

  AccepteTicket(data){
    console.log("Affectation/Acceptation du ticket: "+data.user_id+ " du service:"+data.service_id)
    this.socket.emit("AccepteTicket",data)
  }
}
