import { pubSub } from "./pubSub";

export const DRAW = 'DRAW';
export const PLAY = 'PLAY';
export const SKIP = 'SKIP';
export const START = 'START';
export const END = 'END';


const patterns = [
    {
        regex: /^(.*) is now/, // skip
        action: SKIP,
    },
    {
        regex: /^You draw (.*) from the deck (scoring cards)/, // start the game
        action: START,
    },
    {
        regex: /^The end of the game: (.*) wins!/, // start the game
        action: END,
    },
    {
        regex: /^(.*) takes (.*) in reputation range from the display/, // draw from rep
        action: DRAW,
    },
    {
        regex: /^(.*) snaps (.*) from the display/, // snapping (cards @ 5, income, reptile)
        action: DRAW,
    },
    {
        regex: /^(.*) draws (.*) sponsor/, // hollywood hills
        action: DRAW,
    },
    {
        regex: /^(.*) keeps (.*?) card/, // hunting
        action: DRAW,
    },
    {
        regex: /^(.*) takes (.*?) from the diplay/, // sponsor magnet
        action: DRAW,
    },
    {
        regex: /^(.*) plays (.*) for/, // animal
        action: PLAY,
    },
    {
        regex: /^(.*) plays (.*)/, // sponsor
        action: PLAY,
    },
    {
        regex: /^(.*) plays a new conservation project: (.*)$/, // conservation project
        action: PLAY,
    },
];

function parseLogEntry(logEntry) {
    for (const { regex, action } of patterns) {
        const match = logEntry.match(regex);

        if (match) {
            if (action == START) {
                pubSub.publish(START);
            }
            if (action == END) {
                pubSub.publish(END);
            }
            
            const playerName = match[1] ? match[1].trim() : undefined;
            const cardNames = match[2] ? match[2].trim() : undefined;

            cardNames.split(',').forEach(cardName => {
                cardName = cardName.trim();

                if (!isNaN(cardName)) {
                    return;
                }
                if (action === DRAW) {
                    pubSub.publish(DRAW, { playerName, cardName });
                }
                if (action === PLAY) {
                    pubSub.publish(PLAY, { playerName, cardName });
                }
            });

            return; // Exit after processing the first matching pattern
        }
    }
}

export function observeLogChanges() {
    const logContainer = document.querySelector('#logs');
  
    if (!logContainer) {
        return;
    }
  
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const logEntry = node.textContent.trim().replace(/\n|\r/g, "");
                    parseLogEntry(logEntry);
                }
            });
            }
        });
    });
  
    observer.observe(logContainer, { childList: true, subtree: false });
}
