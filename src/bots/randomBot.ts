import { Gamestate, BotSelection } from '../models/gamestate';
const codes = {
    0: 'P',
    1: 'R',
    2: 'S',
    3: 'D'
}

class Bot {
    myDynamitesUsed = 0;
    
    makeMove(gamestate: Gamestate): BotSelection {
        var action;
        if (this.myDynamitesUsed < 100){
            action = Math.floor(Math.random() * 4);
            if (action == 3){
                this.myDynamitesUsed += 1;
            }
        }
        else{
            action = Math.floor(Math.random() * 3);
        }
        return codes[action];
    }
}

export = new Bot();
