import React, { useEffect, useState } from 'react';
import './App.css';
import { PlayerCount } from './models/Card';
import CardComponent from './components/CardComponent';
import { Deck, PlayerDeck } from './models/Deck';

const ACE_IS_FOURTEEN = true;
const TWO_IS_FIFTEEN = true;
const DEFAULT_PLAYER_COUNT = 4;

function App() {

  const [deck, setDeck] = useState<Deck>(new Deck([]));
  const [playerDecks, setPlayerDecks] = useState<PlayerDeck[]>([]);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(DEFAULT_PLAYER_COUNT);

  useEffect(() => {
    prepareDeck();
  },[]);

  useEffect(() => {
    prepareDeck();
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

  const deckDisplay = deck.getCardCount() < 1 ? <h1>One Moment...</h1> : <div className='card-containers'>
    {playerDecks.map((playerDeck, i) => {
      return <div className='player-hand'>
        <h1>Player {i+1}, {playerDeck.getCardCount()} cards</h1>
        { playerDeck.cards.map(card => {
          return <CardComponent key={`card-${card.suit}${card.pips}`} card={card} />
        })
      }
      </div>
      
    })}
    </div>

  return (
    <div className="App">
      <button onClick={() => handleShuffleDeck()}>Shuffle</button>
      <button onClick={() => prepareDeck()}>Shuffle & Sort</button>
      <input type="number" min={1} max={7} value={playerCount} onChange={e => setPlayerCount(e.target.value as unknown as PlayerCount)} />
      {deckDisplay}
    </div>
  );
}

export default App;
