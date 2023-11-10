import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { BACK_URL } from "../../env";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    background:linear-gradient(#0f0, #3a4750);
    flex-direction: column;
    height: 100vh;
`;

const Body = styled.div`
    justify-content: center;
    display: flex;
`;

const Header = styled.h1`
    text-align: center;
    color: white;
`;

const FriendDiv = styled.div`
    display: flex;
    width: 50%;
    min-height: 60vh;
    flex-direction: column;
    align-items: center;
    background-color: #42b883;
    color: white;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
`;

const BlockedDiv = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #c3195d;
    color: white;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
`;

const Button = styled.button`
    width: 30%;
    border-radius: 10px;
    border: none;
    background-color: #4CAF50;
    color: white;
    font-size: 20px;
    padding: 10px 2px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: #45a049;
    }
`;

const SocialPage = () => {

    const cookies = new Cookies();
    const userdata = cookies.get('data');

    const [allblocks, setAllblocks] = useState([]);
    const [allfriends, setAllfriends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`${BACK_URL}/api/friend/listFriend`, { userIdOne: userdata.userId }, { withCredentials: true });
                setAllfriends(res.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`${BACK_URL}/api/block/listBlock`, { userIdOne: userdata.userId }, { withCredentials: true });
                setAllblocks(res.data.data);
                console.log("res.data.data", res.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleUnblock = (useridOne, useridTwo) => { // status için add yada remove gelebilir.
        const fetchData = async () => {
            try {
                await axios.post(`${BACK_URL}/api/block/handleBlock`,
                    { userIdOne: useridOne, userIdTwo: useridTwo, status: "remove" },
                    { withCredentials: true });
                window.location.reload();
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    };

    const handleUnfriend = (useridOne, useridTwo) => { // status için add yada remove gelebilir.
        const fetchData = async () => {
            try {
                await axios.post(`${BACK_URL}/api/friend/handleFriend`,
                    { userIdOne: useridOne, userIdTwo: useridTwo, status: "remove" },
                    { withCredentials: true });
                    window.location.reload();
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    };

    return (
        <Container>
            <Body>
                <FriendDiv>
                    <Header>Friend List</Header>
                    <div style={{background:"blue", minHeight:"500px", minWidth:"100%", borderRadius:"10px"}}>
                    {allfriends.map((friend) => (
                    <div key={friend.userId} style={{display:"flex", alignItems:"center", gap:"10%", justifyContent:"center"}}>
                        <img src={friend.profilePicture} style={{width:"100px", height:"100px", borderRadius:"50%", backgroundColor:"blue", objectFit:"cover"}}></img>                    
                        <h1>{friend.name}</h1>
                        <Button onClick={() => handleUnfriend(userdata.userId, friend.userId)}>Unfriend</Button>
                    </div>
                    ))}
                    </div>
                </FriendDiv>
                <BlockedDiv>
                    <Header>Blocked List</Header>
                    <div style={{background:"blue", minHeight:"500px", minWidth:"100%",borderRadius:"10px", justifyContent:"center"}}>
                    {allblocks.map((block) => (
                    <div key={block.userId} style={{display:"flex", alignItems:"center", gap:"10%", padding:"7px"}}>
                        <img src={block.profilePicture} style={{width:"100px", height:"100px", borderRadius:"50%", backgroundColor:"blue", objectFit:"cover"}}></img>
                        <h1>{block.name}</h1>
                        <Button onClick={() => handleUnblock(userdata.userId, block.userId)}>Unblock</Button>
                    </div>
                    ))}
                    </div>
                </BlockedDiv>
            </Body>
        </Container>
        );
};

export default SocialPage;