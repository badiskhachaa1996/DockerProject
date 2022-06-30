import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {
  @Output() fire: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  connected() {
    this.fire.emit(true);
  }

  disconnected(){
    this.fire.emit(false);
  }

  getEmittedValue() {
    return this.fire;
  }
}
