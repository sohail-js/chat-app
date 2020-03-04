import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public register(data) {
    // return new Promise((resolve, reject) => {

    return this.http.post(`${environment.API_ENDPOINT}users/register`, data).toPromise();
    // .subscribe((response: any) => {
    //   if (response.callSuccess === "0")
    //     reject();
    //   else
    //     resolve(response);
    // });
    // })
  }

  public login(data) {
    return this.http.post(`${environment.API_ENDPOINT}auth/login`, data).toPromise();
  }
}
