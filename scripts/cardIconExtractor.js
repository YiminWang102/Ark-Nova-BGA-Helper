export function extractCardIcons(cardElement) {
    const topRightDiv = cardElement.querySelector('.ark-card-top-right');
    if (!topRightDiv) return [];
  
    // get continent and species icons
    const badges = topRightDiv.querySelectorAll('.badge-icon');
    const icons = new Set(Array.from(badges).map((badge) => badge.getAttribute('data-type')));

    // get rock water enclosure icons
    const topLeftDiv = cardElement.querySelector('.ark-card-top-left');
    if (topLeftDiv) {
        const iconEl = topLeftDiv.querySelector(
            '.icon-enclosure-regular-water, .icon-enclosure-regular-water-water, .icon-enclosure-regular-rock, .icon-enclosure-regular-rock-rock'
        );

        if (iconEl) {
            if (iconEl.classList.contains('icon-enclosure-regular-water')) icons.add('Water');
            if (iconEl.classList.contains('icon-enclosure-regular-water-water')) icons.add('Water');
            if (iconEl.classList.contains('icon-enclosure-regular-rock')) icons.add('Rock');
            if (iconEl.classList.contains('icon-enclosure-regular-rock-rock')) icons.add('Rock');
        }
    }
    return Array.from(icons); // Convert Set back to an array
}