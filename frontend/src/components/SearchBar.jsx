import React from "react";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import DefaultProfile from '../assets/default-profile-photo.png';
import FriendsButton from "./FriendsButton";

const Form = styled.form`
    align-items: center;
    width: 100%;
    border: 2px solid #0f0;
    padding: 0.5rem 1rem;
    display: flex;
    background-color: white;
    
    &:focus-within {
        outline: auto;
    }
`;

const Input = styled.input`
    background-color: transparent;
    font-size: 1.2rem;
    padding: 2px;
    margin-left: 4%;
    width: 100%;
    color: black;
    &:focus {
        outline: none;
    }
`;

const SearchDropDown = styled.div`
    top: 99%;
    position: absolute;
    left: 0;
    flex-direction: column;
    background-color: black;
    border: 1px solid gray;
    border-radius: 10px;
    width: 100%;
    z-index: 1;
`;

const ProfileImage = styled.img`
    cursor: pointer;
    width: 150px;
    height: 150px;
    owerflow: hidden;
    border-radius: 15%;
    color: black;
    object-fit: cover;
`;

const ListDiv = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
    background-color: black;
`;

const ListItem = styled.div`
    display: flex;
    align-items: center;
    font-size: 35px;
    line-height: 1.5rem;
    background-color: black;

    &:hover {
        background-color: rgb(22, 161, 22);
        transition: background-color 200ms ease-in;
    }
`;

const ListItemLink = styled.a`
    width: 100%;
    height: 100%;
    display: flex;
    font-size: 22px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: white;
    text-decoration: none;
`;

const SearchBar = ({ useridOne, alluser }) => {
    const [searchVal, setSearchVal] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleInputChange = (e) => {
        setSearchVal(e.target.value);
    };

    useEffect(() => {
        setFilteredUsers(
            alluser.filter((user) => { // alldata'daki kullanıcıları filtreleyin
            return user.name?.includes(searchVal); // Kullanıcının adını arayın
            })
        );
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
                                    <ProfileImage
                                        style={{ width: "25%", height: "40%" }}
                                        src={user.profilePicture || { DefaultProfile }}
                                        alt="Profile Image"
                                    />
                                    <ListItemLink href="#">{user.name}</ListItemLink>
                                    <FriendsButton useridOne={useridOne} useridTwo={user.userId} />
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
