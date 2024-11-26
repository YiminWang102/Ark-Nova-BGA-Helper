import { injectTrackerUI, renderTrackerUI } from './trackerUI.js';
import { observeLogChanges, processLogEntry } from './logObserver.js';
import { parsePlayerNames } from './playerNameParser.js';
import { updateCardTags, observeCards } from './cardTagger.js';
import StateManager from './stateManager.js';

const stateManager = new StateManager();

function onStart(stateManager) {
  stateManager.loadState();
  stateManager.onStateChange(renderTrackerUI);

  injectTrackerUI(stateManager);


  setTimeout(() => {
    observeLogChanges('#logs', processLogEntry, stateManager);
    const { yourName, opponentName } = parsePlayerNames();
    stateManager.updatePlayerNames(yourName, opponentName);
    updateCardTags();
    observeCards();
  }, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    onStart(stateManager)
  });
} else {
  onStart(stateManager);
}