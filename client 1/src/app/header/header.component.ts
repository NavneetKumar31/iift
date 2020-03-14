import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../shared/services/routing.service';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/User';
import { MessageService } from '../shared/services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  appInfo = {
    name: 'iift'
  };
  isUserLoggedIn = false;
  user: User;

  constructor(private _routing: RoutingService, private _user: UserService,
    private _message: MessageService) { }

  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn() {
    this._user.isUserLoggedIn.subscribe(status => {
      this.isUserLoggedIn = status;
      if (status) {
        this.user = JSON.parse(localStorage.getItem('userInfo'));
      }
    });
    if (localStorage.getItem('token') === undefined) {
      this._user.isUserLoggedIn.next(false);
    } else {
      this._user.isUserLoggedIn.next(true);
    }
  }

  signOut(): void {
    this._user.isUserLoggedIn.next(false);
    localStorage.clear();
    this.routeTo('login');
    this._message.addMessage('success', 'user signed out successfully.')
  }

  routeTo(path): void {
    this._routing.routeTo(path);
  }
}
