export enum Suits {
    Clubs,
    Diamonds, 
    Hearts,
    Spades
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6 | 7;

class Card {
    private _imageURI: string;

    constructor(private _suit: Suits, private _pips: number) {
        this._imageURI = Card.getImageAsset(_suit, _pips);
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

    get pips() { return this._pips; }
    get suit() { return this._suit; }
    get imageURI() { return this._imageURI; }
}


export default Card;