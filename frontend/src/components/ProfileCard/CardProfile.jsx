import React, { useState } from 'react';
import "./CardProfile.css";
import axios from "axios";
import { BACK_URL } from "../../env";
import Cookies from 'universal-cookie';
import TwoFactorAuth from '../../pages/2fapage/2fapage';

const cookies = new Cookies();
const userdata = cookies.get('data');

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img htmlFor="photo-upload" src={src} alt="P"/>
    </div>
    <input className='input1' id="photo-upload" type="file" onChange={onChange} />
  </label>
);

const Name = ({ onChange, value, user }) => (
  <div className="field">
    <label htmlFor="name">name:</label>
    <input
      id="name"
      type="text"
      onChange={onChange}
      maxLength="25"
      value={value}
      placeholder={user.name}
      required
    />
  </div>
);

const handleSaveName = async (name) => {
  try {
    await axios.post(`${BACK_URL}/api/users/updateName`, {
      newName: name,
      userId: userdata.userId
    }, { withCredentials: true });
    window.location.reload();
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const handleSavePicture = async (picture) => {
  console.log(picture);
  try {
    await axios.post(`${BACK_URL}/api/users/updatePicture`, {
      newPicture: picture,
      userId: userdata.userId
    }, { withCredentials: true });
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};

const Profile = ({ onSubmit, src, name }) => (
  <div className="card">
    <form className="form1" onSubmit={onSubmit}>
      <h1>Profile Card</h1>
      <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img htmlFor="photo-upload" src={src} alt="Preview" />
        </div>
      </label>
      <div className="name">{name}</div>
      <button onClick={() => handleSaveName(name)}>SAVE</button>
    </form>
  </div>
);

const Edit = ({ onSubmit, children }) => (
  <div className="card">
    <form className='form1' onSubmit={onSubmit}>
      <h1>Settings</h1>
      {children}
      <button>Submit</button>
    </form>
  </div>
);

function CardProfile({ user }) {
  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [QrCode, setQrCode] = useState(false);
  const [name, setName] = useState('');
  const [active, setActive] = useState('edit');

  const photoUpload = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const newFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(newFile);
      setImagePreviewUrl(reader.result);
      handleSavePicture(reader.result);
    };
    reader.readAsDataURL(newFile);
  };  
  const editName = (e) => {
    const newName = e.target.value;
    setName(newName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActive = active === 'edit' ? 'profile' : 'edit';
    setActive(newActive);
  };

  const handleQrCode = (e) => {
    setQrCode(!QrCode);
  };

  return (
    QrCode ? (
      <Edit>
        <TwoFactorAuth />
      </Edit>
    ) : (
      <div>
        {active === 'edit' ? (
          <div>
            <Edit onSubmit={handleSubmit}>
              <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
              <Name onChange={editName} value={name} user={user} />
            </Edit>
            <button onClick={handleQrCode}>2FA</button>
          </div>
        ) : (
          <Profile onSubmit={handleSubmit} src={imagePreviewUrl} name={name} />
        )}
      </div>
    )
  );
}

export default CardProfile;
