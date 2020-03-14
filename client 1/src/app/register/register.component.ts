import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../shared/models/User';
import { UserService } from '../shared/services/user.service';
import { RoutingService } from '../shared/services/routing.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerationForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _user: UserService, private _routing: RoutingService) { }

  ngOnInit() {
    this._formInitializer();
  }

  private _formInitializer(): void {
    this.registerationForm = this._formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  registerUser(): void {
    const user: User = {
      name: this.registerationForm.controls.name.value,
      mobile: this.registerationForm.controls.mobile.value,
      email: this.registerationForm.controls.email.value,
      password: this.registerationForm.controls.password.value,
      role: 'admin'
    };
    console.log(user);
    this._user.registerUser(user).subscribe(data => {
      if (data.success) {
        console.log(data);
        this.routeTo('login');
      } else {
        console.error(data);
      }
    });
  }

  routeTo(path): void {
    this._routing.routeTo(path);
  }
}
