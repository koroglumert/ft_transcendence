import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imgDB } from "../../pages/Firebase";
import styled from "styled-components";
import axios from "axios";
import { BACK_URL } from "../../env";
import Cookies from 'universal-cookie';
import { setUserId } from 'firebase/analytics';

const Container = styled.div`
    width: 450px;
    height: 300px;
    background-color: #3A3A3A;
    border-radius: 30px;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 1;
`;

const ProfilePictureDiv = styled.div`
    align-items: center;
    gap: 6%;
    display: flex;
    flex-direction: column;
    padding: 3%;
    background-color: red;
    width: 100%; 
    height: 100%;
    border-radius: 30px;
`;

const ProfilePicture = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
`;

const InputDiv = styled.div`
    display: flex;
    flex-direction: column;
    padding: 3%;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: blue;
`;

const NewUserName = styled.input`
    width: 40%;
    height: 23%;
    padding: 10px 20px;
    text-align: center;
    border-bottom: 1px solid #ccc;
    border: 2px solid #ccc;
`;

const NewCard = () => {
  const cookies = new Cookies();
  const userdata = cookies.get('data');
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      console.log("fotoğraf yüklendi");
    }
  };

  const editName = (e) => {
    const newName = e.target.value;
    setName(newName);
    console.log(name);
  };

  const handleUpload = async () => {
    if (image) {
      const storageRef = ref(imgDB, `images/${userdata.userId}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Yükleme ilerlemesi
          console.log("Resim başarıyla yüklendi");
        },
        (error) => {
          // Hata durumu
          console.error("Resim yüklenirken hata oluştu:", error);
        },
        async () => {
          // Yükleme tamamlandığında
          try {
            const downloadURL = await getDownloadURL(storageRef);
            console.log("Resim başarıyla yüklendi. URL:", downloadURL);
            handleSavePicture(downloadURL);
            // Burada istediğiniz işlemleri yapabilirsiniz (örneğin, veritabanına kaydetme)
          } catch (error) {
            console.error("Resim URL alınamadı:", error);
          }
        }
      );
    } else {
      console.error("Yüklemek için bir resim seçmelisiniz.");
    }
  };

  const handleSaveName = async () => {
    try {
      await axios.post(`${BACK_URL}/api/users/updateName`, {
        newName: name,
        userId: userdata.userId
      }, { withCredentials: true });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };
  
  const handleSavePicture = (downloadURL) => {
    console.log("AAAAAAAAA",downloadURL);
    axios
      .post(`${BACK_URL}/api/users/updatePicture`, { userId: userdata.userId, newPicture:downloadURL }, {
        withCredentials: true,
      })
      .then((response) => {
        // Başarılı bir şekilde yükleme tamamlandığında burada işlem yapabilirsiniz
        console.log('Yükleme işlemi başarılı. Cevap:', response.data);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Yükleme işlemi sırasında hata:', error);
      });
  };

  return (
    <Container>
      <ProfilePictureDiv>
        <input
          type="file"
          id="file-input"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="file-input">
          <ProfilePicture
            src={image || 'https://i.imgur.com/6VBx3io.png'}
            alt="Profile"
          />
        </label>
        <button onClick={handleUpload}>SAVE</button>
      </ProfilePictureDiv>
      <div className="field">
        <input
          id="name"
          type="text"
          onChange={editName}
          maxLength="15"
          minLength="6"
          value={name}
          placeholder={userdata.name}
          required
        />
        <button onClick={handleSaveName}> SAVE NAME </button>
      </div>
    </Container>
  );
};

export default NewCard;