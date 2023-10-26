import React from 'react';
import "./Leaderboard.css";
import defaultProfilePicture from '../../assets/default-profile-photo.png';

function Leaderboard(props) {
  const data = props.data || [];
  const rows = data.slice(0, 10).map((item, i) => {
    const { userId, userName, rank } = item;
    const openProfile = () => {
      window.open(`http://localhost:3000/profile/${userId}`, '_blank');
    };

    const profilePicture = null;

    return (
      <li key={i} onClick={openProfile}>
        <img
          src={profilePicture || defaultProfilePicture}
          alt='profilePicture'
          onError={(e) => {
            e.target.src = null; e.target.src=defaultProfilePicture}}
        />
        <mark>{userName}</mark>
        <small>{rank}</small>
      </li>
    );
  });

  return (
    <div className='leaderboard'>
      <h1>{props.title || 'Leaderboard'}</h1>
      <ol>{rows}</ol>
    </div>
  );
}

export default Leaderboard;