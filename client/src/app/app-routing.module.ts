import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthguardService } from './services/authguard.service';


const routes: Routes = [
  { path: "chat", canActivate: [AuthguardService], component: ChatComponent },
  { path: "login", canActivate: [AuthguardService], component: AuthComponent },
  { path: "", redirectTo: "chat", pathMatch: "full" },
  { path: 'game', canActivate: [AuthguardService], loadChildren: () => import('./components/game/game.module').then(m => m.GameModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
