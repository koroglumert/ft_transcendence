import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Chat.css'
import { Stack, Container } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { BACK_URL, SOCKET_URL } from "../../env"

const io = require('socket.io-client');

const ChatApp = () => {
  const [contacts, setContacts] = useState(null);
  const [messages, setMessages] = useState(null);

  const cookies = new Cookies();
  const data = cookies.get('data');

  const navigate = useNavigate();

  const handleClick = (address) => {
    navigate(address);
  }

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
    <div className='app'>
      <div className='contact-list'>
        <div>
          {contacts?.map((chat, index) => {
            return (
              <div key={index} onClick={() => setMessages(chat)} >
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
        <div className='messages-history'>
          <MessagesHistory chat={messages} data={data} />
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

  console.log("firstId: ", chat?.firstId, " secondId: ", chat?.secondId);
  const firstId = chat?.firstId;
  const secondId = chat?.secondId;

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
        console.log("socketId: ", socket.id, "userId: ", data.userId);
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

    let receipentId;

    if (data.userId === chat.firstId)
      receipentId = chat.secondId;
    else
      receipentId = chat.firstId;

    const response = await axios.post(`${BACK_URL}/api/message`, {
      chatId: chat._id,
      firstId: chat.firstId,
      secondId: chat.secondId,
      text: searchVal,
      receipentId: receipentId,
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
      <Stack gap={3} className="messages">
        {messages && messages.map((message, index) => (<Stack key={index}
          className={`${message?.senderId === data?.userId ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
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
      <button onClick={handleButton}>SELAM</button>
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
    <div style={{gap:"10px", backgroundColor:"black"}}>
    <div style={{display:"flex", gap:"12px", padding:"2%", backgroundColor:"yellow"}}>
      <img style={{overflow:"hidden", borderRadius:"100%"}} src={getUser?.profilePicture} height="35px" />
        <h2 className="name">{getUser?.name}</h2>
    </div>
  </div>);
}

export default ChatApp;
