import Card from "./Card";

export class PlayerHand {
    constructor(private _cards: Card[]) {}
    get cards() { return this._cards };
    private set cards(cards: Card[]) { this._cards = cards; }
    sortCards(aceIsFourteen: boolean=false, twoIsFifteen: boolean=false) { this.cards = Card.sortCards(this._cards, aceIsFourteen, twoIsFifteen) }
    
}

export class Player {
    constructor(private _playerHand: PlayerHand) {}
}

export default Player;