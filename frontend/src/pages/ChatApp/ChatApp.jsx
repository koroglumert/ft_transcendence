import React, { useEffect, useState } from 'react';
import './ChatApp.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Chat.css'
import { Stack, Container } from "react-bootstrap";
import { io } from "socket.io-client";


const ChatApp = () => {
  const [contacts, setContacts] = useState(null);
  const [messages, setMessages] = useState(null);

  const cookies = new Cookies();
  const data = cookies.get('data');

  useEffect(() => {

    axios.get(`http://localhost:3002/api/chat/${data.userId}`, { withCredentials: true })
      .then(response => {
        const results = response.data;
        setContacts(results);
        console.log("results: ", results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className='app'>
      <div className='contact-list'>
        <Stack className="messages-box flex-grow-0 pe-3 ms-auto" gap={3}>
          {contacts?.map((chat, index) => {
            return (
              <div key={index} onClick={() => setMessages(chat)}>
                <ContactList chat={chat} data={data} />
              </div>
            );
          })}
        </Stack>
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
  const [getUser, setUser] = useState(null);
  const [messages, setMessages] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [newMessage, setNewMessage] = useState(null);

  const userId = data?.userId === chat?.firstId ? chat.secondId : chat?.firstId;
  const dataId = data?.userId;

  // Sunucuyla iletişim kurmak için bir olay gönderme
  console.log("CHATID: ", chat);
  useEffect(() => {
    if (chat) {
      axios.get(`http://localhost:3002/api/users/find/${userId}`, { withCredentials: true })
        .then(response => {
          const results = response.data;
          setUser(results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [chat, userId]);


  // //init socket
  // useEffect(() => {
  //   const newSocket = io('http://localhost:8071'); // WebSocket sunucunuzun URL'sini ve bağlantı noktasını belirtin
  //   setSocket(newSocket);
  //   return () => {
  //     newSocket.disconnect();
  //   }
  // }, [data])


  // // add online users
  // useEffect(() => {
  //   if (socket === null) return
  //   socket.emit("addNewUser", data?.userId);
  //   socket.on("getOnlineUsers", (res) => {
  //     //setOnlineUsers(res);
  //   })
  // }, [socket])

  // // send message
  // useEffect(() => {
  //   if (socket === null) return;
  //   console.log("geldi");
  //   socket.emit("sendMessage", { ...newMessage, userId })
  // }, [newMessage])

  // //receive message

  // useEffect(() => {
  //   console.log("ekleme öncesi-1");
  //   console.log(socket);
  //   if (socket === null) {
  //     console.log("null geldi");
  //     return;
  //   }
  //   socket.on("getMessage", res => {
  //     console.log("ekleme öncesi0");
  //     if (chat?._id !== res.data.chatId) return;
  //     console.log("ekleme öncesi");
  //     setMessages((prev) => [...prev, res.data]);
  //     console.log("ekleme sonrası");
  //   })
  //   return () => {
  //     socket.off("getMessage");
  //   }
  // }, [socket, chat])

  const socket = io("http://localhost:8071");

  socket.on('connect', () => {
    console.log('WebSocket bağlantısı başarıyla kuruldu.');
  });

  socket.emit('call', 'remote.addNewUser', { dataId },
    function (err, res) {
      if (err) {
        console.error(err)
      } else {
        console.log('call success:', res)
      }
    })

  // // Sunucudan gelen mesajları dinlemek için bir olay ekleme
  // socket.on('message', (sdata) => {
  //   console.log('Sunucudan gelen mesaj:', sdata);
  // });

  // // Sunucuyla bağlantı kapatıldığında gerçekleşecek olay
  // socket.on('disconnect', () => {
  //   console.log('WebSocket bağlantısı kapatıldı.');
  // });

  // useEffect(() => {
  //   socket.emit('call', 'message.get', { id: chat?._id },
  //     function (err, res) {
  //       if (err)
  //         console.log(err);
  //       else {
  //         setMessages(res)
  //         console.log("call success", res);
  //       }
  //     }
  //   )
  // })



  useEffect(() => {
    if (chat) {
      axios.get(`http://localhost:3002/api/message/${chat?._id}`, { withCredentials: true })
        .then(response => {
          const results = response.data;
          setMessages(results);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [chat]);


  const handleInput = (e) => {
    setSearchVal(e.target.value);
  };

  const handleButton = async (e) => {
    console.log("fsafas", searchVal);
    if (!searchVal) return console.log("mesaj yazmadın");
    const response = await axios.post("http://localhost:3002/api/message", {
      chatId: chat._id,
      senderId: data.userId,
      text: searchVal
    });
    setNewMessage(response);
    setMessages((prev) => [...prev, response.data]);
    setSearchVal("");
  };

  if (!getUser)
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        mesaj seçilmedi ...
      </p>
    );

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

    axios.get(`http://localhost:3002/api/users/find/${userId}`, { withCredentials: true })
      .then(response => {
        const results = response.data;
        setUser(results);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [userId]);
  return (<Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role="button">
    <div className="d-flex">
      <div className="me-2">
        <img src={getUser?.profilePicture} height="35px" />
      </div>
      <div className="text-content">
        <div className="name">{getUser?.name}</div>
      </div>
    </div>
    <div className="d-flex flex-column align-items-end">
    </div>
  </Stack>);
}


export default ChatApp;
