export function extractCardIcons(cardElement) {
    const topRightDiv = cardElement.querySelector('.ark-card-top-right');
    if (!topRightDiv) return [];
  
    // Extract unique icons using a Set
    const badges = topRightDiv.querySelectorAll('.badge-icon');
    const icons = new Set(Array.from(badges).map((badge) => badge.getAttribute('data-type')));
    return Array.from(icons); // Convert Set back to an array
}