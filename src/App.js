import React, { useState, useEffect } from "react";

import match from "./match.svg";

import styles from "./App.css";

const App = () => {
  const [matches, setMatches] = useState(25);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [aiTotal, setAiTotal] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);
  const [winner, setWinner] = useState("");

  const takeMatches = (count) => {
    setMatches(matches - count);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

    if (currentPlayer === 1) {
      setPlayerTotal(playerTotal + count);
    } else {
      setAiTotal(aiTotal + count);
    }
  };

  const handlePlayerClick = (count) => {
    if (
      count >= 1 &&
      count <= 3 &&
      count <= matches &&
      !gameOver &&
      !disableButtons
    ) {
      takeMatches(count);
    }
  };

  const getAiMove = () => {
    const availableMatches = Math.min(matches, 3);

    let count;
    if (availableMatches % 4 === 1) {
      count = 1;
    } else if (availableMatches % 4 === 2) {
      count = 2;
    } else if (availableMatches % 4 === 3) {
      count = 3;
    } else {
      count = Math.floor(Math.random() * availableMatches) + 1;
    }

    return count;
  };

  const handleComputerTurn = () => {
    const count = getAiMove();
    takeMatches(count);
  };

  useEffect(() => {
    if (currentPlayer === 2 && !gameOver) {
      setDisableButtons(true);
      const timer = setTimeout(() => {
        handleComputerTurn();
        setDisableButtons(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameOver]);

  useEffect(() => {
    if (matches === 0) {
      let winner;
      if ((playerTotal + aiTotal) % 2 === 0) {
        if (currentPlayer === 1) {
          winner = "AI";
        } else {
          winner = "You";
        }
      } else if (playerTotal % 2 === 0) {
        winner = "You";
      } else {
        winner = "AI";
      }

      setWinner(winner);
      setGameOver(true);
    }
  }, [matches, playerTotal, aiTotal, currentPlayer]);

  const restartGame = () => {
    setMatches(25);
    setPlayerTotal(0);
    setAiTotal(0);
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner("");
    setDisableButtons(false);
  };

  return (
    <div className="game">
      <div className="ai">
        <div className="turn">
          <div
            className="circle ai__circle"
            style={{ backgroundColor: currentPlayer === 2 ? "#9EC38C" : "red" }}
          ></div>
          <div className="match">
            {[...Array(aiTotal)].map((_, index) => (
              <img key={index} src={match} alt="match" />
            ))}
          </div>
          <div className="turn__text">
            <p
              style={{ color: currentPlayer === 2 ? "#9EC38C" : "transparent" }}
            >
              AI's Turn!
            </p>
            <p>Total: {aiTotal}</p>
          </div>
        </div>
      </div>
      <div className="click">
        <p className="left">Matches left: {matches}</p>
        <div className="match">
          {[...Array(matches)].map((_, index) => (
            <img key={index} src={match} alt="match" />
          ))}
        </div>
        <h2 style={{ display: gameOver === true ? "none" : "block" }}>
          How many do you want to take?
        </h2>
        {gameOver ? (
          <div>
            <p>Game Over! {winner === "You" ? "You Win!" : "You Lose!"}</p>
            <button className="restart" onClick={restartGame}>
              Restart
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button
              className="btn"
              onClick={() => handlePlayerClick(1)}
              disabled={disableButtons}
            >
              1
            </button>
            <button
              className="btn"
              onClick={() => handlePlayerClick(2)}
              disabled={disableButtons}
            >
              2
            </button>
            <button
              className="btn"
              onClick={() => handlePlayerClick(3)}
              disabled={disableButtons}
            >
              3
            </button>
          </div>
        )}
      </div>
      <div className="player">
        <div className="turn">
          <div
            className="circle"
            style={{ backgroundColor: currentPlayer === 1 ? "#9EC38C" : "red" }}
          ></div>
          <div className="turn__text">
            <p
              style={{ color: currentPlayer === 1 ? "#9EC38C" : "transparent" }}
            >
              Your Turn!
            </p>
            <p>Total: {playerTotal}</p>
          </div>
          <div className="match">
            {[...Array(playerTotal)].map((_, index) => (
              <img key={index} src={match} alt="match" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
