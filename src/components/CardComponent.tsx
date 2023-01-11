import Card from '../models/Card';

interface CardProps {
    card: Card,
    deckType?: string
}

const CardComponent = ({card, deckType='french-trad'}: CardProps):JSX.Element => {
    return (
        <div className='card-container'>
            <img src={require(`../assets/images/decks/${deckType}/${card.imageURI}`)} alt={card.imageURI}></img>
        </div>
    );
};

export default CardComponent;