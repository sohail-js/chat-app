import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private http: HttpClient
  ) { }

  public searchUsers(q = "*") {
    return this.http.get(`${environment.API_ENDPOINT}users/search/${q}`, {}).toPromise();
  }

  public getChat() {
    return this.http.get(`${environment.API_ENDPOINT}users/getChat`, {}).toPromise();
  }
}
