import { debounce } from './utils';
import { parseConservationProjects } from './conservationProjectParser';
import { parseSponsorIcons } from './sponsorIconParser';
import { extractCardIcons } from './cardIconExtractor';

function matchCardToProjects(cardElement, conservationProjects) {
    const cardIcons = extractCardIcons(cardElement); // Deduplicated icons from the card
    const matches = [];

    for (const project of conservationProjects) {
        if (cardIcons.includes(project.projectType)) {
            matches.push(project);
        }
    }

    return matches;
}

function matchCardToSponsorIcons(cardElement, sponsorIcons) {
    const cardIcons = extractCardIcons(cardElement); // Deduplicated icons from the card
    const matches = [];

    for (const sponsorIcon of sponsorIcons) {
        if (cardIcons.includes(sponsorIcon)) {
            matches.push({type:'SPONSOR'});
        }
    }

    return matches;
};

function tagCardsWithMatchingIcons(projects, sponsorIcons) {
    const cardAreas = ['.card-pool-folder .ark-card', '.player-board-hand .ark-card'];
  
    cardAreas.forEach((area) => {
        const cards = document.querySelectorAll(area);
    
        cards.forEach((card) => {
            if (card.getAttribute('data-unmarked') === 'true') return;

            const matchingProjects = matchCardToProjects(card, projects);
            const matchingSponsorIcons = matchCardToSponsorIcons(card, sponsorIcons)

            const matchingIcons = [...matchingProjects, ...matchingSponsorIcons];
            tagCardWithMatchingIcons(card, matchingIcons);
        });
    });
}

function tagCardWithMatchingIcons(cardElement, projects) {
    let tagContainer = cardElement.querySelector('.tag-container');
    if (tagContainer) {
        tagContainer.remove();
    }

    if (!projects.length) {
        removeCardOverlay(cardElement);
        return;
    }

    addCardOverlay(cardElement);
    addIgnoreButton(cardElement);

    // Create or reset the tag container
    tagContainer = document.createElement('div');
    tagContainer.className = 'tag-container';
    tagContainer.style.position = 'absolute';
    tagContainer.style.top = '50%';
    tagContainer.style.left = '50%';
    tagContainer.style.transform = 'translate(-50%, -50%)'; // Center the container
    tagContainer.style.display = 'flex';
    tagContainer.style.flexDirection = 'column';
    tagContainer.style.alignItems = 'center';
    cardElement.style.position = 'relative';
    cardElement.appendChild(tagContainer);

    projects.forEach((project) => {
          // Create and append the new tag
        const badge = createProjectTagElement(project.type, project.type);
        tagContainer.appendChild(badge);
    });

}

const projectTypeColors = {
    DEFAULT: '#9E9E9E',  // Gray (for unknown types)
    BASE: '#4CAF50',    // Green
    RELEASE: '#FF0000', // Red
    PROG: '#FFA500', // Orange
    SPONSOR: '#0000FF',    // Blue
};

function createProjectTagElement(tagText, projectType) {
    const color = projectTypeColors[projectType] || projectTypeColors.DEFAULT;

    const badge = document.createElement('div');
    badge.textContent = tagText;
    badge.className = 'tag-container-badge-matching-project';
    badge.style.backgroundColor = color;
    badge.style.color = 'white';
    badge.style.borderRadius = '12px';
    badge.style.padding = '5px 10px';
    badge.style.marginBottom = '4px';
    badge.style.fontSize = '14px';
    badge.style.fontWeight = 'bold';
    badge.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    badge.style.pointerEvents = 'none';
    return badge;
}

export function updateCardTags() {
    const projects = parseConservationProjects();
    const sponsorIcons = parseSponsorIcons();

    tagCardsWithMatchingIcons(projects, sponsorIcons);
}

export function observeCards() {
    const cardAreaSelectors = [
        '#cards-pool',
        '.player-board-hand',
    ];

    cardAreaSelectors.forEach((selector) => {
        const cardArea = document.querySelector(selector);
        if (cardArea) {
            const debouncedUpdatedCardTags = debounce(() => {
                observer.disconnect();
                updateCardTags();
                setTimeout(() => {
                    observer.observe(cardArea, { childList: true, subtree: true })
                }, 300)
            });

            const observer = new MutationObserver((mutations) => {
                const relevantMutations = mutations.filter((mutation) => {
                    // Ignore mutations affecting overlay or tags
                    const isOverLay = mutation.target.classList.contains('card-overlay');
                    const isTagContainer = mutation.target.classList.contains('tag-container');
                    const isTagContainerBadge = mutation.target.classList.contains('tag-container-badge');

                    return !(isOverLay || isTagContainer || isTagContainerBadge);
                });
                if (relevantMutations.length > 0) {
                    debouncedUpdatedCardTags();
                }
            });

            observer.observe(cardArea, { childList: true, subtree: true });
        }
    });

    const playAreaSelectors = [
        '.player-board-cards',
    ];

    playAreaSelectors.forEach((selector) => {
        const playArea = document.querySelector(selector);
        if (playArea) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.classList && node.classList.contains('ark-card')) {
                                clearCard(node);
                            }
                        });
                    }
                });
            });

            observer.observe(playArea, { childList: true, subtree: true });
        }
    });
}

function addCardOverlay(card) {
    if (card.querySelector('.card-overlay')) {
        return; // Skip adding another overlay
    }

    // Ensure the card is positioned relative for proper overlay positioning
    card.style.position = 'relative';
  
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay'; // Add a class for consistent styling
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.border = '3px solid yellow'; // Adjust color and thickness as needed
    overlay.style.pointerEvents = 'none'; // Ensure the overlay doesn't interfere with interactions
    overlay.style.borderRadius = 'inherit'; // Match the card's border radius
    overlay.style.boxSizing = 'border-box'; // Ensure the border doesn't affect dimensions
  
    // Append the overlay to the card
    card.appendChild(overlay);
}

function removeCardOverlay(card) {
    const overlay = card.querySelector('.card-overlay'); // Find the overlay
    if (overlay) {
        overlay.remove(); // Remove the overlay
    } else {
        return;
    }
}

function addIgnoreButton(cardElement) {
    // Check if the button already exists
    let unmarkButton = cardElement.querySelector('.unmark-button');
    if (!unmarkButton) {
        unmarkButton = document.createElement('button');
        unmarkButton.textContent = '×'; // X symbol
        unmarkButton.className = 'unmark-button';
        unmarkButton.style.position = 'absolute';
        unmarkButton.style.top = '30%'; // 75% from the top
        unmarkButton.style.right = '10px'; // Close to the right edge
        unmarkButton.style.transform = 'translateY(-50%)'; // Center the button vertically at 75%
        unmarkButton.style.backgroundColor = 'Orange'; // Orange background
        unmarkButton.style.color = 'white'; // White text for contrast
        unmarkButton.style.border = 'none'; // Remove default button styling
        unmarkButton.style.borderRadius = '50%'; // Circular shape
        unmarkButton.style.width = '20px'; // Fixed width
        unmarkButton.style.height = '20px'; // Fixed height
        unmarkButton.style.display = 'flex'; // Center the X inside the circle
        unmarkButton.style.alignItems = 'center'; // Center vertically
        unmarkButton.style.justifyContent = 'center'; // Center horizontally
        unmarkButton.style.fontSize = '16px'; // Larger font for X
        unmarkButton.style.cursor = 'pointer'; // Pointer cursor for interactivity
        unmarkButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Subtle shadow for depth
        unmarkButton.style.zIndex = '1000';

        // Add click event to unmark the card
        unmarkButton.addEventListener('click', (event) => {
            event.stopPropagation();
            ignoreCard(cardElement);
        });
        cardElement.appendChild(unmarkButton);
    }
}

function removeUnmarkButton(cardElement) {
    const unmarkButton = cardElement.querySelector('.unmark-button'); // Find the button
    if (unmarkButton) {
        unmarkButton.remove(); // Remove the button
    } else {
        return;
    }
}

function ignoreCard(cardElement) {
    clearCard(cardElement);
    // Mark card as unmarked
    cardElement.setAttribute('data-unmarked', 'true');
}

function clearCard(cardElement) {
    const tagContainer = cardElement.querySelector('.tag-container');
    if (tagContainer) tagContainer.remove();

    // Remove overlay
    removeCardOverlay(cardElement);
    removeUnmarkButton(cardElement);
}