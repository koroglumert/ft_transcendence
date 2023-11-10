import React, { useState, useEffect } from "react";
import LogoP from '../assets/logo-v.png';
import NavbarButton from "./NavbarButton";
import SearchBar from "./SearchBar";
import NotificationIcon from '../assets/notification-icon.png';
import { Navbar, Notification, ProfilePhoto, Logo, ProfileDropDown, ProfileDropDownItem, NotificationDropDown, NotificationDropDownItem, Header2 } from "../pages/MainPage/MainComponents";
import NotificationBar from "./Notification";
import axios from "axios";
import Cookies from 'universal-cookie';
import { FRONT_URL, BACK_URL } from "../env";
import "./seting.css";
import NewCard from "./ProfileCard/NewCard";
import { useNavigate } from 'react-router-dom';

const NavbarMenu = () => {
    const [isDropDownProfile, setDropdownOpen] = useState(false);
    const [isDropDownNotification, setDropdownNot] = useState(false);
    const [isDropDownSearch, setDropdownSearch] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const [isSettingsPopupOpen, setSettingsPopupOpen] = useState(false); // Yeni eklenen durum değişkeni
    const [myUser, setMyUser] = useState([]);
    const cookies = new Cookies();
    const userdata = cookies.get('data');
    const navigate = useNavigate();

    const handleOutsideClick = (e) => {
        if (e.target.closest('.handle')) {
          return;
        }
        setSettingsPopupOpen(false);
    };

    const handleMainPage = () => {
        window.location.href = `${FRONT_URL}/MainPage`;
    }

    const handleNotification = () => {
        setDropdownNot(!isDropDownNotification);
    }

    const handleProfile = () => {
        setDropdownOpen(!isDropDownProfile);
    }

    const handleSearch = () => {
        setDropdownSearch(!isDropDownSearch);
    }

    const handleLogOut = () => {
        cookies.remove('data');
        window.location.href = `${FRONT_URL}`;
    }

    const handleProfilePage = () => {
        navigate(`/profile/${myUser.name}`);
    }

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

    // "Settings" butonuna tıklandığında pop-up penceresini açan fonksiyon
    const handleSettings = () => {
        setSettingsPopupOpen(true);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`${BACK_URL}/api/notification/listSearch`, { userIdOne: userdata.userId }, { withCredentials: true });
                setSearchList(res.data.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData([]);
    }, []);

    if (userdata === undefined) {
        window.location.href = `${FRONT_URL}/LoginPage`;
        return null;
    }

    return (
        <Navbar>
            <Logo src={LogoP} onClick={handleMainPage} />
            <div onClick={handleSearch} style={{ width: "60%", position: 'relative', padding: "0px", textAlign: "center", alignItems: "center"}}>
                <SearchBar alluser={searchList} useridOne={userdata.userId} />
            </div>
            <div style={{ width: "100%", padding: "12px" }}>
                <NavbarButton />
            </div>
            <div style={{ width: "50%", position: 'relative', textAlign: "right", marginRight: "15px" }}>
                <Notification onClick={handleNotification} src={NotificationIcon} />
                <NotificationDropDown style={{ display: isDropDownNotification ? 'flex' : 'none' }}>
                    <NotificationDropDownItem href="/profile">
                        <NotificationBar userid={userdata.userId} />
                    </NotificationDropDownItem>
                </NotificationDropDown>
            </div>
            <div onClick={handleProfile} style={{ display: "flex", cursor: "pointer", width: "40%", position: 'relative', textAlign: "center", alignItems: "center"}}>
                <ProfilePhoto src={myUser.profilePicture} style={{marginRight:"10px"}}/>
                <Header2>{myUser.name}</Header2>
                <ProfileDropDown style={{ display: isDropDownProfile ? 'flex' : 'none' }}>
                    <ProfileDropDownItem onClick={handleProfilePage}>Profile</ProfileDropDownItem>
                    <ProfileDropDownItem onClick={handleSettings}>Settings</ProfileDropDownItem>
                    <ProfileDropDownItem onClick={handleLogOut} >Log Out</ProfileDropDownItem>
                </ProfileDropDown>
            </div>

            {isSettingsPopupOpen && (
            <div className="settings-popup" onClick={handleOutsideClick}>
                <div className="handle">
                    <NewCard  user={myUser} />
                </div>
            </div>
            )}
        </Navbar>
    );
};

export default NavbarMenu;
