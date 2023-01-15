import Card, { PlayerCount, Suits } from "./Card";

export class Deck {
    constructor(protected _cards: Card[]) {};
    getCardCount(): number { return this._cards.length; }   
    isEmpty(): boolean { return this._cards.length < 1; }

    /**
     * Produces a standard French-suited deck of 52 cards, not including the Joker
     * @returns a deck of Cards, in Suit/Pip order
     * TODO: add support for Jokers
     */
    static generateTraditionalDeck(): Deck {
        const cards: Card[] = [];

        [Suits.Clubs, Suits.Diamonds, Suits.Hearts, Suits.Spades].forEach((suit => {
            for (let i=1; i<14; i++) {
                const card = new Card(suit, i);
                cards.push(card);
            }
        }));

        return new Deck(cards);
    }

    addCard(newCard: Card) { 
        this._cards.push(newCard); 
    }
    
    addCards(newCards: Card[]) { 
        this._cards.concat([...newCards]);
    }

    /**
     * @returns a randomly-sorted deck of the same Cards
     */
    shuffleDeck(): void {
        const shuffledCards: Card[] = [];
        const deckLength = this._cards.length;

        for (let i=0; i<deckLength; i++) {
            const rand = Math.floor(Math.random() * this._cards.length);
            const nextCard: Card = this._cards.at(rand) as Card;
            shuffledCards.push(nextCard);
            this._cards.splice(rand, 1);
        }

        this._cards = shuffledCards;
    }

    /**
     * Sorts one or more Cards in pips order.
     * @param cards two or more Cards that need to be placed in pips order, usually for individual players' hands
     */
    sortCards(aceIsFourteen: boolean=false, twoIsFifteen: boolean=false, reverseOrder: boolean=false): void {
       let sortedCards: Card[];
       let sortedRegular: Card[] = [];
       let heldCards: Card[] = [];

        sortedCards = this._cards.sort((c1, c2) => c1.pips - c2.pips);

        sortedCards.forEach((card) => {
            if (aceIsFourteen && card.pips === 1) { heldCards.push(card); } 
            else if (twoIsFifteen && card.pips === 2) { heldCards.push(card); } 
            else { sortedRegular.push(card); }
        });

        if (reverseOrder) { sortedCards.reverse(); }

        this._cards = [...sortedRegular, ...heldCards];
    }

    /**
     * @param players number of total players
     * @returns an array of PlayerHands
     */
    divide(players: PlayerCount): PlayerDeck[] {
        const playerDecks: PlayerDeck[] = [];
        const cardsPerHand = Math.floor(this._cards.length/players);

        for (let i=0; i<players; i++) {
            const playerCards = this._cards.slice(cardsPerHand * i, cardsPerHand * (i+1) ) as Card[];
            const playerHand = new PlayerDeck(i+1, playerCards);
            playerDecks[i] = playerHand;
        }
        return playerDecks;
    }
}

/**
 * Deck that sits at the center of the table, where player Cards are deposited.
 */
export class PileDeck extends Deck {
    private _topCard?: Card;
    private _topCardQuantity?: number;

    constructor(cards: Card[]=[]) { 
        super(cards); 
        this._topCardQuantity = 0;
    }

    peekTopCard(): Card | undefined { return this._topCard; }
    peekTopCardQuantityTuple(): [Card, number] | undefined { 
        if (this._topCard && this._topCardQuantity) {
            return [this._topCard, this._topCardQuantity];
        } else {
            return undefined;
        }
    }

    override addCard(newCard: Card) { 
        this._cards.push(newCard); 
        this._topCardQuantity = 1;
    }
    override addCards(newCards: Card[]) { 
        this._cards.concat([...newCards]);
        this._topCardQuantity = newCards.length;
    }
}

/**
 * A Deck that each Player holds in their Hand
 */
export class PlayerDeck extends Deck {
    constructor(private _playerID: number, protected _cards: Card[]) {
        super(_cards);
    }

    get playerID() { return this._playerID; }

    get cards(): Card[] { return this._cards; }

    takeCardAt(index: number): Card {
        const card: Card = this._cards.at(index) as Card;
        this._cards.splice(index, 1);
        return card;
    }

    takeCardsAt(indecies: number[]): Card[] {
        const takenCards: Card[] = [];
        indecies.forEach(index => {
            takenCards.push(this.takeCardAt(index));
        });

        return takenCards;
    }

    // assumes Deck is sorted
    takeBestCard(): Card { 
        const bestCard: Card = this.takeCardAt(this._cards.length-1)
        return bestCard;
    }

    takeWorstCard(): Card {
        const worstCard: Card = this.takeCardAt(0);
        return worstCard;
    }
}