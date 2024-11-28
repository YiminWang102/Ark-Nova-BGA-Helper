function parseConservationProjects() {
    const conservationProjects = [];
  
    // Parse base projects
    const baseProjectElements = document.querySelectorAll('#base-projects-holder .project-holder');
    baseProjectElements.forEach((project) => {
        const badge = project.querySelector('.badge-icon');
        if (badge) {
            const projectType = badge.getAttribute('data-type');
            
            if (projectType) {
                conservationProjects.push({ type: 'BASE', projectType });
            }
        }
    });

    function parseNonBaseProject(project) {
        const badge = project.querySelector('.badge-icon');
        const pzooIcon = project.querySelector('.icon-partner-zoo');
        const releaseIcon = project.querySelector('.icon-release-animal');

        if (badge) {
            const projectType = badge.getAttribute('data-type');
            
            if (projectType) {
                if (pzooIcon) {
                    conservationProjects.push({ type: 'PROG', projectType });
                }

                if (releaseIcon) {
                    conservationProjects.push({ type: 'RELEASE', projectType });
                }
            }
        }
    }

    // Parse project holder
    const activeProjects = document.querySelectorAll('#projects-holder .project-holder');
    activeProjects.forEach(parseNonBaseProject);

    // Parse hand and display for projects
    const displayProjectCards = document.querySelectorAll('#cards-pool .project-card');
    displayProjectCards.forEach(parseNonBaseProject);

    const handProjectCards = document.querySelectorAll('.player-board-hand .project-card');
    handProjectCards.forEach(parseNonBaseProject);

    return conservationProjects;
}

function extractCardIcons(cardElement) {
    const topRightDiv = cardElement.querySelector('.ark-card-top-right');
    if (!topRightDiv) return [];
  
    // Extract unique icons using a Set
    const badges = topRightDiv.querySelectorAll('.badge-icon');
    const icons = new Set(Array.from(badges).map((badge) => badge.getAttribute('data-type')));
    return Array.from(icons); // Convert Set back to an array
}

function matchCardToProjects(cardElement, conservationProjects) {
    const cardIcons = extractCardIcons(cardElement); // Deduplicated icons from the card
    const matches = [];

    // Match card icons with conservation project types
    for (const project of conservationProjects) {
        if (cardIcons.includes(project.projectType)) {
            matches.push(project);
        }
    }

    return matches;
}

function tagMatchingCards(projects) {
    const cardAreas = ['.card-pool-folder .ark-card', '.player-board-hand .ark-card'];
  
    cardAreas.forEach((area) => {
        const cards = document.querySelectorAll(area);
    
        cards.forEach((card) => {
            if (card.getAttribute('data-unmarked') === 'true') return;

            const matchingProjects = matchCardToProjects(card, projects);
            tagCardWithMatches(card, matchingProjects);
        });
    });
}

function tagCardWithMatches(cardElement, projects) {
    let tagContainer = cardElement.querySelector('.tag-container');
    if (tagContainer) {
        tagContainer.remove();
    }

    if (!projects.length) {
        removeCardOverlay(cardElement);
        return;
    }

    addCardOverlay(cardElement);
    addUnmarkButton(cardElement);

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
        const badge = createTagElement(project.type, project.type);
        tagContainer.appendChild(badge);
    });

}

const projectTypeColors = {
    BASE: '#4CAF50',    // Green
    RELEASE: '#FF5722', // Orange
    PROG: '#2196F3',    // Blue
    DEFAULT: '#9E9E9E'  // Gray (for unknown types)
};

function createTagElement(tagText, projectType) {
    const color = projectTypeColors[projectType] || projectTypeColors.DEFAULT;

    const badge = document.createElement('div');
    badge.textContent = tagText;
    badge.className = 'tag-container-badge';
    badge.style.backgroundColor = color;
    badge.style.color = 'white';
    badge.style.borderRadius = '12px';
    badge.style.padding = '4px 8px';
    badge.style.marginBottom = '4px';
    badge.style.fontSize = '12px';
    badge.style.fontWeight = 'bold';
    badge.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    badge.style.pointerEvents = 'none';
    return badge;
}

export function updateCardTags() {
    const projects = parseConservationProjects();
    tagMatchingCards(projects);
}

export function observeCards() {
    const cardAreaClasses = [
        '#cards-pool',
        '.player-board-hand',
    ];

    cardAreaClasses.forEach((cardClass) => {
        const cardArea = document.querySelector(cardClass);
        if (cardArea) {
            const observer = new MutationObserver((mutations) => {
                const relevantMutations = mutations.filter((mutation) => {
                    // Ignore mutations affecting overlay or tags
                    const isOverLay = mutation.target.classList.contains('card-overlay');
                    const isTagContainer = mutation.target.classList.contains('tag-container');
                    const isTagContainerBadge = mutation.target.classList.contains('tag-container-badge');

                    return !(isOverLay || isTagContainer || isTagContainerBadge);
                });
                if (relevantMutations.length > 0) {
                    observer.disconnect();
                    updateCardTags();
                    setTimeout(() => {
                        observer.observe(cardArea, { childList: true, subtree: true })
                    }, 300)
                }
            });

            observer.observe(cardArea, { childList: true, subtree: true });
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

function addUnmarkButton(cardElement) {
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
            unmarkCard(cardElement);
        });
        cardElement.appendChild(unmarkButton);
    }
}

function unmarkCard(cardElement) {
    // Remove tags
    const tagContainer = cardElement.querySelector('.tag-container');
    if (tagContainer) tagContainer.remove();

    // Remove overlay
    removeCardOverlay(cardElement);
    removeUnmarkButton(cardElement);
    // Mark card as unmarked
    cardElement.setAttribute('data-unmarked', 'true');
}

function removeUnmarkButton(cardElement) {
    const unmarkButton = cardElement.querySelector('.unmark-button'); // Find the button
    if (unmarkButton) {
        unmarkButton.remove(); // Remove the button
    } else {
        return;
    }
}