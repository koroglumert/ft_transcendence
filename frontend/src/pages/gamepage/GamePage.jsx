import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { BACK_URL, SOCKET_URL } from "../../env";
const io = require('socket.io-client');

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
  const socketRef = useRef(null);

  var [match, setMatch] = useState(null);

  const cookies = new Cookies();
  const data = cookies.get('data');

  const [racket1Y, setRacket1Y] = useState(20);
  const [racket2Y, setRacket2Y] = useState(20);
  const [ballX, setBallX] = useState(400); // Topun x konumu
  const [ballY, setBallY] = useState(200); // Topun y konumu
  const [ballSpeedX, setBallSpeedX] = useState(5); // Topun x hızı
  const [ballSpeedY, setBallSpeedY] = useState(2); // Topun y hızı
  const racketSpeed = 6; // Raketlerin hareket hızı

  var socket;
  var theMatch;
  var players;

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
      //setBallX(ballX + ballSpeedX);
      //setBallY(ballY + ballSpeedY);

      // Topun çarpma kontrolü
      /*if (ballX <= 20 || ballX >= canvas.width - 30) {
        setBallSpeedX(-ballSpeedX);
      }

      if (ballY <= 0 || ballY >= canvas.height) {
        setBallSpeedY(-ballSpeedY);
      }*/

      const radius = 3; // Topun yarıçapı
      const x = canvas.width / 2; // Canvas'ın yatay ortası
      const y = canvas.height / 2; // Canvas'ın dikey ortası

// Topu çiz
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fillStyle = 'black'; // Topun rengi
      context.fill();
      context.closePath();
      

      requestAnimationFrame(updateCanvas);
    };
    updateCanvas();

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [racket1Y, racket2Y, ballX, ballY, ballSpeedX, ballSpeedY]);
  
  
  const handleSocket = async () => {
    const socket = io(`${SOCKET_URL}`);

    socket.on('connect', async (sdata) => {
      console.log("Websocket bağlandı", socket.id);
      console.log("Eşleşme bekleniyor...");
      try {
        const response = await axios.post(`${BACK_URL}/api/lobby/add`, {
          userId: data.userId,
          socketId: socket.id,
        });
        players = response.data;
        if (players.length > 1){
          socket.emit('call', 'match.add', {userIdOne: players[0].userId, userIdTwo: players[1].userId});
        }
      } catch (error) {
        console.log("ERROR", error);
      }
      console.log("PLAYERS", players);
      console.log(players.length);

      socket.on(`${data.userId}`, async (sdata) => {
        console.log("Eşleşme bulundu");
        match = sdata.match;
        setMatch(sdata.match);
        console.log("Match", sdata.match, data.userId);

        await socket.on(`${match._id}MOVE`, (sdata) => {
            console.log("MOVE UP");
            if (sdata.racket === 1)
              setRacket1Y(sdata.pos);
            else if (sdata.racket === 2)
              setRacket2Y(sdata.pos);
        });
    
        await socket.on(`${match._id}DOWN`, (sdata) => {
          console.log("MOVE DOWN");
          if (sdata.racket === 1)
              setRacket1Y(sdata.pos);
          else if (sdata.racket === 2)
            setRacket2Y(sdata.pos);
        });
      });
    });


    /*if (players.length > 1){
      try {
        const response = await axios.post("http://localhost:3002/api/match/add", {
          userIdOne: players[0].userId,
          userIdTwo: players[1].userId,
        });
        console.log("MATCH ADDED", response.data);
      } catch (error) {
        console.log("ERROR", error);
      }
    };*/

    // console.log("SOCKET", socket);
    // if (!socket){
    //   // WebSocket bağlantısını sadece bir kere başlatın
    //   socket = io(`${SOCKET_URL}`);
      
    //   socket.on('connect', () => {
    //     console.log('WebSocket bağlantısı başarıyla kuruldu -> ', socket.id);
    //   });
      
    //   const userCount = response.data.length;
    //   if (userCount > 1){
    //     let matchRes;
    //     try {
    //       matchRes = await axios.post("http://localhost:3002/api/match/add", {
    //         userIdOne: users[0].userId,
    //         userIdTwo: users[1].userId,
    //       });
    //       match = matchRes.data;
    //       console.log("MATCHRES", match);
    //       console.log(data.userId, match.userIdOne, match.userIdTwo);
    //       if (data.userId === match.userIdOne){
    //         socket.emit('call', 'match.sendData', {recepientId: match.userIdTwo, matchId: match._id});
    //       }else if (data.userId === match.userIdTwo){
    //         socket.emit('call', 'match.sendData', {recepientId: match.userIdOne, matchId: match._id});
    //       }
    //     } catch (error) {
    //       // Hata oluştuğunda burada hata ile ilgili işlemleri yapabilirsiniz.
    //       console.error("Hata:", error);
    //     }
    //   }

    //   socket.on(`${data.userId}`, (sdata) => {
    //     console.log("SDATAMATCHID", sdata.matchId);
    //     if (theMatch === undefined){
    //       theMatch = sdata.matchId._id;
    //       match = sdata.matchId;
    //     }
    //   });

    //   console.log("MATCHHH", match);

    //   console.log("THEMATCH", theMatch);
    //   socket.on(`${theMatch}UP`, (sdata) => {
    //     if (data.userId === match.userIdOne)
    //       setRacket2Y(sdata.pos);
    //     else if (data.userId === match.userIdTwo)
    //       setRacket1Y(sdata.pos);
    //   });

    //   socket.on(`${theMatch}DOWN`, (sdata) => {
    //     if (data.userId === match.userIdOne)
    //       setRacket2Y(sdata.pos);
    //     else if (data.userId === match.userIdTwo)
    //       setRacket1Y(sdata.pos);
    //   });

    //   // Sunucuyla bağlantı kapatıldığında gerçekleşecek olay
    //   socket.on('disconnect', () => {
    //     console.log('WebSocket bağlantısı kapatıldı -> ');
    //   });
      
    //   // useEffect içinde bağlantıyı kapatma
    //   return () => {
    //     socket.disconnect();
    //   };
    // }
  };

  function postMove(match, racket, pos){
        try {
          const response = axios.post(`${BACK_URL}/api/key/move`, {
          matchId: match._id,
          racket : racket,
          pos: pos,
        });
        } catch (error) {
          
        }
        if (racket == 1)
          setRacket1Y(pos);
        else if (racket == 2)
          setRacket2Y(pos);
  };

  const handleKeyDown = (event) => {

    if (event.key === "w"){
      console.log("MOVE", match);
      if (data.userId === match.userIdOne && racket1Y > 0){
        postMove(match, 1, racket1Y - racketSpeed);
      }
      else if (data.userId === match.userIdTwo && racket2Y > 0){
        postMove(match, 2, racket2Y - racketSpeed);
      }
    }else if (event.key === "s"){
      console.log("MOVE", match);
      if (data.userId === match.userIdOne && racket1Y < canvasRef.current.height - 40){
        postMove(match, 1, racket1Y + racketSpeed);
      }
      else if (data.userId === match.userIdTwo && racket2Y < canvasRef.current.height - 40){
        postMove(match, 2, racket2Y + racketSpeed);
      }
    }  

    /*if (event.key === "w" && racket1Y > 0) {
      console.log("USERID", data.userId);
      console.log("MATCH", match);
      setRacket1Y(racket1Y - racketSpeed);
    }else if (event.key === "s" && racket1Y < canvasRef.current.height - 4) {
      console.log("USERID", data.userId);
      console.log("MATCH", match);
      setRacket1Y(racket1Y + racketSpeed);
    }*/
    
    /*else if (event.key === "ArrowUp" && racket2Y > 0) {
      setRacket2Y(racket2Y - racketSpeed);
    }else if (event.key === "ArrowDown" && racket2Y < canvasRef.current.height - 4) {
      setRacket2Y(racket2Y + racketSpeed);
    }*/
  };
  
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
      <button onClick={handleSocket}>START</button>
    </GameContainer>
  );
}

export default GamePage;
