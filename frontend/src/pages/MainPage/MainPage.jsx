import React, { useEffect, useState } from "react";
import LogoP from '../../assets/logo.png';
import NavbarButton from "../../components/NavbarButton";
import Leaderboard from "../../components/LeaderBoard/Leaderboard";
import BannerP from '../../assets/banner.png';
import SearchBar from "../../components/SearchBar";
import Cookies from 'universal-cookie';

import NotificationIcon from '../../assets/notification-icon.png';
import { Container, Navbar, Notification, Banner,
        ProfilePhoto, NewsDiv, Logo, Body, LeftBar, RightBar,
        ProfileDropDown, ProfileDropDownItem, NotificationDropDown,
        NotificationDropDownItem } from "./MainComponents";
import axios from "axios";
import NotificationBar from "../../components/Notification";
    
function MainPage() {
    const cookies = new Cookies();
    const userdata = cookies.get('data');
    const dataExists = userdata ? true : false;
    
    const [alluser, setAlluser] = useState([]);
    const [isDropDownProfile, setDropdownOpen] = useState(false);
    const [isDropDownNotification, setDropdownNot] = useState(false);
    const [isDropDownSearch, setDropdownSearch] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3002/api/users/allUsers', { withCredentials: true });
                console.log("alluser",res);
                setAlluser(res.data);
            } catch (err) {
                console.error("Error fetching data:" ,err);
            }
        };
        fetchData();
    }, []);
    
    if (!dataExists) {
        window.location.href = "http://localhost:3000/LoginPage";
        return null;
    }

    const handleProfile = () => {
        setDropdownOpen(!isDropDownProfile);
    }

    const handleNotification = () => {
        setDropdownNot(!isDropDownNotification);
    }

    const handleSearch = () => {
        setDropdownSearch(!isDropDownSearch);
    };

    return (
        <Container>
            <Navbar>
                <Logo src={LogoP} />
                <div onClick={handleSearch} style={{ width:"60%", position: 'relative', padding:"0px", textAlign:"center", alignItems:"center"}}>
                    <SearchBar alluser={alluser} useridOne={userdata.userId}/>
                </div>
                <div style={{width:"100%", padding:"12px"}}>
                    <NavbarButton />
                </div>
                <div style={{ width:"40%", position: 'relative', textAlign:"right", marginRight:"15px"}}>
                    <Notification onClick={handleNotification} src={NotificationIcon} />
                    <NotificationDropDown style={{display: isDropDownNotification ? 'flex' : 'none'}}>
                        <NotificationDropDownItem href="/profile">
                            <NotificationBar userid={userdata.userId}/>
                        </NotificationDropDownItem>
                    </NotificationDropDown>
                </div>
                <div onClick={handleProfile} style={{display:"flex", cursor:"pointer", width:"40%", position: 'relative', textAlign:"center", alignItems:"center"}}>
                    <ProfilePhoto src={userdata.profilePicture} />
                    <h2 style={{color:"white"}}>{userdata.name}</h2>
                    <ProfileDropDown style={{display: isDropDownProfile ? 'flex' : 'none'}}>
                        <ProfileDropDownItem href="/profile">Profile</ProfileDropDownItem>
                        <ProfileDropDownItem href="/settings">Settings</ProfileDropDownItem>
                        <ProfileDropDownItem>Log Out</ProfileDropDownItem>
                    </ProfileDropDown>
                </div>
            </Navbar>
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
                    <Leaderboard title="Leaderboard - All Time" data={[
                        { userId: 1, userName: 'mkarakul', rank: 500 },
                        { userId: 2, userName: 'spalta', rank: 500 },
                        { userId: 3, userName: 'rbozdemi', rank: 500 },]}/>
                    <br />
                    <Leaderboard title="Leaderboard - Weekly" data={[
                        { userId: 1, userName: 'mkarakul', rank: 500 },
                        { userId: 5, userName: 'mkoroglu', rank: 500 },
                        { userId: 4, userName: 'muyumak', rank: 500 },
                        { userId: 2, userName: 'spalta', rank: 500 },
                        { userId: 3, userName: 'rbozdemi', rank: 500 },]}/>
                </RightBar>
            </Body>
        </Container>
    )
}

export default MainPage;