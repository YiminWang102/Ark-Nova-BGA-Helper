import { pubSub } from "./pubSub";
import { stateManager } from "./stateManager";
import { DRAW, PLAY, START, END } from './constants';

export class CardTracker {
    constructor() {
        pubSub.subscribe(DRAW, this.handleCardDrawn.bind(this));
        pubSub.subscribe(PLAY, this.handleCardPlayed.bind(this));
        pubSub.subscribe(START, this.handleGameStart.bind(this));
        pubSub.subscribe(END, this.handleGameEnd.bind(this));
    }

    handleCardDrawn({ playerName, cardName }) {
        if (playerName === stateManager.getOpponentName()) {
            stateManager.addOpponentTrackedCard(cardName);
        }
    }

    handleCardPlayed({ playerName, cardName }) {
        if (playerName === stateManager.getOpponentName()) {
            stateManager.removeOpponentTrackedCard(cardName);
        }
    }

    handleGameStart() {
        stateManager.clearOpponentTrackedCards();
    }

    handleGameEnd() {
        stateManager.clearOpponentTrackedCards();
    }
}