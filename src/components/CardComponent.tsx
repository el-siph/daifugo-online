import React from 'react';
import Card from '../models/Card';

interface CardProps {
    card: Card,
    deckType?: string,
    handleClick: (event: React.MouseEvent<HTMLElement>) => void,
    isSelected: boolean,
    isSelectable: boolean
}

const CardComponent = ({card, handleClick, deckType='french-trad', isSelected=false, isSelectable=true}: CardProps):JSX.Element => {
    return (
        <div key={`${card.getPips()}-of-${card.suit}`} className={`card-container${isSelected ? ' selected' : ''}${!isSelectable ? ' disabled' : ''}`} onClick={handleClick}>
            <img src={require(`../assets/images/decks/${deckType}/${card.imageURI}`)} alt={card.imageURI}></img>
        </div>
    );
};

export default CardComponent;