import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { environment } from '../environments/environment';

export interface Message {
  user_id: Number,
  recipient_id: Number,
  type: string,
  token: string,
  message: string
}
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public message: Subject<Message>;

  private conn;
  userData;

  constructor(
    private wsService: WebsocketService
  ) {
    this.message = <Subject<Message>>wsService
      .connect(environment.CHAT_URL)
      // .pipe(
      .map((res: MessageEvent): Message => {
        let data = JSON.parse(res.data)

        return data
      })


    // this.conn = new WebSocket(environment.CHAT_URL);
    // this.userData = JSON.parse(localStorage.getItem('userData'));

    // this.conn.onopen = (e) => {
    //   console.log("onopen", e);

    //   // Subscribe as a user
    //   this.conn.send({
    //     user_id: this.userData.userId,
    //     recipient_id: null,
    //     type: 'socket',
    //     token: null,
    //     message: null
    //   });
    // }


    // this.conn.onmessage = () => {

    // }
  }

  // public sendMessage(msg, to) {
  //   this.conn.send({
  //     user_id: this.userData.userId,
  //     recipient_id: to,
  //     type: 'chat',
  //     token: null,
  //     message: msg
  //   })
  // }
}
