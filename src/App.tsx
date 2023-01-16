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
  const [passCount, setPassCount] = useState<number>(0);

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
    setPassCount(0);
    advancePlayer();
  }

  const advancePlayer = (): void => {
    let newPlayerId = currentPlayerID + 1;
    if (newPlayerId > playerCount) { newPlayerId = 1; }
    setCurrentPlayerID(newPlayerId);
  }

  const handlePass = (): void => {
    advancePlayer();
    let newPassCount = passCount + 1;
    if (newPassCount === playerCount-1) {
      refreshPile();
      newPassCount = 0;
    }
    setPassCount(newPassCount);
  }

  const refreshPile = (): void => {
    const newPile = new PileDeck([]);
    setCurrentPile(newPile);
  }

  const isCardSelectable = (card: Card): boolean => {
    const playerDeck = playerDecks[currentPlayerID-1];

    // Heurstic filters

    // if: current PileDeck hasn't been started: then: Card is always enabled
    if (currentPile.getCardCount() < 1 && playerDeck.getSelectedCards().length < 1) {
      return true;
    }

    // if: top card Pips is higher than Card, then: Card is never enabled
    if (currentPile.peekTopPips() >= card.getPips()) {
      return false;
    }

    // if: top quantity is active, then: all Card groups lower than the quantity are never enabled
    if (currentPile.peekTopQuantity() > 1) {
      const availableMultiples = playerDeck.getMultiples(currentPile.peekTopQuantity(), true);
      if (!availableMultiples.includes(card)) {
        return false;
      }
    }

    // if: Card was already selected, then: Card will always be de-selectable
    if (playerDeck.hasSelectedCard(card)) {
      return true;
    }

    // END Heurstic filters

    // if: Player has no selected Cards
    if (playerDeck.getSelectedCards().length < 1) {
      
      // if: top Card quantity is one, then: just compare Pips
      return currentPile.peekTopPips() < card.getPips();
      
    // else if: Player has selected one or more Cards
    } else {
      // if: current PileDeck hasn't been started, then: return whether the Card has an equal number of Pips
      if (currentPile.getCardCount() < 1) {
        return playerDeck.getLastSelectedCard()?.getPips() === card.getPips();
      // else: return whether the quantity quota has been met and the Card has the same Pips as the other selections
      } else {
        return playerDeck.getSelectedCards().length < currentPile.peekTopQuantity() && playerDeck.getLastSelectedCard().getPips() === card.getPips();
      }
    }
  }

  const currentPlayerDeck = playerDecks[currentPlayerID-1];

  // Render Components
  const deckDisplay = deck.getCardCount() < 1 ? <h1>One Moment...</h1> : <div className='card-containers'>
      <div className='player-hand'>
        { currentPlayerDeck.playerID === currentPlayerID && currentPlayerDeck.cards.map(card => {
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
    </div>

    const pileDisplay = currentPile?.getCardCount() < 1 ? <h2>Pile Empty</h2> : <div className='card-pile'>
      { currentPile.peekTopCards().map(card => {
        return <CardComponent 
        key={`card-${card.suit}${card.getPips()}`} 
        card={card} 
        handleClick={() => {}} 
        isSelected={false} 
        isSelectable={true}
        />
      }) }
    </div>

  return (
    <div className="App">
      
      <section className='player-actions'>
        <button onClick={() => handleTossSelectedIntoPile()} disabled={currentPlayerDeck?.getSelectedCards().length < currentPile.peekTopQuantity()}>Toss Selected</button>
        <button onClick={() => handlePass()} disabled={currentPlayerDeck?.getSelectedCards().length > 0}>Pass</button>
      </section>

      <section className='debug-actions'>
        <button onClick={() => handleShuffleDeck()}>Shuffle</button>
        <button onClick={() => prepareDeck()}>Shuffle & Sort</button>
        <label># of Players<input type="number" min={1} max={7} value={playerCount} onChange={e => setPlayerCount(e.target.value as unknown as PlayerCount)} /></label>
        <label>Current Player<input type="number" min={1} max={playerCount} value={currentPlayerID} onChange={e => setCurrentPlayerID(parseInt(e.target.value))} /></label>
      </section>

      <section className='play-area'>
        {pileDisplay}
        <h1>Player {currentPlayerDeck.playerID}, {currentPlayerDeck.getCardCount()} cards</h1>
        {deckDisplay}
      </section>

    </div>
  );
}

export default App;
