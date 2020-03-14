import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../models/Response';
import { Account } from '../models/account';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _url = 'http://localhost:3000/accounts/';

  constructor(private _http: HttpClient) { }

  getAllAccounts(): Observable<Response> {
    return this._http.get<Response>(this._url);
  }

  getAccountByMemId(name: string): Observable<Response> {
    const url = this._url + name;
    return this._http.get<Response>(url);
  }

  addAccount(newAccount: Account): Observable<Response> {
    console.log(newAccount);
    return this._http.post<Response>(this._url, newAccount, httpOptions);
  }

  updateAccount(updatedAccount: Account): Observable<Response> {
    console.log(updatedAccount);
    const url = this._url + updatedAccount.name;
    return this._http.patch<Response>(url, updatedAccount, httpOptions);
  }
}
