class StateManager {
    constructor() {
        this.state = {
            playerNames: { yourName: null, opponentName: null },
            opponentTrackedCards: [],
        };
        this.callbacks = []; // Array of functions to call on state change
    }
  
    // Register a callback to listen for state changes
    onStateChange(callback) {
        this.callbacks.push(callback);
    }
  
    // Notify all registered callbacks
    notifyStateChange() {
        this.callbacks.forEach((callback) => callback(this));
    }
  
    // Load state from chrome.storage
    async loadState() {
        return new Promise((resolve) => {
            chrome.storage.local.get('trackerState', (result) => {
            if (result.trackerState) {
                this.state = result.trackerState;
            }
            resolve(this.state);
            this.notifyStateChange(); // Notify after loading
            });
        });
    }
  
    // Save state to chrome.storage
    saveState() {
        chrome.storage.local.set({ trackerState: this.state }, () => {
            this.notifyStateChange(); // Notify after saving
        });
    }
  
    // Update player names
    updatePlayerNames(yourName, opponentName) {
        this.state.playerNames = { yourName, opponentName };
        this.saveState();
    }

    addOpponentTrackedCard(cardName) {
        if (!this.state.opponentTrackedCards.includes(cardName)) {
            this.state.opponentTrackedCards.push(cardName);
            this.saveState();
        }
    }

    removeOpponentTrackedCard(cardName) {
        const index = this.state.opponentTrackedCards.indexOf(cardName);
        if (index !== -1) {
            this.state.opponentTrackedCards.splice(index, 1);
            this.saveState();
        }
    }
  
    // Clear all tracked cards
    clearOpponentTrackedCards() {
        this.state.opponentTrackedCards = [];
        this.saveState();
    }
  
    // Get the current state
    getState() {
        return this.state;
    }

    getOpponentName() {
        return this.state.playerNames.opponentName;
    }

    getYourName() {
        return this.state.playerNames.yourName;
    }

    getOpponentTrackedCards() {
        return this.state.opponentTrackedCards;
    }
  }
  
  export const stateManager = new StateManager();