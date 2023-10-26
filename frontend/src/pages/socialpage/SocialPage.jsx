import React from "react";
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const SocialPage = () => {

    const cookies = new Cookies();
    const userdata = cookies.get('data');

    const [allblocks, setAllblocks] = useState([]);
    const [allfriends, setAllfriends] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post('http://localhost:3002/api/friends/friendsData', {userId: userdata.userId},{ withCredentials: true });
                setAllfriends(res.data);
                console.log("allFriends",res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post('http://localhost:3002/api/friends/blocksData', {userId: userdata.userId},{ withCredentials: true });
                setAllblocks(res.data);
                console.log("allblocks",res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    }, []);
    
    return (
        <div style={{display:"flex", gap:"20px", justifyContent:"center"}}>
                <div>
                    <h1>Blocked</h1>
                    {allblocks.map((blocks, index) => (
                        <div key={index} style={{ color: "black" }}>
                            <div style={{display:"flex", gap:"20px"}}>    
                                <li>
                                {blocks.userIdTwo}
                                </li>
                                {blocks.status}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <h1>Friends</h1>
                    {allfriends.map((friends, index) => (
                        <div key={index} style={{ color: "black" }}>
                            <div style={{display:"flex", gap:"20px"}}>    
                                <li>
                                {friends.userIdTwo}
                                </li>
                                {friends.status}
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default SocialPage;