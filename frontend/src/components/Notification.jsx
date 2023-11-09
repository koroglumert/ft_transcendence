import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BACK_URL } from './../env';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  color: white;
`;

const AcceptButton = styled.button`
  background-color: #00ff00;
  color: black;
  border-radius: 10px;
  border: none;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: #00aa00;
  }
`;

const DeclineButton = styled.button`
  background-color: #ff0000;
  color: black;
  border-radius: 10px;
  border: none;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: #aa0000;
  }
`;

const Username = styled.h4`
  font-size: 20px;
  margin: 5px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: red;
  object-fit: cover;
`;

const RequestDiv = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const NotificationBar = ({ userid }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${BACK_URL}/api/notification/listReq`,
          { userIdOne: userid },
          { withCredentials: true }
        );
        setNotifications(res.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [userid]);

  const handleAccept = (userIdOne, userIdTwo, status) => { // burada user'ları ters göndermemizin sebebi cookie almamak için
    const fetchData = async () => {
      try {
        await axios.post(`${BACK_URL}/api/notification/acceptReq`, {
          userIdOne: userIdOne,
          userIdTwo: userIdTwo,
          status: status,
        }, { withCredentials: true });

        window.location.reload();
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  };

  console.log("notifications", notifications);

  return (
    <Container>
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <p>Şu an istek yok</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <RequestDiv key={notification.userId}>
            <ProfileImage src={notification.profilePicture}></ProfileImage>
            <Username>{notification.name}</Username>
            <AcceptButton onClick={() => handleAccept(userid, notification.userId, "accept")}>
              ACCEPT
            </AcceptButton>
            <DeclineButton onClick={() => handleAccept(userid, notification.userId, "decline")}>
              DECLINE
            </DeclineButton>
          </RequestDiv>
        ))
      )}
    </Container>
  );
};

export default NotificationBar;