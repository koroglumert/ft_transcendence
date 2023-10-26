import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FriendsButton from "./FriendsButton";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 35px;
    width: 300px;
    color: white;
`;

const NotificationBar = ({ userid }) => {

    const [notifications, setNotifications] = useState([]);

    console.log("userid",userid);
   useEffect (() => {
        const fetchData = async () => {
            try {
                const res = await axios.post('http://localhost:3002/api/friends/notifications', {userId:userid}, { withCredentials: true });
                setNotifications(res.data);
                console.log("notifications",res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    }, []);

    const handleAccept = () => {
        const fetchData = async () => {
            try {
                await axios.post('http://localhost:3002/api/friends/acceptReq', {userIdTwo:userid, userIdOne:"136417" }, { withCredentials: true });//div eklenecek ve useridTwo gönderilecek
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    };

    return (
        <Container>
            {notifications.map((friends, index) => (
                        <div key={index} style={{ color: "white", display:"flex", flexDirection:"column" }}>
                            <div style={{display:"flex", gap:"20px"}}>    
                                <li>
                                {friends.userIdOne}
                                </li>
                                {friends.status}
                                <button onClick={handleAccept}>Accept</button>
                            </div>
                        </div>
                    ))}
        </Container>
    )
};

export default NotificationBar;