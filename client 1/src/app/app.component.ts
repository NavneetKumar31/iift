import { Component, OnInit } from '@angular/core';
import { MessageService } from './shared/services/message.service';
import { Message } from './shared/models/message';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { UserService } from './shared/services/user.service';
import { RoutingService } from './shared/services/routing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn&fadeOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0, top: 0 }),
        animate('1s', style({ opacity: '*', top: '*' }))
      ]),
      transition(':leave',
        animate('0.5s', style({ opacity: 0, top: 0 })))
    ])
  ]
})
export class AppComponent implements OnInit {

  showMsgPanel = false;
  msg: Message;
  isUserLoggedIn: boolean;

  constructor(private _message: MessageService, private _user: UserService,
    private _routing: RoutingService) {
    const token = localStorage.getItem('token');
    if (token !== null && token !== undefined) {
      this._user.isUserLoggedIn.next(true);
    } else {
      this.isUserLoggedIn = false;
    }
  }

  ngOnInit(): void {
    this._user.isUserLoggedIn.subscribe(data => {
      this.isUserLoggedIn = data;
    });

    this._message.isMessage.subscribe(data => {
      this.showMsgPanel = true;
      this.msg = data;
      setTimeout(() => {
        this.showMsgPanel = false;
      }, 5000);
    });
  }

  routeTo(path: string): void {
    this._routing.routeTo(path);
  }
}
