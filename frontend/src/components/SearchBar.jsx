import React from "react";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import DefaultProfile from '../assets/default-profile-photo.png';
import FriendsButton from "./FriendsButton";

const Form = styled.form`
    align-items: center;
    width: 100%;
    postion: absolute;
    padding: 2%;
    display: flex;
    background-color: white;
    outline: none;
    @media (max-width: 768px) {
        width: 14vh;
    }
`;

const Input = styled.input`
    background-color: transparent;
    font-size: 1.2rem;
    margin-left: 4%;
    color: black;
    outline: none;
    border: none;
`;

const SearchDropDown = styled.div`
    top: 100%;
    position: absolute;
    left: 0;
    flex-direction: column;
    background-color: black;
    perspective: 900px;
    box-shadow: 0 7px 20px #242424;
    border-radius: 10px;
    width: 100%;
    z-index: 1;
`;

const ProfileImage = styled.img`
    cursor: pointer;
    width: 60px;
    height: 60px;
    owerflow: hidden;
    border-radius: 50%;
    object-fit: cover;
`;

const ListDiv = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    background-color: black;
`;

const ListItem = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 50px 0px 0px;
    justify-content: space-between;
    border: 0.1px solid white;
    background-color: black;
`;

const ListItemLink = styled.a`
    width: 100%;
    color: white;
    display: flex;
    padding: 6%;
    font-size: 1.2rem;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    align-items: center;
`;

const SearchBar = ({ useridOne, alluser }) => {
    const [searchVal, setSearchVal] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const handleInputChange = (e) => {
        setSearchVal(e.target.value);
    };
    
    useEffect(() => {
        if (alluser) { // alluser tanımlı ise işlem yap
          setFilteredUsers(
            alluser?.filter((user) => {
              return user.name?.includes(searchVal);
            })
            );
            }
        }, [searchVal, alluser]);      

        return (
            <Form role="search" value={searchVal} onChange={handleInputChange}>
            <img
                style={{ width: "8%", height: "8%", cursor: "pointer" }}
                alt="filter"
                src="https://img.icons8.com/ios-filled/50/000000/search--v1.png"
            />
            <Input type="text" id="header-search" placeholder="Search Players" />
            <SearchDropDown style={{ display: searchVal ? 'flex' : 'none' }}>
                <ListDiv>
                    <ul>
                        {filteredUsers.map((user) =>
                            searchVal ? (
                                <ListItem key={user.userId}>
                                    <div style={{width:"30%"}}>
                                    <ProfileImage
                                        src={user.profilePicture || { DefaultProfile }}
                                        alt="Profile Image"
                                    />
                                    </div>
                                    <div style={{width:"30%"}}>
                                    <ListItemLink>{user.name}</ListItemLink>
                                    </div>
                                    <div style={{width:"40%"}}>
                                        <FriendsButton useridOne={useridOne} useridTwo={user.userId} />
                                    </div>
                                </ListItem>
                            ) : null
                        )}
                    </ul>
                </ListDiv>
            </SearchDropDown>
        </Form>
    );
};

export default SearchBar;
