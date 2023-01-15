import React from 'react';
import Card from '../models/Card';

interface CardProps {
    card: Card,
    deckType?: string,
    handleClick: (event: React.MouseEvent<HTMLElement>) => void,
    isSelected: boolean
}

const CardComponent = ({card, handleClick, deckType='french-trad', isSelected=false}: CardProps):JSX.Element => {
    return (
        <div className='card-container' onClick={handleClick}>
            <img src={require(`../assets/images/decks/${deckType}/${card.imageURI}`)} alt={card.imageURI}></img>
        </div>
    );
};

export default CardComponent;