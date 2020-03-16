import { Component, OnInit } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {

  constructor(
    private wsService: WebsocketService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  status: String = '';
  sessionId;
  sessionData;
  loaded = true;
  ngOnInit() {

    this.route.parent.params.subscribe(params => {
      console.log(params);

      this.sessionId = params.sessionId;

      // Create new session if sessionId is userId
      if (isNaN(this.sessionId)) {
        // Create game
        const sessionId = Date.now() + Math.random().toString().split('.')[1];
        this.wsService.emit('game', {
          name: 'tic-tac-toe', to: this.sessionId, action: 'create', sessionId
        });

        // Navigate to session
        this.router.navigate([`/game/${sessionId}/tic-tac-toe`]);
      }

      // Join a session
      else {
        this.wsService.emit('game', {
          name: 'tic-tac-toe', sessionId: this.sessionId, action: 'join'
        });
      }
    })


    // Listen for moves
    this.wsService.listen('game-move').subscribe((data: any) => {
      switch (data.action) {
        case 'created':
          this.status = 'Waiting for opponent';
          break;
        case 'accepted':
          this.status = 'Opponent joined!';
          this.sessionData = [[], [], []]
          break;
        case 'move':
          console.log("Move >> ", data.move);
          break;

        case 'gameSession':

          this.sessionData = data.sessionData;
          console.log("SessionData >> ", this.sessionData);
          break;
      }
    })
  }

  sendMove(x, y) {
    this.wsService.emit('game-move', {
      action: 'move',
      move: { x, y },
      sessionId: this.sessionId
    });
  }

}
