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
    static generateTraditionalDeck(aceIsFourteen: boolean=false, twoIsFifteen: boolean=false): Deck {
        const cards: Card[] = [];

        [Suits.Clubs, Suits.Diamonds, Suits.Hearts, Suits.Spades].forEach((suit => {
            for (let i=1; i<14; i++) {
                const card = new Card(suit, i, aceIsFourteen, twoIsFifteen);
                cards.push(card);
            }
        }));

        return new Deck(cards);
    }
    
    addCards(newCards: Card | Card[]): void { 
        if (newCards instanceof Card) {
            this._cards.push(newCards); 
        } else {
            this._cards.concat([...newCards]);
        }
    }

    removeCards(cardsToRemove: Card | Card[]): void {
        if (cardsToRemove instanceof Card) {
            this._cards = this._cards.filter(c => c !== cardsToRemove);
        } else {
            cardsToRemove.forEach(card => {
                this._cards = this._cards.filter(c => c !== card);
            });
        }
    }

    hasCard(card: Card): boolean {
        return this._cards.includes(card);
    }

    get cards(): Card[] { return this._cards; }

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

        sortedCards = this._cards.sort((c1, c2) => c1.getPips() - c2.getPips());

        sortedCards.forEach((card) => {
            if (aceIsFourteen && card.getPips() === 1) { heldCards.push(card); } 
            else if (twoIsFifteen && card.getPips() === 2) { heldCards.push(card); } 
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
    private _topCardQuantity: number = 0;

    constructor(cards: Card[]=[]) { 
        super(cards); 
        this._topCardQuantity = 0;
    }

    peekTopCard(): Card | undefined { return this._topCard; }

    peekTopCards(): Card[] { 
        const topCards: Card[] = [];
        for (let i=this._cards.length-1; i>this._cards.length-this._topCardQuantity-1; i--) {
            topCards.push(this._cards[i]);
        }
        return topCards;
    }

    peekTopQuantity(): number {
        return this._topCardQuantity;
    }

    peekTopCardQuantityTuple(): [Card, number] | undefined { 
        if (this._topCard && this._topCardQuantity) {
            return [this._topCard, this._topCardQuantity];
        } else {
            return undefined;
        }
    }

    /**
     * @returns number of Pips for the Top Card (0, if Pile is empty)
     */
    peekTopPips(): number {
        if (this._topCard) { return this._topCard.getPips(); }
        return 0;
    }

    override addCards(newCards: Card | Card[]) { 
        if (newCards instanceof Card) {
            this._cards.push(newCards);
            this._topCard = newCards; 
            this._topCardQuantity = 1;
        } else {
            this._cards = this._cards.concat([...newCards]);
            this._topCard = newCards[newCards.length-1];
            this._topCardQuantity = newCards.length;
        }
        
    }

}

/**
 * A Deck that each Player holds in their Hand
 */
export class PlayerDeck extends Deck {
    private _selectedCards: Card[] = [];

    constructor(private _playerID: number, protected _cards: Card[]) {
        super(_cards);
    }

    get playerID() { return this._playerID; }

    addSelectedCards(cards: Card | Card[]): void {
        if (cards instanceof Card) {
            if (!this._selectedCards.includes(cards)) { this._selectedCards.push(cards); }
        } else {
            let cardsToSelect: Card[] = cards.filter(c => !this._selectedCards.includes(c))
            this._selectedCards.concat([...cardsToSelect]);
        }
    }

    removeSelectedCards(cards: Card | Card[]): void {
        if (cards instanceof Card) {
            this._selectedCards = this._selectedCards.filter(c => c !== cards);
        } else {
            this._selectedCards = this._selectedCards.filter(c => !cards.includes(c));
        }
    }

    /**
     * 
     * @param quota required frequency to be added to the return array (2=pair, 3=trio, 4=quad)
     * @param orBetter determines if Cards with more than the quota are also added
     * @returns an array of Cards that meet the quota
     */
    getMultiples(quota: number=2, orBetter: boolean=false): Card[] {
        const repeatCards: Card[][] = [];
        let cardPairs: Card[] = [];

        this._cards.forEach(card => {
            if (repeatCards[card.getPips()] === undefined) { repeatCards[card.getPips()] = []; }
            repeatCards[card.getPips()].push(card);
        });

        repeatCards.forEach(repeatCard => {
            if (repeatCard.length === quota) { cardPairs = cardPairs.concat([...repeatCard]); }
            else if (orBetter && repeatCard.length > quota) { cardPairs = cardPairs.concat([...repeatCard]); }
        });

        return cardPairs;
    }

    getSelectedCards(): Card[] {
        return this._selectedCards;
    }

    getLastSelectedCard(): Card {
        return this._selectedCards[this._selectedCards.length-1];
    }

    hasSelectedCard(card: Card): boolean {
        return this._selectedCards.includes(card);
    } 

    takeSelectedCards(): Card[] {
        const takenCards = [...this._selectedCards];
        this._cards = this._cards.filter(c => !takenCards.includes(c));
        this._selectedCards = [];
        return takenCards;
    }

    takeCardsAt(indecies: number | number[]): Card | Card[] {
        if (typeof indecies === 'number') {
            const card: Card = this._cards.at(indecies) as Card;
            this._cards.splice(indecies, 1);
            return card;
        } else {
            const takenCards: Card[] = [];
            indecies.forEach(index => {
                takenCards.push(this.takeCardsAt(index) as Card);
            });
    
            return takenCards;
        }
    }

    // assumes Deck is sorted
    takeBestCard(): Card { 
        const bestCard: Card = this.takeCardsAt(this._cards.length-1) as Card;
        return bestCard;
    }

    takeWorstCard(): Card {
        const worstCard: Card = this.takeCardsAt(0) as Card;
        return worstCard;
    }
}