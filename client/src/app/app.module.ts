import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WebsocketService } from './websocket.service';
import { ChatService } from './chat.service';

import { FormsModule } from '@angular/forms';
import { ChatComponent } from './components/chat/chat.component';
import { AuthComponent } from './components/auth/auth.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [WebsocketService, ChatService],
  bootstrap: [AppComponent]
})
export class AppModule { }
