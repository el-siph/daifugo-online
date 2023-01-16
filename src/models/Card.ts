export enum Suits {
    Clubs,
    Diamonds, 
    Hearts,
    Spades
}

export type PlayerCount = 2 | 3 | 4 | 5 | 6 | 7;

class Card {
    private _imageURI: string;

    constructor(private _suit: Suits, private _pips: number, private _aceIsFourteen: boolean=false, private _twoIsFifteeen: boolean=false) {
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

    getPips() { 
        if (this._pips === 1 && this._aceIsFourteen) { return 14; }
        else if (this._pips === 2 && this._twoIsFifteeen) { return 15; }
        else { return this._pips; }
    }

    get suit() { return this._suit; }
    get imageURI() { return this._imageURI; }
    get aceEqualsFourteen() { return this._aceIsFourteen; }
    get twoEqualsFifteen() { return this._twoIsFifteeen; }
}


export default Card;