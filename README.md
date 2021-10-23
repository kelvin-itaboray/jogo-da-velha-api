# Tic Tac Toe API

## Description

An API that returns a possible move for a Player O in a Tic Tac Toe match!

#### Concepts

Mark: A mark is a representation of a player's input. It can be an `o` for Player O, or it can be an `x` for Player X. The API moves are represented by Player O.

Sequence: A sequence of 3 marks represented by a row, column or diagonal sequence in the board.

Board: The board with 9 positions representing spaces where a mark can be put by a player.

#### Possible moves

At this specific order, the API will try to do these moves:

- Win;
- Block;
- Fork;
- Block a fork;
- Play at center of the board;
- Play at corner of the board;
- Play at side of the board.

If a possible move is found, the API will return the state of the board with the choosen move applied, ignoring subsequent possible moves.

## How to use

Make a GET request to `BASE_URL/?board=BOARD_VALUE` where `BASE_URL` is the base url of the project server and `BOARD_VALUE` is a string with 9 characters where `o`, `x` or empty space are possible values for each character of the string.

The response will also be a string with 9 characters, but updated with Player O's next move.

## Possible exceptions

The requisition can return a 400 Bad request error with the following exceptions if the informed query param is invalid:

- A query param 'board' must be informed.
- Board must contain 9 characters.
- Board must contain only 'o', 'x' or empty spaces as characters.
- It is not player o's turn to play.
- There are no moves left to play.
- No move is possible. Game is already finished.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing the app

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
