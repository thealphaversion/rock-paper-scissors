class GameMechanincs {
    constructor(player_1, player_2) {
        this._players = [player_1, player_2];
        this._turns = [null, null];
        this._endgame = [null, null];
        this.score=[0,0]
        this.count=0 //Keeps track of no of games

        this._sendToPlayers("Game Starts!");

        // for each player we are adding an event listener
        this._players.forEach((player, player_index) => {
            player.on("turn", (turn) => {
                this._onTurn(player_index, turn);
            });
        });

        this._players.forEach((player, player_index) => {
            player.on("endgameoptions", (turn) => {
                this._onEnd(player_index, turn);
            });
        });
    }

    // so that the player knows that the server received its move
    _sendFeedbackToPlayer(player_index, message) {
        this._players[player_index].emit("message", message);
    }

    // so that both players know what is going on
    _sendToPlayers(message) {
        this._players.forEach((element) => element.emit("message", message));
    }

    // to capture turns
    _onTurn(player_index, turn) {
        this._turns[player_index] = turn; // setting player turn
        // TODO: add more logic to restrict player changing their choice here
        this._sendFeedbackToPlayer(player_index, `You selected ${turn}`);

        this._roundOver();
    }

    // to capture option after game ends
    _onEnd(player_index, turn) {
        this._endgame[player_index] = turn; // setting player turn
        // TODO: add more logic to restrict player changing their choice here
        if(this._endgame[player_index]==='same')
        {
            this._sendFeedbackToPlayer(player_index, `Waiting for opponent.`);
            this._sendFeedbackToPlayer(1-player_index, `Opponent wants a rematch.`);

        }
        if(this._endgame[0]==='same' && this._endgame[1]==='same'){
            this.count=0
            this.score=[0,0]
            this._restart()
        }
        

        this._roundOver();
    }

    // this will check if the current game or round is over.
    _roundOver() {
        const turns = this._turns;

        if (turns[0] && turns[1]) {
            this._sendToPlayers("Round over: Round => " + turns.join(" : "));
            this._getResult();
            this._turns = [null, null];
            this._sendToPlayers(`Score: ${this.score[0]} - ${this.score[1]}`)
            if (this.count==5){
                if (this.score[0]>this.score[1]){
                    this._winMessage(this._players[0], this._players[1]);
                    
                }
                else if(this.score[0]<this.score[1]){
                    this._winMessage(this._players[1], this._players[0]);
                }
                else{
                    this._sendToPlayers("Draw")
                }
                this._gameOver()
            }
            else{
                this._sendToPlayers("Next round start");
            }
            
           
            
        }
        
    }

    _getResult() {
        const value_player_1 = this._decodeTurn(this._turns[0]);
        const value_player_2 = this._decodeTurn(this._turns[1]);

        // rock -> scissors -> paper -> rock
        // if p1 take rock and p2 takes paper, then the distance
        // between those moves (p2 - p1) is 2. And if p1 selects scissors
        // and p2 selects paper, then the distance (p2 - p1) is 1.
        // and when both select the same thing, then distance is 0.

        // so if (p2 - p1) is 0, it is a draw
        // if (p2 - p1) is 1, p1 wins
        // if (p2 - p1) is 2, p2 wins
        const distance = (value_player_2 - value_player_1 + 3) % 3;
        if(distance === 0){
            this.count=this.count+1
        }
        else if (distance === 1) {
            this.score[0]=this.score[0]+1
            this.count=this.count+1

        } else if (distance === 2) {
            this.score[1]=this.score[1]+1
            this.count=this.count+1
        } else {
            throw new Error("Error in result");
        }
    }

    _winMessage(winner, loser) {
        winner.emit("message", "You Won!");
        loser.emit("message", "You Lost.");
    }
    _gameOver() {
        this._players.forEach((element) => element.emit("over"));
    }
    _restart() {
        this._players.forEach((element) => element.emit("restart"));
    }

    _decodeTurn(turn) {
        if (turn === "rock") {
            return 0;
        } else if (turn === "scissors") {
            return 1;
        } else if (turn === "paper") {
            return 2;
        } else {
            throw new Error("Error");
        }
    }
}

module.exports = GameMechanincs;
