import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';

import { Response } from '../models/Response';
import { User } from '../models/User';
import { RoutingService } from './routing.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  })
};

const httpOptions1 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _url: string;
  isUserLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private _http: HttpClient, private _router: RoutingService) {
    this._url = environment.apiUrl + 'users/';
  }

  authenticateUser(user: User): Observable<Response> {
    const url = this._url + 'authenticate/';
    return this._http.post<Response>(url, user, httpOptions1);
  }

  storeUsersDetials(data: Response): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userInfo', JSON.stringify(data.result[0]));
  }

  registerUser(user: User): Observable<Response> {
    const url = this._url + 'register/';
    return this._http.post<Response>(url, user, httpOptions1);
  }

  getAllUsers(): Observable<Response> {
    return this._http.get<Response>(this._url);
  }

  addMember(newUser: User): Observable<Response> {
    return this._http.post<Response>(this._url, newUser, httpOptions);
  }

  updateMember(updatedUser: User): Observable<Response> {
    const url = this._url + updatedUser._id;
    return this._http.patch<Response>(url, updatedUser, httpOptions);
  }

  deleteUser(id: string): Observable<Response> {
    const url = this._url + id;
    return this._http.delete<Response>(url, httpOptions);
  }

  getFathersDetails(name: string): Observable<Response> {
    const url = this._url + 'getCommissionDetails/' + name;
    return this._http.get<Response>(url);
  }
}
