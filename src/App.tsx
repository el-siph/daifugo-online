import React, { useEffect, useState } from 'react';
import './App.css';
import Card, { PlayerCount } from './models/Card';
import CardComponent from './components/CardComponent';
import { Deck, PileDeck, PlayerDeck } from './models/Deck';

const ACE_IS_FOURTEEN = true;
const TWO_IS_FIFTEEN = true;
const DEFAULT_PLAYER_COUNT = 4;

function App() {

  const [deck, setDeck] = useState<Deck>(new Deck([]));
  const [playerDecks, setPlayerDecks] = useState<PlayerDeck[]>([]);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(DEFAULT_PLAYER_COUNT);
  const [currentPlayerID, setCurrentPlayerID] = useState<number>(-1);
  const [currentPile, setCurrentPile] = useState<PileDeck>(new PileDeck());

  useEffect(() => {
    prepareDeck();
    setCurrentPlayerID(1);
  },[]);

  useEffect(() => {
    prepareDeck();
    if (currentPlayerID > playerCount) { setCurrentPlayerID(playerCount as number) }
  }, [playerCount]);

  const prepareDeck = () => {
    const deck = Deck.generateTraditionalDeck();
    deck.shuffleDeck();
    let playerDecks: PlayerDeck[] = deck.divide(playerCount);
    playerDecks.forEach(deck => { deck.sortCards(ACE_IS_FOURTEEN, TWO_IS_FIFTEEN); })
    setPlayerDecks(playerDecks);
    setDeck(deck);
  }

  const handleShuffleDeck = (): void => {
    if (deck !== null) {
      deck.shuffleDeck();
      const playerDecks: PlayerDeck[] = deck.divide(4);
      setDeck(deck);
      setPlayerDecks(playerDecks);
    }
  }

  const handleCardSelection = (card: Card) => {
    const newPlayerDecks = [...playerDecks];
    const updatedDeck = playerDecks[currentPlayerID-1];
    
    if (updatedDeck.hasSelectedCard(card)) {
      updatedDeck.removeSelectedCards(card);
    } else {
      updatedDeck.addSelectedCards(card);
    }

    newPlayerDecks[currentPlayerID] = updatedDeck;
    setPlayerDecks(newPlayerDecks);

  }

  // Render Components
  const deckDisplay = deck.getCardCount() < 1 ? <h1>One Moment...</h1> : <div className='card-containers'>
    { playerDecks.map((playerDeck, i) => {
      return <div className='player-hand'>
        <h1>Player {i+1}, {playerDeck.getCardCount()} cards</h1>
        { playerDeck.playerID === currentPlayerID && playerDeck.cards.map(card => {
          const playerDeck = playerDecks[currentPlayerID-1];
          return <CardComponent 
            key={`card-${card.suit}${card.pips}`} 
            card={card} 
            handleClick={() => handleCardSelection(card)} 
            isSelected={playerDeck.hasSelectedCard(card)} 
            isSelectable={playerDeck.getSelectedCards().length < 1 || playerDeck.getLastSelectedCard().pips === card.pips}
            />
        })
      }
      </div>
    })}
    </div>

  return (
    <div className="App">
      <section className='debug-actions'>
        <button onClick={() => handleShuffleDeck()}>Shuffle</button>
        <button onClick={() => prepareDeck()}>Shuffle & Sort</button>
        <label># of Players<input type="number" min={1} max={7} value={playerCount} onChange={e => setPlayerCount(e.target.value as unknown as PlayerCount)} /></label>
        <label>Current Player<input type="number" min={1} max={playerCount} value={currentPlayerID} onChange={e => setCurrentPlayerID(parseInt(e.target.value))} /></label>
      </section>

      {deckDisplay}

    </div>
  );
}

export default App;
