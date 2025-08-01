
export function getPlayersPlayedSponsors() {
    const playerBoards = document.querySelectorAll('.player-board-inPlay-sponsors');

    const yourBoard = playerBoards[0];
    const opponentBoard = playerBoards[1]; 

    return { yourBoard, opponentBoard };
}

export function getYourPlayedSponsors() {
    const { yourBoard, opponentBoard } = getPlayersPlayedSponsors();
    
    const cards = yourBoard.querySelectorAll('.sponsor-card');
    const cardNames = [];
    cards.forEach(cardEl => {
        const cardName = getCardNameFromId(cardEl);
        cardNames.push(cardName);
    })

    return cardNames;
}

export function getOpponentPlayedSPonsors() {
    const { yourBoard, opponentBoard } = getPlayersPlayedSponsors();
    
    const cards = opponentBoard.querySelectorAll('.sponsor-card');
    const cardNames = [];
    cards.forEach(cardEl => {
        const cardName = getCardNameFromId(cardEl);
        cardNames.push(cardName);
    })

    return cardNames; 
}

export function getAllPlayedSponsors() {
    const { yourBoard, opponentBoard } = getPlayersPlayedSponsors();
    
    const opponentCards = opponentBoard.querySelectorAll('.sponsor-card');
    const cardNames = [];
    opponentCards.forEach(cardEl => {
        const cardName = getCardNameFromId(cardEl);
        cardNames.push(cardName);
    })

    const youCards = yourBoard.querySelectorAll('.sponsor-card');
    youCards.forEach(cardEl => {
        const cardName = getCardNameFromId(cardEl);
        cardNames.push(cardName);
    })

    return cardNames; 
}

export function getCardNameFromId(cardEl) {
    const id = cardEl.id || '';
    const match = id.match(/^card-[^_]+_(.+)$/);
    return match ? match[1] : null;
}