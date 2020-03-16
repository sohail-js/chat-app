import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameComponent } from './game.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { SelectComponent } from './select/select.component';

const routes: Routes = [
  {
    path: ':sessionId',
    component: GameComponent,
    children: [
      { path: '', redirectTo: 'select', pathMatch: 'full' },
      { path: 'select', component: SelectComponent },
      { path: 'tic-tac-toe', component: TicTacToeComponent },
    ]
  },
  // { path: '', redirectTo: 'select', pathMatch: 'full' },
  // { path: 'select', component: SelectComponent, },
  // { path: 'tic-tac-toe', component: TicTacToeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
