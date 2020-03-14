import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public isMessage = new Subject<Message>();
  private _msg = new Message();

  constructor() { }

  addMessage(severity: string, msg: string): void {
    this._msg.severity = severity;
    this._msg.msg = msg;
    this.isMessage.next(this._msg);
  }
}
