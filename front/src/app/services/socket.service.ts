import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const io = require("socket.io-client");

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket = io(environment.origin.replace('/soc', ''));

  constructor() { }

  AddNewTicket(service_id) {
    this.socket.emit("AddNewTicket", service_id)
  }

  NewNotifV2(channel, text = "") {
    this.socket.emit("NewNotifV2", channel, text)
  }

  NewMessageByAgent(user_id, service_id) {
    this.socket.emit("NewMessageByAgent", { user_id, service_id })
  }

  NewMessageByUser(agent_id) {
    this.socket.emit("NewMessageByUser", agent_id)
  }

  refreshAll(service_id, user_id) {

    this.socket.emit("refreshAll", { service_id, user_id })
  }

  addPresence() {
    this.socket.emit("addPresence")
  }

  isAuth(b = true) {
    this.socket.emit("isAuth", b)
  }
}
