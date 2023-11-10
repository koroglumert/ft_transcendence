import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { BACK_URL } from "../../env";

const PasswordInput = ({ flag, setFlag }) => { // Pass setFlag as a prop

  const cookies = new Cookies();
  const userdata = cookies.get('data');
  const [code, setCode] = useState('');

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handlePost = async () => {
    try {
      const response = await fetch(`${BACK_URL}/api/2fa/verify`, {
        method: 'POST',
        body: JSON.stringify({ token: code, userId: userdata.userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      console.log(data);
  
      if (data.verified === true) {
        window.location.href = "http://localhost:3000/MainPage";
        localStorage.setItem('flag', 'true');
      } else {
        // İstediğiniz hata işlemini burada yapabilirsiniz.
      }
    } catch (error) {
      console.error('Giriş yapılamadı', error);
    }
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
        <button onClick={handlePost}>
          Post Yap
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
