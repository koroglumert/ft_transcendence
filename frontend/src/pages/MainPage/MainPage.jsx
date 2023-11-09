import React, { useEffect, useState } from "react";
import Leaderboard from "../../components/LeaderBoard/Leaderboard";
import BannerP from '../../assets/banner.png';
import Cookies from 'universal-cookie';
import { Container, Banner, ProfilePhoto, NewsDiv, Body, LeftBar, RightBar,} from "./MainComponents";
import axios from "axios";
import Footer from "../../components/Footer";
import { BACK_URL, FRONT_URL } from "../../env";
    
function MainPage() {
    const cookies = new Cookies();
    const userdata = cookies.get('data');
    const dataExists = userdata ? true : false;
    const [alluser, setAlluser] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BACK_URL}/api/users/allUsers`, { withCredentials: true });
                setAlluser(res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
                window.location.href = `${FRONT_URL}/LoginPage`;
                return null;
            }
        };
        fetchData();
    }, []);
    
    if (!dataExists) {
        window.location.href = `${FRONT_URL}/LoginPage`;
        return null;
    }

    return (
        <Container>
            <Body>
                <LeftBar>
                    <NewsDiv style={{display:"flex"}}>
                        <ProfilePhoto style={{width:"30%", height:"30%", borderRadius:"3%", marginLeft:"7%"}} src={userdata.profilePicture} />
                        <div style={{marginLeft:"12%", marginTop:"2%", textAlign:"center", alignItems:"center"}}>
                            <h1 style={{fontSize:"40px", fontWeight:"bold"}}>Welcome {userdata.name}</h1>
                            <h2 style={{fontSize:"20px", fontWeight:"bold"}}>Rank: {userdata.rank}</h2>
                            <h2 style={{fontSize:"20px", fontWeight:"bold"}}>Wins: {userdata.wins}</h2>
                            <h2 style={{fontSize:"20px", fontWeight:"bold"}}>Losses: {userdata.losses}</h2>
                        </div>
                    </NewsDiv>
                    <NewsDiv>
                        <Banner src={BannerP} />
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