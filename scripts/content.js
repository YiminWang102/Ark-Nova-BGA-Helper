import { injectTrackerUI, renderTrackerUI } from './trackerUI.js';
import { observeLogChanges } from './logParser.js';
import { updatePlayerNames } from './playerNameParser.js';
import { updateCardTags, observeCards } from './cardTagger.js';
import { stateManager } from './stateManager.js';
import { CardTracker } from './cardTracker.js';
import { getYourPlayedSponsors } from './boardChecker.js';

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

    getYourPlayedSponsors()
  }, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    onStart(stateManager)
  });
} else {
  onStart(stateManager);
}