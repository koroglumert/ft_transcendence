import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const GameContainer = styled.div`
  text-align: center;
  background-color: red;
  width: 100%;
  height: 100%;
`;

const ScoreBoardDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30%;
  font-size: 25px;
  background-color: black;
  color: white;
`;

const PlayerScore = styled.div`
  font-size: 60px;
  padding: 1% 2%;
  background-color: red;
`;

const PlayerName = styled.a`
  font-size: 60px;
`;

const PongCanvas = styled.canvas`
  background-color: yellow;
  width: 70%;
  height: 70%;
`;

function GamePage() {
  const canvasRef = useRef(null);

  const [racket1Y, setRacket1Y] = useState(20);
  const [racket2Y, setRacket2Y] = useState(20);
  const [ballX, setBallX] = useState(400); // Topun x konumu
  const [ballY, setBallY] = useState(200); // Topun y konumu
  const [ballSpeedX, setBallSpeedX] = useState(5); // Topun x hızı
  const [ballSpeedY, setBallSpeedY] = useState(2); // Topun y hızı

  const racketSpeed = 20; // Raketlerin hareket hızı

  const handleKeyDown = (event) => {
    if (event.key === "w" && racket1Y > 0) {
      setRacket1Y(racket1Y - racketSpeed);
    }
    if (event.key === "s" && racket1Y < canvasRef.current.height - 40) {
      setRacket1Y(racket1Y + racketSpeed);
    }
    if (event.key === "ArrowUp" && racket2Y > 0) {
      setRacket2Y(racket2Y - racketSpeed);
    }
    if (event.key === "ArrowDown" && racket2Y < canvasRef.current.height - 40) {
      setRacket2Y(racket2Y + racketSpeed);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const updateCanvas = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "red";
      context.fillRect(10, racket1Y, 10, 40);

      context.fillStyle = "blue";
      context.fillRect(canvas.width - 20, racket2Y, 10, 40);

      context.fillStyle = "black";
      context.beginPath();
      context.arc(ballX, ballY, 10, 0, Math.PI * 2);
      context.fill();

      // Topun hareketi
      setBallX(ballX + ballSpeedX);
      setBallY(ballY + ballSpeedY);

      // Topun çarpma kontrolü
      if (ballX <= 20 || ballX >= canvas.width - 30) {
        setBallSpeedX(-ballSpeedX);
      }

      if (ballY <= 0 || ballY >= canvas.height) {
        setBallSpeedY(-ballSpeedY);
      }

      requestAnimationFrame(updateCanvas);
    };

    updateCanvas();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    }, [racket1Y, racket2Y, ballX, ballY, ballSpeedX, ballSpeedY]);

  return (
    <GameContainer>
      <ScoreBoardDiv>
        <div>
          <PlayerName>user0</PlayerName>
          <PlayerScore>0</PlayerScore>
        </div>
        <div>
          <PlayerName>user1</PlayerName>
          <PlayerScore>1</PlayerScore>
        </div>
      </ScoreBoardDiv>
      <PongCanvas ref={canvasRef}></PongCanvas>
    </GameContainer>
  );
}

export default GamePage;
