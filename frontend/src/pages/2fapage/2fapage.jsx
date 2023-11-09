import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { BACK_URL } from "../../env";

const TwoFactorAuth = () => {
  const [qrCode, setQrCode] = useState('');
  const [code, setCode] = useState('');
  const cookies = new Cookies();
  const userdata = cookies.get('data');
  useEffect(() => {
		fetch(`${BACK_URL}/api/2fa/generate`, {
			method: 'POST',
 			headers: {
   	   			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ userId: userdata.userId }) // Kullanıcı kimliğini gönder
 		})
      .then(response => response.json())
      .then(data => {
		console.log("2faData", data);
        setQrCode(data.data); // QR kodunu ayarla
      })
      .catch(error => {
        console.error('QR kodu alınamadı', error);
      });
  }, []); // Boş bağımlılık dizisi sayesinde sadece bir kere çalışmasını sağlarız

  const handleCodeChange = (e) => {
	console.log("Şifre", e.target.value);
    setCode(e.target.value);
  };

  const handleLogin = (() => {

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
	  return data // Giriş işlemi başarılıysa veya değilse dönen veriyi işle
    })
	.then((data) => {
		console.log(data);
		if (data)
			window.location.href = "/2faTruePage";
	  })
    .catch(error => {
      console.error('Giriş yapılamadı', error);
    });
  })

  return (
    <div>
      <div>
        {/* QR Kodunu göstermek için img etiketi */}
        <img src={qrCode} alt="2FA QR Code" />
      </div>
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
        <button onClick={handleLogin}>
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
