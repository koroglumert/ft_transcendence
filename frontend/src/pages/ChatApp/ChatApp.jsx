import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Chat.css'
import { Stack } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { BACK_URL, SOCKET_URL } from "../../env"
import { FaPaperPlane } from 'react-icons/fa';

const io = require('socket.io-client');

const ChatApp = () => {
  const [contacts, setContacts] = useState(null);
  const [messages, setMessages] = useState(null);
  const [allfriends, setAllfriends] = useState([]);

  const cookies = new Cookies();
  const data = cookies.get('data');

  const navigate = useNavigate();
  
  const handleMessages = async (secondId) => {
    try {
      const res = await axios.post(`${BACK_URL}/api/chat`, { firstId:data.userId, secondId:secondId }, { withCredentials: true });
      setMessages(res.data);
      console.log("aaaaaaa");
          } catch (err) {
              console.error("Error fetching data:", err);
          }
  }

  const handleClick = (address) => {
    navigate(address);
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await axios.post(`${BACK_URL}/api/friend/listFriend`, { userIdOne: data.userId }, { withCredentials: true });
            setAllfriends(res.data.data);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };
    fetchData();
}, []);


  useEffect(() => {
    axios.get(`${BACK_URL}/api/chat/${data.userId}`, { withCredentials: true })
      .then(response => {
        const results = response.data;
        setContacts(results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });


  }, []);

  return (
    <div style={{background:"linear-gradient(#0f0, #3a4750)"}}>
    <div className='app'>
      <div className='contact-list'>
        <div>
          {contacts?.map((chat, index) => {
            return (
                <div style={{background:"#3a4750", padding:"1px", borderRadius:"1px"}} key={index} onClick={() => setMessages(chat)} >
                  <ContactList chat={chat} data={data} />
                </div>
            );
          })}
        </div>
        <div>
          <button onClick={() => handleClick("/groups")}>GRUP</button>
        </div>
      </div>
      <div className='messsages'>
        <div>
          <MessagesHistory chat={messages} data={data} />
        </div>
      </div>
      <div style={{width:"20%", background:"#3a4750", padding:"1%", alignItems:"center"}}>
        <div style={{width:"100%"}}>
                        {allfriends.map((friend) => (
                        <div key={friend.userId} style={{display:"flex", alignItems:"center",
                        background:"#D3D6DB", padding:"10px", borderRadius:"12px", width:"100%",
                        gap:"10px", cursor:"pointer"}} onClick={() => handleMessages(friend.userId)}>
                            <img src={friend.profilePicture} style={{width:"65px", height:"65px", borderRadius:"50%", backgroundColor:"blue"}}></img>                    
                            <h1>{friend.name}</h1>
                        </div>
                        ))}
        </div>
      </div>
    </div>
    </div>
  );
}

const MessagesHistory = ({ chat, data }) => {

  const [searchVal, setSearchVal] = useState('');
  const [getUser, setUser] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const userId = data.userId === chat?.firstId ? chat.secondId : chat?.firstId;
  const firstId = chat?.firstId;
  const secondId = chat?.secondId;
  
  const messagesHistoryRef = useRef(null);

  useEffect(() => {
    // Sayfa yüklendiğinde veya bileşen monte edildiğinde scroll çubuğunu aşağı kaydırır
    const messagesHistory = messagesHistoryRef.current;
    
    if (messagesHistory) {
      messagesHistory.scrollTop = messagesHistory.scrollHeight;
    }
  },);

  useEffect(() => {
    if (chat) {
      axios.get(`${BACK_URL}/api/message/${chat?._id}`, { withCredentials: true })
        .then(response => {
          const results = response.data;
          setMessages(results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [chat]);

  useEffect(() => {
    if (chat) {
      // WebSocket bağlantısını useEffect içinde başlatın
      const socket = io(`${SOCKET_URL}`);

      socket.on('connect', () => {
        console.log('WebSocket bağlantısı başarıyla kuruldu -> ', socket.id);
        console.log("socketId: ", socket.id, "userId: ", data.userId, "userTwo", userId);
      });

      socket.on('message', (sdata) => {
        console.log('Sunucudan gelen mesaj:', sdata);
        setMessages(sdata);
      });

      socket.on(`${chat?._id}`, (sdata) => {
        console.log('Sunucudan gelen mesaj:', sdata);
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
  }, [firstId, secondId]);

  useEffect(() => {
    if (chat) {
      axios.get(`${BACK_URL}/api/users/find/${userId}`, { withCredentials: true })
        .then(response => {
          const results = response.data;
          setUser(results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [chat, userId]);

  if (!getUser)
    return (
      <p style={{ textAlign: "center", width: "100%", color:"white" }}>
        mesaj seçilmedi ...
      </p>
    );

  const handleInput = (e) => {
    setSearchVal(e.target.value);
  };

  const handleButton = async (e) => {
    console.log("fsafas", searchVal);

    if (!searchVal) return console.log("mesaj yazmadın");

    let receipentId;

    if (data.userId === chat.firstId)
      receipentId = chat.secondId;
    else
      receipentId = chat.firstId;

    const response = await axios.post(`${BACK_URL}/api/message`, {
      chatId: chat._id,
      senderId: data.userId,
      text: searchVal,
    });

    setNewMessage(response);
    //setMessages((prev) => [...prev, response.data]);
    setSearchVal("");
  };

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{getUser?.name}</strong>
      </div>
      <Stack gap={3} className="messages-history" ref={messagesHistoryRef}>
        {messages && messages.map((message, index) => (<Stack key={index}
          className={`${message?.senderId === data?.userId ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
          <span>{message.text}</span>
        </Stack>
        ))}
      </Stack >
      <div style={{display:"flex", textAlign:"center", alignItems:"center", padding:"1px"}}>
        <input
          onChange={handleInput}
          value={searchVal}
          type="text"
          name="product-search"
          id="product-search"
          placeholder="Mesajınız"/>
        <button style={{width:"10%", borderRadius:"100px", 
        background:"#d3d6db", fontSize:"30px", color:"black"}} onClick={handleButton}><FaPaperPlane /></button>
      </div>
    </Stack>
  );
}


const ContactList = ({ chat, data }) => {

  const [getUser, setUser] = useState(null);
  const userId = data.userId === chat?.firstId ? chat.secondId : chat?.firstId;
  useEffect(() => {

    axios.get(`${BACK_URL}/api/users/find/${userId}`, { withCredentials: true })
      .then(response => {
        const results = response.data;
        setUser(results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [userId]);
  return (
    <div style={{display:"flex", gap:"12px", padding:"2%",
    alignItems:"center", border:"1px solid black",
    background:"#d3d6db", cursor:"pointer"}}>
      <img style={{overflow:"hidden", borderRadius:"100%", width:"65px", height:"65px"}} src={getUser?.profilePicture} />
        <h2 style={{color:"#303841"}}>{getUser?.name}</h2> 
    </div>);
}

export default ChatApp;
