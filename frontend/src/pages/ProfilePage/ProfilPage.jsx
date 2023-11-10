import React from "react";
import styled from "styled-components";
import NavbarMenu from "../../components/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACK_URL, FRONT_URL } from "../../env";
import Cookies from "universal-cookie";
import PreLoader from "../../components/PreLoader";
import Leaderboard from "../../components/LeaderBoard/Leaderboard";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: left;
    text-align: left;
    width: 100%;
    height: 100vh;
    background: linear-gradient(#0f0, #303841);
`;

const ProfileDiv = styled.div`
    padding: 2%;
    width: 60%;
    gap: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const InfoDiv = styled.div`
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    gap: 2%;
    padding: 2%;
`;

const MatchDiv = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FriendDiv = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10%;
    padding: 2%;
`;

const ProfilePicture = styled.img`
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
`;

const ProfileName = styled.h1`
    font-size: 2rem;
    margin: 0;
`;

const ProfileInfo = styled.h2`
    margin: 0;
`;

const ProfilePage = () => {
    const [alluser, setAlluser] = useState([]);
    const currentURL = window.location.href; // Mevcut sayfanın URL'sini alır
    const urlParts = currentURL.split('/'); // URL'yi '/' karakterine göre böler
    const username = urlParts[urlParts.length - 1]; // Son parçayı alarak kullanıcı kimliğini elde eder
    
    const cookie = new Cookies();
    const data = cookie.get('data');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACK_URL}/api/users/allUsers`, { withCredentials: true });
                setAlluser(res.data);
            } catch (err) {
                console.error("Data çekme hatası:", err);
                window.location.href = `http://${FRONT_URL}/`;
                return null;
            }
        };
        fetchData();
    }, []);

    if (!data){
        window.location.href = `${FRONT_URL}/`;
        return null;
    }

    const user = alluser.find((user) => user.name === username);
    console.log (user);
    console.log (alluser);
    return (
        <div>
            {user ? (
                <Container>
                    {user && (
                        <div>
                        <ProfileDiv>
                            <ProfilePicture src={user.profilePicture} alt="Avatar" />
                            <div style={{flexDirection:"column"}}>
                            <ProfileName>{user.name}</ProfileName>
                            <ProfileInfo>Rank: {user.rank}</ProfileInfo>
                            <ProfileInfo>Wins: {user.wins}</ProfileInfo>
                            <ProfileInfo>Losses: {user.losses}</ProfileInfo>
                            </div>
                        </ProfileDiv>
                        <InfoDiv>
                            <MatchDiv>
                                Match History
                                <Leaderboard allusers={alluser} title="LeaderBoard - All Time"/>
                            </MatchDiv>
                            <FriendDiv>
                                Friends
                                <Leaderboard allusers={alluser} title="LeaderBoard - All Time"/>
                            </FriendDiv>
                        </InfoDiv>
                        </div>
                    )}
                </Container>
                ) : (
                <section className="section1">
                    <PreLoader />
                </section>
            )}
        </div>
    );
};

export default ProfilePage;
