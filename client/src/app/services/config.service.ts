import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  secureLs: SecureLS;
  private _USERDETAILS = 'chatzUserDetails';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.secureLs = new SecureLS({ encodingType: 'des', isCompression: false, encryptionSecret: '%fugfdst$%7wygrhfkshcs45$%^^%d765^$&dhv2345' });
  }
  getUserDetails() {
    return this.secureLs.get(this._USERDETAILS);
  }
  setUserDetails(details) {
    this.secureLs.set(this._USERDETAILS, details);
  }

  logout() {
    this.secureLs.remove(this._USERDETAILS);
    this.router.navigate(['login']);
  }
}
