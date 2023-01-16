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
    const deck = Deck.generateTraditionalDeck(ACE_IS_FOURTEEN, TWO_IS_FIFTEEN);
    deck.shuffleDeck();
    let playerDecks: PlayerDeck[] = deck.divide(playerCount);
    playerDecks.forEach(deck => { deck.sortCards(ACE_IS_FOURTEEN, TWO_IS_FIFTEEN); })
    setPlayerDecks(playerDecks);
    setDeck(deck);
  }

  const updateCurrentPlayerDeck = (updatedDeck: PlayerDeck): void => {
    const newPlayerDecks = [...playerDecks];
    newPlayerDecks[currentPlayerID-1] = updatedDeck;
    setPlayerDecks(newPlayerDecks);
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
    const updatedDeck = playerDecks[currentPlayerID-1];
    
    if (updatedDeck.hasSelectedCard(card)) {
      updatedDeck.removeSelectedCards(card);
    } else {
      updatedDeck.addSelectedCards(card);
    }

    updateCurrentPlayerDeck(updatedDeck);
  }

  const handleTossSelectedIntoPile = (): void => {
    const newPile = new PileDeck(currentPile.cards);
    const playerDeck = playerDecks[currentPlayerID-1];
    const selectedCards = playerDeck.takeSelectedCards();
    if (selectedCards.length > 0) {
      newPile.addCards(selectedCards);
      setCurrentPile(newPile);
    }
    updateCurrentPlayerDeck(playerDeck);
  }

  const isCardSelectable = (card: Card): boolean => {
    const playerDeck = playerDecks[currentPlayerID-1];

    // if: Player has no selected Cards
    if (playerDeck.getSelectedCards().length < 1) {
      
      // if: top Card quantity is one, then: just compare Pips
      if (currentPile.peekTopQuantity() < 2 && currentPile.peekTopPips() < card.getPips()) {
        return true;
      // else: only allow cards that also have the same quantity available
      } else {
        const availableMultiples = playerDeck.getMultiples(currentPile.peekTopQuantity(), true);
        return (availableMultiples.includes(card) && currentPile.peekTopPips() < card.getPips());
      }
      
    // else if: Player has selected a Card; then: return whether the Card has an equal number of Pips
    } else if (playerDeck.getSelectedCards().length > 0) {
      return playerDeck.getLastSelectedCard()?.getPips() === card.getPips();
    } else  {
      return false;
    }
  }

  // Render Components
  const deckDisplay = deck.getCardCount() < 1 ? <h1>One Moment...</h1> : <div className='card-containers'>
    { playerDecks.map((playerDeck, i) => {
      return <div className='player-hand'>
        <h1>Player {i+1}, {playerDeck.getCardCount()} cards</h1>
        { playerDeck.playerID === currentPlayerID && playerDeck.cards.map(card => {
          const playerDeck = playerDecks[currentPlayerID-1];
          return <CardComponent 
            key={`card-${card.suit}${card.getPips()}`} 
            card={card} 
            handleClick={() => handleCardSelection(card)} 
            isSelected={playerDeck.hasSelectedCard(card)} 
            isSelectable={isCardSelectable(card)}
            />
        })
      }
      </div>
    })}
    </div>

    const pileDisplay = currentPile?.getCardCount() < 1 ? <h2>Pile Empty</h2> : <div className='card-pile'>
      { currentPile.peekTopCards().map(card => {
        return <CardComponent 
        key={`card-${card.suit}${card.getPips()}`} 
        card={card} 
        handleClick={() => handleCardSelection(card)} 
        isSelected={false} 
        isSelectable={false}
        />
      }) }
    </div>


  return (
    <div className="App">
      <section className='debug-actions'>
        <button onClick={() => handleShuffleDeck()}>Shuffle</button>
        <button onClick={() => prepareDeck()}>Shuffle & Sort</button>
        <button onClick={() => handleTossSelectedIntoPile()} disabled={playerDecks[currentPlayerID-1]?.getSelectedCards().length < 1}>Toss Selected</button>
        <label># of Players<input type="number" min={1} max={7} value={playerCount} onChange={e => setPlayerCount(e.target.value as unknown as PlayerCount)} /></label>
        <label>Current Player<input type="number" min={1} max={playerCount} value={currentPlayerID} onChange={e => setCurrentPlayerID(parseInt(e.target.value))} /></label>
      </section>

      {pileDisplay}

      {deckDisplay}

    </div>
  );
}

export default App;
