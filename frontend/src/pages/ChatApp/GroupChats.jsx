import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Chat.css'
import { Stack, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { BACK_URL, SOCKET_URL } from '../../env';
const io = require('socket.io-client');

const GroupChats = () => {
    const [groups, setGroups] = useState(null);
    const [group, setGroup] = useState(null);

    const cookies = new Cookies();
    const data = cookies.get('data');

    const navigate = useNavigate();

    const handleClick = (address) => {
        navigate(address);
    }

    useEffect(() => {
        axios.get(`${BACK_URL}/api/groupmembers/${data.userId}`, { withCredentials: true })
            .then(response => {
                const results = response.data;
                console.log("RESULT: ", results);
                setGroups(results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div style={{background:"linear-gradient(#0f0, #3a4750)"}}>
        <div className='app'>
            <div className='contact-list'>
                <Stack className="messages-box">
                    {groups?.map((group, index) => {
                        return (
                            <div key={index} onClick={() => setGroup(group)}>
                                <ContactList group={group} data={data} />
                            </div>
                        );
                    })}
                </Stack>
                <div>
                    <button onClick={() => handleClick("/chat")}>DM</button>
                </div>
            </div>
            <div className='messsages'>
                <div>
                    <MessagesHistory group={group} data={data} />
                </div>
            </div>
        </div>
        </div>
    );
}

const MessagesHistory = ({ group, data }) => {

    const [searchVal, setSearchVal] = useState('');
    const [messages, setMessages] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const userId = group?.userId;


    useEffect(() => {
        if (group) {
            axios.get(`${BACK_URL}/api/groupmessages/${group?.groupId}`, { withCredentials: true })
                .then(response => {
                    const results = response.data;
                    setMessages(results);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [group]);


    useEffect(() => {
        if (group){
          // WebSocket bağlantısını useEffect içinde başlatın
          const socket = io(`${SOCKET_URL}`);
    
          socket.on('connect', () => {
            console.log('WebSocket bağlantısı başarıyla kuruldu -> ', socket.id);
            console.log("socketId: ", socket.id, "userId: ", data.userId);
          });
    
          socket.on('message', (sdata) => {
            console.log('Sunucudan gelen mesaj:', sdata);
            setMessages(sdata);
          });
    
          console.log("GROUPID: ", group?.groupId);
          socket.on(`${group?.groupId}`, (sdata) => {
            setMessages(sdata);
          });
          
          // Sunucuyla bağlantı kapatıldığında gerçekleşecek olay
          socket.on('disconnect', () => {
            console.log('WebSocket bağlantısı kapatıldı -> ');
          });
        
          // useEffect içinde bağlantıyı kapatma
          return () => {
            socket.disconnect();
          };
        }
      }, [group?._id]);    

    if (!group)
        return (
            <p style={{ textAlign: "center", width: "100%" }}>
                mesaj seçilmedi ...
            </p>
        );

    const handleInput = (e) => {
        setSearchVal(e.target.value);
    };

    const handleButton = async (e) => {
        console.log("fsafas", searchVal);
        if (!searchVal) return console.log("mesaj yazmadın");
        const response = await axios.post(`${BACK_URL}/api/groupmessages`, {
            groupId: group.groupId,
            senderId: group.userId,
            text: searchVal,
        });
        setNewMessage(response);
        //setMessages((prev) => [...prev, response.data]);
        setSearchVal("");
    };

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{group?.groupName}</strong>
            </div>
            <Stack gap={3} className="messages-history">
                {messages && messages.map((message, index) => (<Stack key={index}
                    className={`${message?.senderId === data?.userId ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                    <span>{message?.senderId === data?.userId ? "" : message.senderId}</span>
                    <span>{message.text}</span>
                </Stack>
                ))}
            </Stack>
            <input
                onChange={handleInput}
                value={searchVal}
                type="text"
                name="product-search"
                id="product-search"
                placeholder="mesajınız"
            />
            <button onClick={handleButton}>Gönder</button>
        </Stack>
    );
}


const ContactList = ({ group, data }) => {
    console.log("GROUP", group);
    return (<Stack direction="horizontal" role="button">
            <div>
                <div>{group?.groupName}</div>
            </div>
    </Stack>);
}

export default GroupChats;
