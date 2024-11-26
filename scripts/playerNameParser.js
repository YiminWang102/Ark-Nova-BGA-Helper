export function parsePlayerNames() {
    // Replace these selectors with the actual ones from the page
    const playerNames = document.querySelectorAll('.player-name');
    const yourNameElement = playerNames ? playerNames[0] : null;
    const opponentNameElement = playerNames ? playerNames[1] : null;
  
    const yourName = yourNameElement ? yourNameElement.textContent.trim() : null;
    const opponentName = opponentNameElement ? opponentNameElement.textContent.trim() : null;
  
    return { yourName, opponentName };
  }
  