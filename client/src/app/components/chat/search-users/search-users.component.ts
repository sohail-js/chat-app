import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ChatService } from '../chat.service';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchUsersComponent implements OnInit {

  @Output() select = new EventEmitter();

  constructor(
    private chatService: ChatService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.userData = this.configService.getUserDetails();
  }

  searchInput;
  users = [];
  userData;
  search = this.configService.debounce(function () {
    this.chatService.searchUsers(this.searchInput || "-------").then((res: any) => {
      this.users = res.filter(x => x._id != this.userData.id);
      console.log(this.users);
    })
  }, 500)

  userClicked(user) {
    this.select.emit({ user });
    this.users = [];
    this.searchInput = "";
  }

}
