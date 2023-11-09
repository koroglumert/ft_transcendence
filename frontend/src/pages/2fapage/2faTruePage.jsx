import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { BACK_URL } from "../../env";
const PasswordInput = ({ handleLogin }) => {
	const cookies = new Cookies();
	const userdata = cookies.get('data');
	const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePost = () => {
    fetch(`${BACK_URL}/api/2fa/verify`, {
      method: 'POST',
      body: JSON.stringify({ token: code , userId: userdata.userId}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); 
    })
    .catch(error => {
      console.error('Giriş yapılamadı', error);
    });
  };

  return (
    <div>
      <div>
        {/* 6 haneli şifre girişi */}
        <input
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="6 haneli şifre giriniz"
        />
      </div>
      <div>
        <button onClick={() => handleLogin(code)}>
          Giriş Yap
        </button>
        <button onClick={handlePost}>
          Post Yap
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
