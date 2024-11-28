import { pubSub } from "./pubSub";
import { stateManager } from "./stateManager";
import { DRAW, PLAY } from './logParser';

export class CardTracker {
    constructor() {
        pubSub.subscribe(DRAW, this.handleCardDrawn.bind(this));
        pubSub.subscribe(PLAY, this.handleCardPlayed.bind(this));
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
}