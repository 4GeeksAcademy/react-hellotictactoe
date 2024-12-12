import { useState, useEffect } from "react";
import React from "react";
import Board from "./Board";
import GameOver from "./Gameover";
import GameState from "./Gamestate";
import Reset from "./Reset";


const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  // Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  // Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  // Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function checkWinner(tiles, setStrikeClass, setGameState) {
  for (const { combo, strikeClass } of winningCombinations) {
    const tileValue1 = tiles[combo[0]];
    const tileValue2 = tiles[combo[1]];
    const tileValue3 = tiles[combo[2]];

    if (tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
      setStrikeClass(strikeClass);
      if (tileValue1 === PLAYER_X) {
        setGameState(GameState.playerXWins);
      } else {
        setGameState(GameState.playerOWins);
      }
      return;
    }
  }

  const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
  if (areAllTilesFilledIn) {
    setGameState(GameState.draw);
  }
}

function TicTacToe() {
  const [tiles, setTiles] = useState(Array(9).fill(null));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [playerName, setPlayerName] = useState("");
  const [playerName2, setPlayerName2] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null); // X or O

  const handleTileClick = (index) => {
    if (gameState !== GameState.inProgress || tiles[index] !== null) {
      return;
    }

    const newTiles = [...tiles];
    newTiles[index] = playerTurn;
    setTiles(newTiles);
    setPlayerTurn(playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X);
  };

  const handleReset = () => {
    setGameState(GameState.inProgress);
    setTiles(Array(9).fill(null));
    setPlayerTurn(selectedPlayer || PLAYER_X);
    setStrikeClass(null);
  };

  useEffect(() => {
    if (gameState === GameState.inProgress) {
      checkWinner(tiles, setStrikeClass, setGameState);
    }
  }, [tiles, gameState]);

  return (
    <div>
      <h1>Tic Tac Toe</h1>

    
      {selectedPlayer === null ? (
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your name 2"
            value={playerName2}
            onChange={(e) => setPlayerName2(e.target.value)}
          />
          <div>
            <button onClick={() => setSelectedPlayer(PLAYER_X)}>Play as X</button>
            <button onClick={() => setSelectedPlayer(PLAYER_O)}>Play as O</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>{ playerTurn == PLAYER_X? playerName: playerName2} is playing as {playerTurn}</h2>
        </div>
      )}

      {/* Game board */}
      {selectedPlayer !== null && (
        <Board
          playerTurn={playerTurn}
          tiles={tiles}
          onTileClick={handleTileClick}
          strikeClass={strikeClass}
        />
      )}

      <GameOver gameState={gameState} />
      <Reset gameState={gameState} onReset={handleReset} />
    </div>
  );
}

export default TicTacToe;
