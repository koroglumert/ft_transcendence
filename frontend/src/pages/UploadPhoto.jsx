import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { imgDB } from "./Firebase";
import Cookies from 'universal-cookie';

const ImageUpload = () => {
  const cookies = new Cookies();
  const userdata = cookies.get('data');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  console.log(userdata);
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const storageRef = ref(imgDB, `images/${userdata.userId}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Yükleme ilerlemesi
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
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

  return (
    <div>
      <input type="file" onChange={handleChange} />
      <button onClick={handleUpload}>Yükle</button>
      <progress value={progress} max="40" />
    </div>
  );
};

export default ImageUpload;
