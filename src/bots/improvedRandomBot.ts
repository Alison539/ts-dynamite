//ideas - should you change your strategy if you are about to win???



import { Gamestate, BotSelection } from '../models/gamestate';

const codes = {
    0: 'P',
    1: 'R',
    2: 'S',
    3: 'W',
    4: 'D'
}

class Bot {
    myDynamitesUsed = 0;
    theirDynamitesUsed = 0;
    theirDynamiteAfterDraw = 0;
    theirClassicAfterDraw = 0;
    theirWaterAfterDraw = 0;
    theirWaterUsed = 0 // some strategies don't use any water at all - therefore could adapt so that if = 0, and points up for grabs >= 2 then use dynamite
    turn = 0;
    pointsToGain = 1; //a points up for grabs variable - and if more points than higher chance of using dynamite

    makeMove(gamestate: Gamestate): BotSelection {
        // COLLECTING DATA
        if (this.turn != 0){

            //check if it is a draw - if so use dynamite (chance 50,50)
            var lastOutcome = gamestate.rounds[gamestate.rounds.length - 1];
            var myAction = lastOutcome.p1;
            var theirAction = lastOutcome.p2;

            if (theirAction == 'D'){
                this.theirDynamitesUsed += 1
            }
            if (theirAction == 'W'){
                this.theirWaterUsed += 1
            }
            if(this.pointsToGain > 1){
                if(theirAction == 'D'){
                    this.theirDynamiteAfterDraw += 1;
                }
                else if(theirAction == 'W' ){
                    this.theirWaterAfterDraw += 1;
                }
                else{
                    this.theirClassicAfterDraw += 1;
                } 
            }

            if (myAction == theirAction){
                this.pointsToGain += 1
            }
            else{
                this.pointsToGain = 1
            }

            
        }
        this.turn += 1;

       
        // this is also a variable that could be changed - as it might be better to do 90 rather than 100 (as the risk of waterguns is a bit high)

        var action = 1;
        if (this.pointsToGain == 1){
            //if points up for grabs = 1, then I will just use the classical ones
            action = Math.floor(Math.random() * 3)
        }
        else{
            //more points up for grabs is greater

            //if I have dynamite to use
            if(this.myDynamitesUsed < 99){ //this is a variable that could be changed
                //calculating probability of me using dynamite (this could also change)
                let probability = 0.5
                let cutLine = (1- Math.pow(probability,this.pointsToGain))/(1 - probability)
                let whichAction = Math.random();
                if (whichAction <= cutLine){
                    action == 4
                }
                else{
                    if (this.theirDynamitesUsed > 90 || this.theirDynamitesUsed < 1){ 
                         //if the number of dynamites used = 100, then probability of water should be 0
                        action = Math.floor(Math.random() * 3);
                    }
                    else{
                        //if people are using lots of dynamites after draws then should favour doing water over random after draws
                        let probability = 0.9
                        let cutLine = (1- probability**this.pointsToGain)/(1 - probability)
                        let whichAction = Math.random();
                        if (whichAction <= cutLine){
                            action = Math.floor(Math.random() * 3);
                        }
                        else{
                            action = 3 // making it waterbomb with a probability of 10%
                        }
                    }

                }
            }

            //If i don't have dynamite to use
            else{
                if (this.theirDynamitesUsed > 95 || this.theirDynamitesUsed < 10){ //these are variables that could be changed
                     //if the number of dynamites used = 100, then probability of water should be 0
                    action = Math.floor(Math.random() * 3);
                }
                else{

                    let cutLine = 0.9;
                    let whichAction = Math.random();
                    if (whichAction <= cutLine){
                        action = Math.floor(Math.random() * 3);
                    }
                    else{
                        action = 3 // making it waterbomb with a probability of 10%
                    }
                }
                
            }

        }

        if (action == 4){
            this.myDynamitesUsed += 1
            console.log(this.myDynamitesUsed)
        }
        return codes[action]
    }
    
}

export = new Bot();
