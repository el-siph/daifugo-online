import Card from "./Card";

export class PlayerHand {
    constructor(private _cards: Card[]) {}
    get cards() { return this._cards };
}

export class Player {
    constructor(private _playerHand: PlayerHand) {}
}

export default Player;