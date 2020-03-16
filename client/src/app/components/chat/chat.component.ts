import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WebsocketService } from '../../services/websocket.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatComponent {
  title = 'chat-ui';
  recepient;
  message;
  userDetails;
  constructor(
    private wsService: WebsocketService,
    private configService: ConfigService
  ) {
    this.userDetails = configService.getUserDetails();
    // chatService.message.subscribe(msg => {
    //   console.log("Response from WS server: ", msg);
    //   this.activeChat.messages.push({
    //     direction: "from",
    //     message: msg.message,
    //     date: new Date().toLocaleTimeString()
    //   });
    // })

    // console.log("User Data >>> ", this.userData);
  }

  send() {
    console.log("Sending message:", this.message, "to:", this.activeChat.user._id);

    // Send message
    this.wsService.emit('send-message', {
      // from: this.userDetails.id,
      to: this.activeChat.user._id,
      // direction: "to",
      message: this.message,
      // date,
      // isRead,
      // type
    })

    // Update messages array
    if (!this.activeChat.messages) {
      this.activeChat.messages = [];
    }
    this.activeChat.messages.push({
      direction: "to",
      message: this.message,
      date: new Date()
    });

    // else
    //   this.activeChat.messages = [{
    //     direction: "to",
    //     message: this.message,
    //     date: new Date().toLocaleTimeString()
    //   }];


    // Empty message input
    this.message = "";

    // If user not in list, add
    // if(this.activeChat)
  }

  getUnreadCount(messages) {
    return messages ? messages.filter(x => x.direction == "from" && !x.isRead).length : 0
  }

  activeChat
  ngOnInit() {
    // this.activeChat = {};
    // this.wsService.listen('chat-messsage').subscribe((data) => {
    //   console.log(data);
    // })

    this.wsService.listen('chat-messages').subscribe((data: any) => {
      console.log(data);
      // const user = this.users.find((x: any) => x._id == data.from);
    })

    this.wsService.listen('get-chat-messages').subscribe((data: any) => {
      console.log("get-chat-messages", data);
      this.chats = data;

      if (this.activeChat) {
        this.activeChat = this.chats.find(c => c.user._id == this.activeChat.user._id)
        this.transformMessages();
      }
      // const user = this.users.find((x: any) => x._id == data.from);
    })


    // Get chat messages
    this.wsService.emit('get-chat-messages', "");
  }

  chats;

  logout() {
    this.configService.logout();
  }

  setActiveChat(chat) {
    this.activeChat = chat;
    console.log('message-read');
    this.activeChat.unReadCount = 0;

    this.transformMessages();

    this.wsService.emit('message-read', {
      chatId: chat._id
    })
  }

  transformMessages() {
    // this.activeChat.messages.forEach((message, i) => {

    // })
    this.activeChat.messages[0].isDateChanged = true;
    for (let i = 1; i < this.activeChat.messages.length; i++) {
      let d1 = new Date(this.activeChat.messages[i].date);
      let d2 = new Date(this.activeChat.messages[i - 1].date);
      if (d1.getDate() > d2.getDate() || d1.getMonth() > d2.getMonth()) {
        this.activeChat.messages[i].isDateChanged = true;
      }
    }
  }
}
