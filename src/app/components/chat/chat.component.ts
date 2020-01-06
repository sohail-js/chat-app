import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  title = 'chat-ui';
  recepient;
  message;
  userData = JSON.parse(localStorage.getItem('userData'));
  constructor(private chatService: ChatService) {
    chatService.message.subscribe(msg => {
      console.log("Response from WS server: ", msg);
      this.activeUser.messages.push({
        direction: "from",
        message: msg.message,
        receivedAt: new Date().toLocaleTimeString()
      });
    })

    console.log("User Data >>> ", this.userData);
  }

  send() {
    console.log("Sending message:", this.message, "to:", this.activeUser.userId);

    // Send message
    this.chatService.message.next({
      user_id: this.userData.userId,
      recipient_id: this.activeUser.userId,
      type: 'chat',
      token: null,
      message: this.message
    })

    // Update messages arry
    this.activeUser.messages.push({
      direction: "to",
      message: this.message,
      receivedAt: new Date().toLocaleTimeString()
    });

    // Empty message input
    this.message = "";
  }

  getUnreadCount(messages) {
    return messages ? messages.filter(x => x.direction == "from" && !x.isRead).length : 0
  }

  activeUser
  ngOnInit() {
    this.activeUser = this.users[0];
  }

  users = [
    {
      userId: 84,
      userName: "kamran",
      fullName: "Muhammad Kamran",
      messages: [
        {
          direction: "from",
          message: "Salam bro!",
          receivedAt: "2:15PM",
          isRead: false
        },
        {
          direction: "to",
          message: "Wassalam bro!",
          receivedAt: "2:15PM"
        },
      ]
    },
    {
      userId: 2,
      userName: "saeed",
      fullName: "Muhammad Saeed",
      messages: [
        {
          direction: "from",
          message: "Heyy Salam bro!",
          receivedAt: "3:15PM",
          isRead: false
        },
        {
          direction: "to",
          message: "Woah! Wassalam bro!",
          receivedAt: "3:16PM"
        },
      ]
    },
  ]
}
