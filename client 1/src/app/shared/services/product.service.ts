import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../models/Response';
import { Product } from '../models/product';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _url = 'http://localhost:3000/products/';

  constructor(private _http: HttpClient) { }

  getAllProducts(): Observable<Response> {
    return this._http.get<Response>(this._url);
  }

  addProduct(newProduct: Product): Observable<Response> {
    return this._http.post<Response>(this._url, newProduct, httpOptions);
  }

  updateProduct(updatedProduct: Product): Observable<Response> {
    const url = this._url + updatedProduct._id;
    return this._http.patch<Response>(url, updatedProduct, httpOptions);
  }

  deleteProduct(deletedProduct: Product): Observable<Response> {
    const url = this._url + deletedProduct._id;
    return this._http.delete<Response>(url, httpOptions);
  }
}
