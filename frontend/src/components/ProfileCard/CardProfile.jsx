import React, { useState } from 'react';
import "./CardProfile.css";

const ImgUpload = ({ onChange, src }) => (
  <label htmlFor="photo-upload" className="custom-file-upload fas">
    <div className="img-wrap img-upload">
      <img htmlFor="photo-upload" src={src} alt="Preview" />
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

const Status = ({ onChange, value }) => (
  <div className="field">
    <label htmlFor="status">status:</label>
    <input
      id="status"
      type="text"
      onChange={onChange}
      maxLength="35"
      value={value}
      placeholder="It's a nice day!"
      required
    />
  </div>
);

const Profile = ({ onSubmit, src, name, status }) => (
  <div className="card">
    <form className="form1" onSubmit={onSubmit}>
      <h1>Profile Card</h1>
      <label className="custom-file-upload fas">
        <div className="img-wrap">
          <img htmlFor="photo-upload" src={src} alt="Preview" />
        </div>
      </label>
      <div className="name">{name}</div>
      <div className="status">{status}</div>
      <button type="submit" className="edit">
        Edit Profile
      </button>
    </form>
  </div>
);

const Edit = ({ onSubmit, children }) => (
  <div className="card">
    <form className='form1' onSubmit={onSubmit}>
      <h1>Settings</h1>
      {children}
      <button type="submit" className="save">
        Save
      </button>
    </form>
  </div>
);

function CardProfile( {user} ) {
  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    'https://github.com/OlgaKoplik/CodePen/blob/master/profile.jpg?raw=true'
  );
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [active, setActive] = useState('edit');

  const photoUpload = (e) => { //Profil fotoğrafı yükleme kısmı
    e.preventDefault();
    const reader = new FileReader();
    const newFile = e.target.files[0];
    reader.onloadend = () => {
      setFile(newFile);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(newFile);
  };

  const editName = (e) => {
    const newName = e.target.value;
    setName(newName);
  };

  const editStatus = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newActive = active === 'edit' ? 'profile' : 'edit';
    setActive(newActive);
  };

  console.log("imageeee",imagePreviewUrl);
  console.log("name", typeof(imagePreviewUrl));

  return (
    <div>
      {active === 'edit' ? (
        <Edit onSubmit={handleSubmit}>
          <ImgUpload onChange={photoUpload} src={imagePreviewUrl} />
          <Name onChange={editName} value={name} user={user}/>
          <Status onChange={editStatus} value={status} />
        </Edit>
      ) : (
        <Profile onSubmit={handleSubmit} src={imagePreviewUrl} name={name} status={status} />
      )}
    </div>
  );
}

export default CardProfile;
