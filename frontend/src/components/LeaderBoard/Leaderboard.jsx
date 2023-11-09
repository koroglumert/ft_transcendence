import React from 'react';
import "./Leaderboard.css";
import defaultProfilePicture from '../../assets/default-profile-photo.png';
import { useNavigate } from 'react-router-dom';
import { FRONT_URL } from './../../env';

function Leaderboard(props) {
  const allUsers = props.allusers || {}; // allusers prop'unu alın
  const sortedUsers = Object.values(allUsers).sort((a, b) => b.rank - a.rank); // Kullanıcıları sırala
  const navigate = useNavigate();

  const rows = sortedUsers.slice(0, 10).map((user, i) => {
    const { profilePicture, name, rank } = user;
    const openProfile = () => {
      window.location.href = `${FRONT_URL}/profile/${name}`;
    };

    return (
      <li key={i} onClick={openProfile}>
        <img
          src={profilePicture || defaultProfilePicture}
          alt='profilePicture'
          onError={(e) => {
            e.target.src = null; e.target.src = defaultProfilePicture
          }}
        />
        <mark>{name}</mark>
        <small>{rank}</small>
      </li>
    );
  });

  return (
    <div className='leaderboard'>
      <h1 style={{ color: "white" }}>{props.title || 'Leaderboard'}</h1>
      <ol>{rows}</ol>
    </div>
  );
}

export default Leaderboard;
