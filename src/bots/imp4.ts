//ideas - should you change your strategy if you are about to win???



import { Gamestate, BotSelection } from '../models/gamestate';

const codes = {
    0: 'P',
    1: 'R',
    2: 'S',
    3: 'W',
    4: 'D',
}

class Bot {
    draws = 0.3;
    DDraws = 0.3;
    theirDynamiteAfterDDraw = 0.1;
    theirClassicAfterDDraw = 0.1;
    theirWaterAfterDDraw = 0.1;
    myDynamitesUsed = 0;
    theirDynamitesUsed = 0;
    theirDynamiteAfterDraw = 0.1;
    theirClassicAfterDraw = 0.1;
    theirWaterAfterDraw = 0.1;
    theirWaterUsed = 0 // some strategies don't use any water at all - therefore could adapt so that if = 0, and points up for grabs >= 2 then use dynamite
    turn = 0;
    pointsToGain = 1; //a points up for grabs variable - and if more points than higher chance of using dynamite

    makeMove(gamestate: Gamestate): BotSelection {

        // COLLECTING DATA
        if (this.turn != 0) {

            //check if it is a draw - if so use dynamite (chance 50,50)
            var lastOutcome = gamestate.rounds[gamestate.rounds.length - 1];
            var myAction = lastOutcome.p1;
            var theirAction = lastOutcome.p2;

            if (theirAction == 'D') {
                this.theirDynamitesUsed += 1
            }
            if (theirAction == 'W') {
                this.theirWaterUsed += 1
            }
            if (this.pointsToGain > 1) {
                if (theirAction == 'D') {
                    this.theirDynamiteAfterDraw += 1;
                }
                else if (theirAction == 'W') {
                    this.theirWaterAfterDraw += 1;
                }
                else {
                    this.theirClassicAfterDraw += 1;
                }
            }

            if (myAction == theirAction) {
                this.pointsToGain += 1
                this.draws += 1;
            }
            else {
                this.pointsToGain = 1
            }


        }
        this.turn += 1;

        var action;
        if (this.pointsToGain == 1) {
            //if points up for grabs = 1, then I will just use the classical ones
            action = Math.floor(Math.random() * 3)
        }
        else { //more points up for grabs is greater
            if (this.theirDynamitesUsed < 90) {
                let whichroute = Math.random();
                let waterThreshold = this.theirDynamiteAfterDraw / this.draws;
                let classicThreshold = waterThreshold + this.theirWaterAfterDraw / this.draws;
                //if the person is almost always using dynamite
                if (whichroute < waterThreshold) {
                    let cutLine = 0.8
                    let whichAction = Math.random();
                    if (whichAction <= cutLine) {
                        action = 3; // making it waterbomb with a probability of 80%
                    }
                    else {
                        action = Math.floor(Math.random() * 3);
                    }
                }
                //if the person is almost always using water
                else if (whichroute < classicThreshold) {
                    let cutLine = 0.8
                    let whichAction = Math.random();
                    if (whichAction <= cutLine) {
                        action = Math.floor(Math.random() * 3);; // making it classic with a probability of 80%
                    }
                    else {
                        if (this.myDynamitesUsed < 99) {
                            action = 3 + Math.floor(Math.random() * 2);
                        }
                        else {
                            action = Math.floor(Math.random() * 4)
                        }
                    }
                }
                //the person is using mostly classical moves (potentially saving dynamite)
                else {
                    if (this.myDynamitesUsed < 99) { //this is a variable that could be changed
                        //calculating probability of me using dynamite (this could also change)
                        let cutLine = 0.4
                        if (this.pointsToGain > 2) {
                            cutLine = 0.75
                        }
                        else {
                            cutLine = 0.9
                        }
                        let whichAction = Math.random();
                        if (whichAction <= cutLine) {
                            action = 4
                        }
                        else {
                            let cutLine = 0.95;
                            let whichAction = Math.random();
                            if (whichAction <= cutLine) {
                                action = Math.floor(Math.random() * 3);
                            }
                            else {
                                action = 3 // making it waterbomb with a probability of 5%
                            }

                        }

                    }
                    else { //I don't have dynamite and they do have dynamite
                        let cutLine = 0.9;
                        let whichAction = Math.random();
                        if (whichAction <= cutLine) {
                            action = Math.floor(Math.random() * 3);
                        }
                        else {
                            action = 3 // making it waterbomb with a probability of 10%
                        }


                    }
                }
            }
            else {//they dont have many dynamite left 
                //I do have dynamite, they dont have dynamite
                if (this.myDynamitesUsed < 99) { //this is a variable that could be changed
                    //calculating probability of me using dynamite (this could also change)
                    let cutLine = 0.5
                    if (this.pointsToGain > 2) {
                        cutLine = 0.75
                    }
                    else {
                        cutLine = 0.9
                    }
                    let whichAction = Math.random();
                    if (whichAction <= cutLine) {
                        action = 4
                    }
                    else {
                        action = Math.floor(Math.random() * 3);
                    }
                }
                else { //I don't have dynamite and they dont have dynamite
                    action = Math.floor(Math.random() * 3);
                }
            }
        }
        if (action == 4) {
            this.myDynamitesUsed += 1
        }
        return codes[action]

    }
}

export = new Bot();
