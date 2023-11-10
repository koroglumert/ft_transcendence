import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const users = "mkarakule77";

const getMimeType = (file, fallback = null) => {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = '';
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case '89504e47':
      return 'image/png';
    case '47494638':
      return 'image/gif';
    case 'ffd8ffe0':
    case 'ffd8ffe1':
    case 'ffd8ffe2':
    case 'ffd8ffe3':
    case 'ffd8ffe8':
      return 'image/jpeg';
    default:
      return fallback;
  }
};

const ChangeAvatar = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarImage, setAvatarImage] = useState({
    name: '',
    src: '',
    type: '',
  });
  const [valid, setValid] = useState(true);

  const avatarCropper = useRef(); // Avatar resim düzenlemesi için Ref
  const inputImageRef = useRef(); // Resim yükleme inputu için Ref

  const rules = [];
  let existingName = null;
  let i = 0;

  if (username.length > 0) {
    existingName = ''; // Get the existing username logic here
    while (username !== existingName && i < users.length) {
      existingName = users[i++].username;
    }
    if (username === existingName) {
      const rule = 'Username already exists';
      rules.push(rule);
    }
    let rule2 = v => (v && v.length <= 8) || 'Must be less than 8 characters';
    rules.push(rule2);
    let rule3 = v => !(/\s/g.test(v)) || 'Must not contain spaces';
    rules.push(rule3);
  }

  useEffect(() => {
    // Fetch users here
  }, []);

  const handleSubmit = () => {
    if (valid) {
      setDialogVisible(false);
      if (avatarImage.src) {
        const cropper = avatarCropper.current;
        if (cropper) {
          cropper.getCroppedCanvas().toBlob((blob) => {
            const form = new FormData();
            form.append('file', blob, avatarImage.name);
            axios.put('/user/me/avatar', form).then(() => {
              axios.get('/user/me/avatar', { responseType: 'arraybuffer' }).then((res) => {
                const avatar = `data:image/*;base64,${Buffer.from(res.data).toString('base64')}`;
                // Update the avatar state here
              });
            });
          }, avatarImage.type);
        }
      }
      if (username) {
        axios.put('/user/me', { username }).then(() => {
          axios.get('/user/me').then((response) => {
            // Update user data here
          });
        });
      }
    }
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      if (avatarImage.src) {
        URL.revokeObjectURL(avatarImage.src);
      }
      const blob = URL.createObjectURL(files[0]);
      setValid(true);
      setAvatarImage({
        name: files[0].name,
        src: blob,
        type: getMimeType(files[0], files[0].type),
      });
    }
  };

  return (
    <div>
      <button onClick={() => setDialogVisible(true)}>Avatar/Username</button>
      {dialogVisible && (
        <div>
          {/* Dialog Content */}
          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
            />
            {/* Image Upload */}
            <input
              ref={inputImageRef} // Resim yükleme inputu için Ref
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <button onClick={() => inputImageRef.current.click()}>Upload Avatar</button>
            {avatarImage.src && (
              <Cropper
                src={avatarImage.src}
                aspectRatio={1}
                ref={avatarCropper} // Avatar resim düzenlemesi için Ref
              />
            )}
            <button type="submit">OK</button>
            <button onClick={() => setDialogVisible(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangeAvatar;
