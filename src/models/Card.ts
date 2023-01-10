import { PlayerHand } from "./Player";

export enum Suits {
    Clubs,
    Diamonds, 
    Hearts,
    Spades
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6 | 7;

class Card {

    /**
     * Produces a standard French-suited deck of 52 cards, not including the Joker
     * @returns a deck of Cards, in Suit/Pip order
     */
    static generateTraditionalDeck():Card[] {
        const deck: Card[] = [];

        [Suits.Clubs, Suits.Diamonds, Suits.Hearts, Suits.Spades].forEach((suit => {
            for (let i=1; i<14; i++) {
                const card = new Card(suit, i);
                deck.push(card);
            }
        }));

        return deck;
    }


    /**
     * @param deck a generated deck of Cards
     * @returns a randomly-sorted deck of the same Cards
     */
    static shuffleDeck(deck: Card[]): Card[] {
        const shuffledDeck: Card[] = [];
        const deckLength = deck.length;

        for (let i=0; i<deckLength; i++) {
            const rand = Math.floor(Math.random() * deck.length);
            const nextCard: Card = deck.at(rand) as Card;
            shuffledDeck.push(nextCard);
            deck.splice(rand, 1);
        }

        return shuffledDeck;
    }

    /**
     * @param deck a (pre-shuffled) deck of Cards
     * @param players number of total players
     * @returns an array of PlayerHands
     */
    static divideDeck(deck: Card[], players: PlayerCount): PlayerHand[] {
        const playerHands: PlayerHand[] = [];
        const cardsPerHand = Math.floor(deck.length/players);

        for (let i=0; i<players; i++) {
            const playerCards = deck.slice(cardsPerHand * i, cardsPerHand * (i+1) ) as Card[];
            const playerHand = new PlayerHand(playerCards);
            playerHands[i] = playerHand;
        }
        return playerHands;
    }

    static getImageAsset(suit: Suits, pip: number): string {
        let uri: string = "";
        switch(suit) {
            case Suits.Clubs:
                uri += "k";
                break;
            case Suits.Diamonds:
                uri += "l";
                break;
            case Suits.Hearts:
                uri += "s";
                break;
            case Suits.Spades:
                uri += "p";
                break;
        }

        switch(pip) {
            case 1: 
                uri += "a";
                break;
            case 11:
                uri += "j";
                break;
            case 12:
                uri += "q";
                break;
            case 13:
                uri += "k";
                break;
            default:
                uri += pip;
        }

        return uri += ".png";
    }

    static getSuitName(suit: Suits): string {
        switch(suit) {
            case Suits.Clubs:
                return "Clubs";
            case Suits.Diamonds:
                return "Diamonds";
            case Suits.Hearts:
                return "Hearts";
            default: 
                return "Spades";
        }
    }


    static getPipName(pips: number): string {
        if (pips === 1) return "Ace";
        if (pips < 11) { return `${pips}` };
        
        switch (pips) {
            case 11:
                return "Jack";
            case 12:
                return "Queen";
            case 13: 
                return "King";
        }

        return "Undefined";
    }

    private _imageURI: string;

    constructor(private _suit: Suits, private _pips: number) {
        this._imageURI = Card.getImageAsset(_suit, _pips);
    }
    get pips() { return this._pips; }
    get suit() { return this._suit; }
    get imageURI() { return this._imageURI; }
}


export default Card;