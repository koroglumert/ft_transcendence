import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { BACK_URL } from "../../env";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;    
`;

const ButtonDiv = styled.div`
    display: flex;
    gap: 3%;
    justify-content: center;
    align-items: center;
    margin: 10px;
`;

const Button = styled.button`
    width: 10%;
    border-radius: 50px;
    border: none;
    background-color: #4CAF50;
    color: white;
    font-size: 100%;
    padding: 13px;
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
    const [divFriend, setDivFriend] = useState(true);

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
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    console.log("allblocks", allblocks);
    console.log("allfriends", allfriends);

    const handleDivFriend = () => {
        setDivFriend(!divFriend);
    };

    return (
        <Container>
            <ButtonDiv>
                <Button onClick={handleDivFriend}>Friends List</Button>
                <Button onClick={handleDivFriend}>Blocked List</Button>
            </ButtonDiv>
            <div>
                {divFriend ? (
                    <div>
                        {allfriends.map((friend) => (
                        <div key={friend.userId} style={{display:"flex", justifyContent:"center", textAlign:"center", backgroundColor:"red"}}>
                            <img src={friend.profilePicture} style={{width:"100px", height:"100px", borderRadius:"50%", backgroundColor:"blue"}}></img>                    
                            <h1>{friend.name}</h1>
                            <button>Unfriend</button>
                        </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        {allblocks.map((block) => (
                        <div key={block.userId} style={{display:"flex", justifyContent:"center", textAlign:"center", backgroundColor:"blue"}}>
                            <img src={block.profilePicture} style={{width:"100px", height:"100px", borderRadius:"50%", backgroundColor:"blue"}}></img>
                            <h1>{block.name}</h1>
                            <button>Unblock</button>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
        );
};

export default SocialPage;