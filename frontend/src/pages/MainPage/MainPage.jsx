import React, { useEffect, useState } from "react";
import Leaderboard from "../../components/LeaderBoard/Leaderboard";
import BannerP from '../../assets/banner.png';
import Cookies from 'universal-cookie';
import { Container, Banner, ProfilePhoto, NewsDiv,
        Body, LeftBar, RightBar, Header1, Header2}
        from "./MainComponents";
import axios from "axios";
import Footer from "../../components/Footer";
import { BACK_URL, FRONT_URL } from "../../env";
import PasswordInput from "../../pages/2fapage/2faTruePage";
    
function MainPage() {
    const cookies = new Cookies();
    const userdata = cookies.get('data');
    const dataExists = userdata ? true : false;
    const [alluser, setAlluser] = useState([]);
    const [myUser, setMyUser] = useState([]);
    const [flag, setFlag] = useState(localStorage.getItem('flag') === 'true');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACK_URL}/api/users/allUsers`, { withCredentials: true });
                setAlluser(res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
                window.location.href = "http://localhost:3000/LoginPage";
                return null;
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACK_URL}/api/users/find/${userdata.userId}`, { withCredentials: true });
                setMyUser(res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
                window.location.href = "http://localhost:3000/LoginPage";
                return null;
            }
        };
        fetchData();
    }, []);
    
    if (!dataExists) {
        window.location.href = `${FRONT_URL}/LoginPage`;
        return null;
    }

    if (myUser.twoFactorAuthy === true && flag === false) {
        return (
            <div>   
                <div className="popup">
                <PasswordInput flag={flag} setFlag={setFlag} />
                </div>
            </div>
        );
    }

    console.log("myuser", myUser);
    return (
        <Container>
            <Body>
                <LeftBar>
                    <NewsDiv>
                        <div style={{display:"flex", padding:"2%"}}>
                            <ProfilePhoto style={{width:"30%", height:"30%", borderRadius:"3%", marginLeft:"7%"}} src={myUser.profilePicture} />
                            <div style={{marginLeft:"12%", marginTop:"2%", textAlign:"center", alignItems:"center"}}>
                                <Header1>Welcome {myUser.name}</Header1>
                                <Header2 style={{fontSize:"20px", fontWeight:"bold"}}>Rank: {myUser.rank}</Header2>
                                <Header2 style={{fontSize:"20px", fontWeight:"bold"}}>Wins: {myUser.wins}</Header2>
                                <Header2 style={{fontSize:"20px", fontWeight:"bold"}}>Losses: {myUser.losses}</Header2>
                            </div>
                        </div>
                        <div style={{textAlign:"center"}}>
                            <Banner src={BannerP} />
                        </div>
                    </NewsDiv>
                </LeftBar>
                <RightBar>
                    <Leaderboard allusers={alluser} title="LeaderBoard - All Time"/>
                </RightBar>
            </Body>
            <Footer />
        </Container>
    )
}

export default MainPage;