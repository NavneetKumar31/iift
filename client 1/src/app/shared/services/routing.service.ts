import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private _router: Router) { }

  routeTo(path: string): void {
    this._router.navigate([path.toLowerCase()]);
  }

  childRouteTo(parentName: string, path: string): void {
    this._router.navigate([parentName.toLowerCase(), path.toLowerCase()]);
  }
}
