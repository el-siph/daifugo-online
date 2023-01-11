# Daifugo Online

"Daifugo" (Japanese for "Tycoon") is a popular traditional playing card game.  It is a turn-based, shedding-type game that uses a French deck and relies on strategic use of the player's cards.

## Basic Rules

The goal of Daifugo each round is to shed your deck before your opponents by placing your cards into the central Pile.  A player begins the round (see: "Determining starting player"), and the first "Trick", by placing any card they wish to discard into the Pile.  The next player may discard whichever card they wish, but their card must have a greater value than the previous, or "top", card.  This cycle continues until the current player no longer has a card to play over the top card.  When a player cannot add to the Pile, they are forced to Pass.  If a player adds a card that forces everyone else to Pass, then the Trick ends, the Pile is cleared, and that player begins a new Trick.

At the start of a Trick, a player can choose to play a pair, trio, or quad of identical cards in their deck.  When multiples are played, the other players must play an identical quantity of cards of greater value, e.g. a pair of 3's must be topped by a pair of 4's or better.

A card's value is determined by its "pips", with the face cards - Jack, Queen, King, and Ace - being worth 11, 12, 13, and 14 pips respectively.  2's are worth 15 pips, making them the most valuable cards and automatically end a given Trick.  

The order in which players shed their decks determines their rank; the first player out is the "Tycoon" and receives 2 points to the total.  The second player out is "Rich" and receives 1 point.  Everyone else plays purely to determine which two players finish last, as "Poor" and the "Beggar".

## Additional Rules

Playing a quad of cards triggers a "Revolution", which reverses the value of all the cards; players must now discard a card of lower value than the top card.  Playing another quad quells the Revolution and reset the value system.

Playing one or more 8's ends the Trick and resets the Pile.

At the start of the second and all subsequent rounds, the Beggar is forced to reliquish their two best cards to the Tycoon, while the Poor player must reliquish their best card.  The Tycoon returns any two cards they wish to the Beggar, while the Rich player returns one to the Poor player.

## Project Scope

The aim of this project is to produce a free, open-source, online multiplayer environment in which two to seven players can play Daifugo by simply exchaging a room code.  However, the deck logic simulates a real pack of playing cards closely enough that other card games could theoritically be incorporated simply by codifying their specific rulesets.

Additionally, this project aims to support various assists and house-rule toggles to customize the experience, as well as graphics, animations, and sounds.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.