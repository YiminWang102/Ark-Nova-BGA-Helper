export class BoardChecker {
    getPlayersPlayedSponsors() {
        const playerBoards = document.querySelectorAll('.player-board-inPlay-sponsors');

        const yourBoard = playerBoards[0];
        const opponentBoard = playerBoards[1]; 

        return { yourBoard, opponentBoard };
    }

    getYourPlayedSponsors() {
        const { yourBoard, opponentBoard } = this.getPlayersPlayedSponsors();
        
        const cards = yourBoard.querySelectorAll('.sponsor-card');
        const cardNames = [];
        cards.forEach(cardEl => {
            const cardName = this.getCardNameFromId(cardEl);
            cardNames.push(cardName);
        })
        console.log("sponsors: ", cardNames);

        return cardNames;
    }

    getCardNameFromId(cardEl) {
        const id = cardEl.id || '';
        const match = id.match(/^card-[^_]+_(.+)$/);
        return match ? match[1] : null;
    }
}