import { injectTrackerUI, renderTrackerUI } from './trackerUI.js';
import { observeLogChanges } from './logParser.js';
import { updatePlayerNames } from './playerNameParser.js';
import { updateCardTags, observeCards } from './cardTagger.js';
import { stateManager } from './stateManager.js';
import { CardTracker } from './cardTracker.js';

function onStart() {
  stateManager.loadState();
  stateManager.onStateChange(renderTrackerUI);
  cardTracker = new CardTracker();

  injectTrackerUI();

  setTimeout(() => {
    updatePlayerNames();
    updateCardTags();

    observeLogChanges();
    observeCards();
  }, 500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    onStart(stateManager)
  });
} else {
  onStart(stateManager);
}