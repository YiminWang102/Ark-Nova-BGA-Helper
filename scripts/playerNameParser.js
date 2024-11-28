import { stateManager } from "./stateManager";

export function updatePlayerNames() {
    const playerNames = document.querySelectorAll('.player-name');
    const yourNameElement = playerNames ? playerNames[0] : null;
    const opponentNameElement = playerNames ? playerNames[1] : null;
  
    const yourName = yourNameElement ? yourNameElement.textContent.trim() : null;
    const opponentName = opponentNameElement ? opponentNameElement.textContent.trim() : null;

    stateManager.updatePlayerNames(yourName, opponentName);
  }
  