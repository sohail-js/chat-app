import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchUsersComponent implements OnInit {

  @Output() select = new EventEmitter();

  constructor(
    private chatService: ChatService
  ) { }

  ngOnInit() {
  }

  searchInput;
  users = [];
  search() {
    this.chatService.searchUsers(this.searchInput || "-------").then((res: any) => {
      this.users = res;
      console.log(this.users);
    })
  }

  userClicked(user) {
    this.select.emit(user);
    this.users = [];
    this.searchInput = "";
  }

}
