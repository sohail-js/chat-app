import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { TicTacToeComponent } from './tic-tac-toe/tic-tac-toe.component';
import { SelectComponent } from './select/select.component';


@NgModule({
  declarations: [GameComponent, TicTacToeComponent, SelectComponent],
  imports: [
    CommonModule,
    GameRoutingModule
  ]
})
export class GameModule { }
