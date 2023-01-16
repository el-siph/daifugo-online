import React, { useEffect, useState } from 'react';
import './App.css';
import Card, { PlayerCount } from './models/Card';
import CardComponent from './components/CardComponent';
import { Deck, PileDeck, PlayerDeck } from './models/Deck';

const ACE_IS_FOURTEEN = true;
const TWO_IS_FIFTEEN = true;
const DEFAULT_PLAYER_COUNT = 4;
const TERMINATE_PILE_PIPS = 8;
const ENABLE_REVOLUTIONS = true;

function App() {

  const [deck, setDeck] = useState<Deck>(new Deck([]));
  const [playerDecks, setPlayerDecks] = useState<PlayerDeck[]>([]);
  const [playerCount, setPlayerCount] = useState<PlayerCount>(DEFAULT_PLAYER_COUNT);
  const [currentPlayerID, setCurrentPlayerID] = useState<number>(-1);
  const [currentPile, setCurrentPile] = useState<PileDeck>(new PileDeck());
  const [passCount, setPassCount] = useState<number>(0);
  const [victoryOrder, setVictoryOrder] = useState<number[]>([]);
  const [playersRemaining, setPlayersRemaining] = useState<number[]>([]);
  const [isRoundEnded, setIsRoundEnded] = useState<boolean>(false);
  const [isRevolting, setIsRevolting] = useState<boolean>(false);

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
    setupPlayers(deck);
    setDeck(deck);
  }

  const setupPlayers = (deck: Deck): void => {
    let playerDecks: PlayerDeck[] = deck.divide(playerCount);
    const newPlayersRemaining: number[] = [];
    playerDecks.forEach(deck => { 
      deck.sortCards(ACE_IS_FOURTEEN, TWO_IS_FIFTEEN); 
      newPlayersRemaining.push(deck.playerID);
    });
    setPlayerDecks(playerDecks);
    setPlayersRemaining(newPlayersRemaining);
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
    let newPile = new PileDeck(currentPile.cards);
    const playerDeck = playerDecks[currentPlayerID-1];
    const selectedCards = playerDeck.takeSelectedCards();
    
    // if: Player is adding one or more Cards, then: check for conditions before advancing to next Player
    if (selectedCards.length > 0) {

      if (ENABLE_REVOLUTIONS && selectedCards.length === 4) {
        setIsRevolting(!isRevolting);
      }

      newPile.addCards(selectedCards);
      if (selectedCards[0].getPips() === TERMINATE_PILE_PIPS) { newPile.clearPile(); } 
      // if: Player's deck is exhausted, then: add ID to winner stack
      if (playerDeck.getCardCount() < 1) { 
        addVictor(playerDeck.playerID); 
        advancePlayer();
      }
      else { advancePlayer(); }
      setCurrentPile(newPile);
    }
    
    updateCurrentPlayerDeck(playerDeck);
    setPassCount(0);
  }

  const addVictor = (playerID: number): void => {
      const newVictoryOrder = [...victoryOrder];
      newVictoryOrder.push(playerID);

      const newPlayersRemaining: number[] = [...playersRemaining].filter(p => p !== playerID);

      // if: the n+1 Player has won, then: add the nth Player to the bottom of victoryOrder and end the round
      if (newVictoryOrder.length === playerCount-1) {
        newVictoryOrder.push(newPlayersRemaining[0]);
        setVictoryOrder(newVictoryOrder); 
        setPlayersRemaining([]);
        setIsRoundEnded(true);
      } else { 
        setVictoryOrder(newVictoryOrder); 
        setPlayersRemaining(newPlayersRemaining);
      }
  }

  const advancePlayer = (): void => {
    let newPlayerId = currentPlayerID + 1;
    if (newPlayerId > playerCount) { newPlayerId = 1; }
    while (!playersRemaining.includes(newPlayerId)) { ++newPlayerId; }
    setCurrentPlayerID(newPlayerId);
  }

  const handlePass = (): void => {
    advancePlayer();
    let newPassCount = passCount + 1;
    if (newPassCount === playersRemaining.length-1) {
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
    // if: top quantity is active, then: all Card groups lower than the quantity are never enabled
    if (currentPile.peekTopQuantity() > 1) {
      const availableMultiples = playerDeck.getMultiples(currentPile.peekTopQuantity(), true);
      if (!availableMultiples.includes(card)) {
        return false;
      }
    }

    // if: current PileDeck hasn't been started: then: Card is always enabled
    if (currentPile.getCardCount() < 1 && playerDeck.getSelectedCards().length < 1) {
      return true;
    }

    // if: top card Pips is higher than Card, then: Card is never enabled
    if (currentPile.peekTopPips() >= card.getPips()) {
      if (isRevolting) { return currentPile.peekTopPips() > card.getPips(); }
      return false;
    }

    // if: Card was already selected, then: Card will always be de-selectable
    if (playerDeck.hasSelectedCard(card)) {
      return true;
    }

    // END Heurstic filters

    // if: Player has no selected Cards, then: just compare Pips
    if (playerDeck.getSelectedCards().length < 1) {
      const result = isRevolting ? currentPile.peekTopPips() > card.getPips() : currentPile.peekTopPips() < card.getPips();
      return result;
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
  const deckDisplay = (!currentPlayerDeck || deck.getCardCount() < 1) ? <h1>One Moment...</h1> : <div className='card-containers'>
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
        <button onClick={() => handlePass()} disabled={currentPlayerDeck?.getSelectedCards().length > 0 || victoryOrder.length === playerCount}>Pass</button>
      </section>

      <section className='debug-actions'>
        <button onClick={() => handleShuffleDeck()}>Shuffle</button>
        <button onClick={() => prepareDeck()}>Shuffle & Sort</button>
        <label># of Players<input type="number" min={1} max={7} value={playerCount} onChange={e => setPlayerCount(e.target.value as unknown as PlayerCount)} /></label>
        <label>Current Player<input type="number" min={1} max={playerCount} value={currentPlayerID} onChange={e => setCurrentPlayerID(parseInt(e.target.value))} /></label>
      </section>

      { !isRoundEnded && <section className='play-area'>
        { isRevolting && <h1>Revolution!</h1> }
        {pileDisplay}
        { currentPlayerDeck !== undefined && <h1>Player {currentPlayerDeck.playerID}, {currentPlayerDeck.getCardCount()} cards</h1> }
        {deckDisplay}

        <h2>Standings</h2>
        <ol>
          { victoryOrder.map((victor, i) => {
            return <li>Player #{victor} {i < 2 ? `+${2-i} points` : ''}</li>
          }) }
        </ol>

        <h2>Players Remaining</h2>
        <ol>
          { playersRemaining.map((remaining, i) => {
            return <li>Player #{remaining}</li>
          }) }
        </ol>
      </section> }
    
      { isRoundEnded && <section className='round-over-container'>
          <h1>Round Over!</h1>
          <h2>Results</h2>
          <ol>
          { victoryOrder.map((victor, i) => {
            return <li>Player #{victor}{i < 2 ? ` | +${2-i} points` : ''}</li>
          }) }
          </ol> 
        </section> }

    </div>
  );
}

export default App;
