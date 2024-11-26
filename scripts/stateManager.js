export default class StateManager {
    constructor() {
      this.state = {
        playerNames: { yourName: null, opponentName: null },
        trackedCards: [],
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
  
    // Add a card to the tracker
    addCard(cardName) {
      if (!this.state.trackedCards.includes(cardName)) {
        this.state.trackedCards.push(cardName);
        this.saveState();
      }
    }
  
    // Remove a card from the tracker
    removeCard(cardName) {
      const index = this.state.trackedCards.indexOf(cardName);
      if (index !== -1) {
        this.state.trackedCards.splice(index, 1);
        this.saveState();
      }
    }
  
    // Clear all tracked cards
    clearCards() {
      this.state.trackedCards = [];
      this.saveState();
    }
  
    // Get the current state
    getState() {
      return this.state;
    }
  }
  