import { stateManager } from "./stateManager";

export function injectTrackerUI() {
  const container = document.createElement('div');
  container.id = 'card-tracker-container';
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.right = '10px';
  container.style.transform = 'translateY(65%)';
  container.style.backgroundColor = '#f9f9f9';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '10px';
  container.style.padding = '15px';
  container.style.zIndex = '10000';
  container.style.width = '280px';
  container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '14px';

  // Add a draggable header
  const header = document.createElement('div');
  header.style.cursor = 'move'; // Cursor changes only over the header
  header.style.backgroundColor = '#ddd';
  header.style.padding = '10px';
  header.style.textAlign = 'center';
  header.style.borderBottom = '1px solid #ccc';
  header.style.borderRadius = '10px';
  header.style.userSelect = 'none'; // Prevent text selection on double-click

  header.textContent = 'Card Tracker';
  container.appendChild(header);

  // Tracker content
  const content = document.createElement('div');
  content.id = 'card-tracker-content'; // Track this element by ID for future reference
  content.innerHTML = `
    <div id="tracker-list" style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 10px; background-color: #fff;">
      <p style="text-align: center; color: #999;">No cards tracked yet.</p>
    </div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between;">
      <button id="add-card-btn" style="
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
      ">
        Add Card
      </button>
      <button id="clear-cards-btn" style="
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
      ">
        Clear All
      </button>
    </div>
  `;
  container.appendChild(content);

  document.body.appendChild(container);

  // Add drag functionality
  makeDraggable(container, header);

  // Example button functionality
  const addCardBtn = container.querySelector('#add-card-btn');
  const trackerList = container.querySelector('#tracker-list');
  addCardBtn.addEventListener('click', () => {
      const cardName = prompt('Enter card name:');
      if (cardName) {
          stateManager.addOpponentTrackedCard(cardName);
      }
  });

  const clearCardsBtn = container.querySelector('#clear-cards-btn');
  clearCardsBtn.addEventListener('click', () => {
        stateManager.clearOpponentTrackedCards();
  });

  // Double-click header to minimize/maximize
  let contentMinimized = false;
  let originalPosition = null;

  header.addEventListener('dblclick', () => {
    contentMinimized = !contentMinimized;
    const content = document.getElementById('card-tracker-content');

    // The popup "jumps" when we minimize it if we haven't dragged it,
    // so we store the original position to fix that.
    // Use container.style.left to check if it's in its original position.
    if (!container.style.left && !originalPosition) {
      const rect = container.getBoundingClientRect();
      originalPosition = {
        top: rect.top,
        left: rect.left
      };
    }

    // Toggle content visibility
    content.style.display = contentMinimized ? 'none' : 'block';

    // Apply position fixing only if we haven't manually dragged
    if (!container.style.left && originalPosition) {
      container.style.transform = '';
      container.style.top = `${originalPosition.top}px`;
      container.style.left = `${originalPosition.left}px`;
    }
  });
}

export function renderTrackerUI() {
  const opponentTrackedCards = stateManager.getOpponentTrackedCards();
  const trackerList = document.querySelector('#tracker-list');
  if (!trackerList) return;

  // Clear the existing UI
  trackerList.innerHTML = '';

  // Add each card in the state
  if (opponentTrackedCards.length > 0) {
    opponentTrackedCards.forEach((cardName) => {
      const cardElement = document.createElement('div');
      cardElement.style.display = 'flex';
      cardElement.style.justifyContent = 'space-between';
      cardElement.style.alignItems = 'center';
      cardElement.style.border = '1px solid #ddd';
      cardElement.style.borderRadius = '4px';
      cardElement.style.padding = '5px';
      cardElement.style.marginBottom = '5px';
      cardElement.style.backgroundColor = '#f9f9f9';

      // Card text
      const cardText = document.createElement('span');
      cardText.textContent = cardName;

      // Remove button
      const removeButton = createRemoveButton();

      // Add event listener to remove the card
      removeButton.addEventListener('click', () => {
        stateManager.removeOpponentTrackedCard(cardName); // Call stateManager to remove the card
      });

      // Append text and button to the card element
      cardElement.appendChild(cardText);
      cardElement.appendChild(removeButton);

      trackerList.appendChild(cardElement);
    });
  } else {
    // Add a placeholder message if no cards are tracked
    trackerList.innerHTML = '<p style="text-align: center; color: #666;">No cards tracked yet.</p>';
  }
}

function makeDraggable(container, dragHandle) {
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

  // Mouse down only on the drag handle
  dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;

    // Calculate the offset from the mouse to the container's position
    const rect = container.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.style.cursor = 'grabbing'; // Change cursor when dragging
  });

  // Mouse move to drag
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Calculate the new position
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = ''; // Remove centering transform while dragging
  });

  // Mouse up to stop dragging
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      document.body.style.cursor = 'default'; // Reset cursor when not dragging
    }
  });
}

function createRemoveButton() {
  const removeButton = document.createElement('button');
  removeButton.textContent = '×'; // Use a more aesthetic "X" symbol
  removeButton.style.backgroundColor = 'white'; // Transparent background
  removeButton.style.color = '#f44336'; // Red color for visibility
  removeButton.style.border = 'none'; // Remove default button border
  removeButton.style.borderRadius = '50%'; // Circular shape
  removeButton.style.width = '24px'; // Fixed size
  removeButton.style.height = '24px';
  removeButton.style.cursor = 'pointer'; // Indicate interactivity
  removeButton.style.display = 'flex'; // Center the "X"
  removeButton.style.alignItems = 'center';
  removeButton.style.justifyContent = 'center';
  removeButton.style.fontWeight = 'bold'; // Bold font for visibility
  removeButton.style.fontSize = '16px'; // Adjust font size for balance
  removeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)'; // Add slight shadow for depth
  removeButton.style.transition = 'transform 0.2s ease, background-color 0.2s ease'; // Smooth hover effects

  // Hover effect
  removeButton.addEventListener('mouseenter', () => {
    removeButton.style.transform = 'scale(1.2)'; // Slightly enlarge
    removeButton.style.backgroundColor = '#fddcdc'; // Add subtle red background
  });

  removeButton.addEventListener('mouseleave', () => {
    removeButton.style.transform = 'scale(1)'; // Reset size
    removeButton.style.backgroundColor = 'transparent'; // Reset background
  });

  return removeButton;
}
