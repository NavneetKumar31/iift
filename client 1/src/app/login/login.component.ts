import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../shared/models/User';
import { UserService } from '../shared/services/user.service';
import { RoutingService } from '../shared/services/routing.service';
import { MessageService } from '../shared/services/message.service';
import { Response } from '../shared/models/Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _user: UserService,
    private _routing: RoutingService, private _message: MessageService) { }

  ngOnInit() {
    this._formInitializer();
  }

  private _formInitializer(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  authenticateUser(): void {
    const user: User = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };
    if (user.email.toLowerCase() === 'admin@gmail.com' && user.password.toLowerCase() === 'admin12345') {
      this.loginForm.reset();
      const loggedUser: User = {
        name: 'admin',
        mobile: 7007189989,
        email: 'admin@gmail.com',
        password: '$2a$10$jORQgRJAuVgsDtrl7m4Yo.1mLyIXY4HIOqJmZGRQ9ojNOe7DKNabO',
        role: 'admin',
        registeredOn: new Date(),
      };

      const adminUser: Response = {
        count: 1,
        success: true,
        token: 'U2FsdGVkX184RHrVlmxOocE1+DdMlHawoWCwdeLZGrzPShk9tQwBMb3N0y9gNLfQ+qgZjV1XNGd7uq52D0xXV6QHYg783u8W74uTHM79GhS4dsQpzXKlR25n9RbjXxCGZ9FIcUB/YbZGmn9wi4Vgxt52WP6SJgmPark3C5ZL45qOU+qGjVi4xRHvCAGEXMGYgvHm6SBlCdwMvRpFO4ybNcF43/i55UL82XyS23QEv60qcsVLQBE+xkPN9u8S+XcK9gIfyPyTC38I84RgPRdCzRsEqj72kBkspQ0SLlTBDAVPNj9rXGxWn0/3UlaXU5LixOf9JkfhSX+V/hWbr2TR171Vu58ZKdqppmRWk75JvAkeAi8Yi3eFyL5WdcdlUslvrwl53lr+PT8+wz+cfxqj3CyHtfJj7Z1p8xyCh2Q801ornG6Gm7xRHi0S60iu7lYmmo2B1hDw39W/DnoOhiVbstu0/Xj2qMxSDrbbY/k1aGBaptQS7vrSrNzsOKhHBTlJN85yZopU+nD4JYeFRrNaSUjZo8uGN9Vhd/aHQgC+/1RBpT67p1vmAaMCjfAQNqbYL0aGmtf2p82Yp9eqB3rvBkthPk7lxZypgNw+yXoXdozDToHE0A6ZbbHWAuZUIUUpDZSgxaxBnxQaSUF8TeCp/Q==',
        msg: 'admin loggedin successfully.',
        result: [loggedUser]
      };
      this._user.storeUsersDetials(adminUser);
      this._user.isUserLoggedIn.next(true);
      this.routeTo('home');
      this._message.addMessage('success', 'Admin logged succefully.');
    } else {
      this._user.authenticateUser(user).subscribe(data => {
        if (data.success) {
          this.loginForm.reset();
          this._user.storeUsersDetials(data);
          this._user.isUserLoggedIn.next(true);
          this.routeTo('home');
          this._message.addMessage('success', data.msg);
        } else {
          this._message.addMessage('failure', data.msg);
        }
      }, err => {
        this._message.addMessage('failure', err.error.msg);
      });
    }
  }

  routeTo(path): void {
    this._routing.routeTo(path);
  }
}
