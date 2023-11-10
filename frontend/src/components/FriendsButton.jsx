import React from "react";
import styled from "styled-components";
import axios from "axios";
import { BACK_URL } from "../env";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    gap: 5px;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const RequestButton = styled.button`
    width: 100px;
    height: 40px;
    padding: 9px;
    text-align: center;
    font-weight: 900;
    background: #347474;
    color: black;
    font-size: 100%;
    border-radius: 5px;
    &:hover{
        background-color:  #42b883;
        cursor: pointer;
    }
`;

const BlockButton = styled.button`
    width: 100px;
    height: 40px;
    padding: 9px;
    font-weight: 900;
    border: 0 auto;
    background-color: #ff0000;
    color: black;
    font-size: 15px;
    border-radius: 5px;
    &:hover{
        cursor: pointer;
        background-color: #fb7777;
    }
`;

const FriendsButton = ({ useridOne, useridTwo }) => {
    const handleRequest = () => { // Status add veya remove olmalıdır.
        const fetchData = async () => {
            try {
                await axios.post(`${BACK_URL}/api/notification/friendReq`,
                    { userIdOne: useridOne, userIdTwo: useridTwo, status: "add" },
                    { withCredentials: true });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    };

    const handleBlock = () => { // status için add yada remove gelebilir.
        const fetchData = async () => {
            try {
                await axios.post(`${BACK_URL}/api/block/handleBlock`,
                    { userIdOne: useridOne, userIdTwo: useridTwo, status: "add" },
                    { withCredentials: true });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    };

    const handleUnblock = () => {
        const fetchData = async () => {
            try {
                await axios.post(`${BACK_URL}/api/friends/friendReq`, { userIdOne: useridOne, userIdTwo: useridTwo, status: "unblock" }, { withCredentials: true });
            } catch (err) {
                console.error("Error fetching data:", err);
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