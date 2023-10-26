import React from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const RequestButton = styled.button`
    width: 100%;
    height: 100%;
    padding: 9px;
    border: 0 auto;
    text-align: center;
    font-weight: 900;
    background-color: green;
    color: black;
    font-size: 15px;
    border-radius: 5px;
    &:hover{
        background-color: white;
    }
`;

const BlockButton = styled.button`
    width: 100%;
    height: 100%;
    padding: 9px;
    font-weight: 900;
    border: 0 auto;
    background-color: red;
    color: black;
    font-size: 15px;
    border-radius: 5px;
    &:hover{
        background-color: white;
    }
`;

const UnblockButton = styled.button`
    width: 100%;
    height: 100%;
    border: 1px solid gray;
    background-color: gray;
    color: black;
    font-size: 14px;
    &:hover{
        background-color: white;
    }
`;

const FriendsButton = ({ useridOne, useridTwo, status }) => {
        
    const handleRequest = () => {
             const fetchData = async () => {
                 try {
                     await axios.post('http://localhost:3002/api/friends/friendReq', {userIdOne:useridOne, userIdTwo:useridTwo, status:"add"}, { withCredentials: true });
                 } catch (err) {
                     console.error("Error fetching data:" ,err);
                 }
             };
             fetchData();
    };

    const handleBlock = () => {
        const fetchData = async () => {
            try {
                await axios.post('http://localhost:3002/api/friends/friendReq', {userIdOne:useridOne, userIdTwo:useridTwo, status:"block"}, { withCredentials: true });
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    };

    const handleUnblock = () => {
        const fetchData = async () => {
            try {
                await axios.post('http://localhost:3002/api/friends/friendReq', {userIdOne:useridOne, userIdTwo:useridTwo, status:"unblock"}, { withCredentials: true });
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    };

    return (
        <Container>
            <RequestButton onClick={handleRequest}> ADD </RequestButton>
            <BlockButton onClick={handleBlock}> BLOCK </BlockButton>
        </Container>
    );
};

export default FriendsButton;