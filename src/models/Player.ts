import Card from "./Card";
import { PlayerDeck } from "./Deck";

export class Player {
    constructor(private _playerDeck: PlayerDeck) {}
}

export default Player;