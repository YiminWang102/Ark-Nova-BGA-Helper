
export function observeLogChanges(logSelector, trackerCallback, stateManager) {
    const logContainer = document.querySelector(logSelector);
  
    if (!logContainer) {
      return;
    }
  
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const logEntry = node.textContent.trim().replace(/\n|\r/g, "");
              trackerCallback(logEntry, stateManager); // Process the log entry
            }
          });
        }
      });
    });
  
    observer.observe(logContainer, { childList: true, subtree: false });
  }




export function processLogEntry(logEntry, stateManager) {
    const patterns = [
        {
            regex: /^(.*) takes (.*) in reputation range from the display/,
            action: 'take',
        },
        {
            regex: /^(.*) snaps (.*) from the display/,
            action: 'take',
        },
        {
            regex: /^(.*) draws (.*) sponsor/,
            action: 'take',
        },
        {
            regex: /^(.*) plays (.*) for/,
            action: 'play',
        },
        {
            regex: /^(.*) plays (.*)$/,
            action: 'play',
        },
    ];

    for (const { regex, action } of patterns) {
        const match = logEntry.match(regex);
    
        if (match) {
            const playerName = match[1].trim();
            const cardName = match[2].trim();
    
          // Check if the player is the opponent
            const opponentName = stateManager.getState().playerNames.opponentName
            if (playerName == opponentName) {
                if (action === 'take') {
                  stateManager.addCard(cardName); // Add the card to the tracker
                } else if (action === 'play') {
                  stateManager.removeCard(cardName); // Remove the card from the tracker
                }
            }
            return; // Exit after processing the first matching pattern
        }
    }
}