import { injectTrackerUI, renderTrackerUI } from './trackerUI.js';
import { observeLogChanges } from './logParser.js';
import { updatePlayerNames } from './playerNameParser.js';
import { updateCardTags, observeCards } from './cardTagger.js';
import { stateManager } from './stateManager.js';
import { CardTracker } from './cardTracker.js';
import { BoardChecker } from './boardChecker.js';

function onStart() {
  stateManager.loadState();
  stateManager.onStateChange(renderTrackerUI);
  cardTracker = new CardTracker();
  boardChecker = new BoardChecker();

  injectTrackerUI();

  setTimeout(() => {
    updatePlayerNames();
    updateCardTags();

    observeLogChanges();
    observeCards();

    boardChecker.getYourPlayedSponsors()
  }, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    onStart(stateManager)
  });
} else {
  onStart(stateManager);
}