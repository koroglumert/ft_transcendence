import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {FaGamepad} from 'react-icons/fa';
import {FaUserFriends} from 'react-icons/fa';
import {FaRocketchat} from 'react-icons/fa';


const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: transparent;
  width: 100%;
  height: 10%;
  align-items: center;
  justify-content: space-around;
`;

const StyledButton = styled.button`
  border: 0px;
  width: 100%;
  font-size: 45px;
  height: 100%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    background-color: #0f0;
    color: black;
  }
  @media (max-width: 768px) {
    font-size: 30px;
  }
  @media (max-width: 425px) {
    font-size: 20px;
  }
  @media (max-width: 375px) {
    font-size: 15px;
  }
`;

export const StyledDropdown = styled.div`
  position: absolute;
  flex-direction: column;
  background-color: black;
  border: 1px solid gray;
  border-radius: 10px;
  width: 100%;
  z-index: 1;
  position: absolute;
  top: 100%;
  left: 0;
`;

export const StyledDropdownItem = styled.div`
  width: 100%;
  padding: 20px;
  color: #fff;
  cursor: pointer;
  &:hover {
    background-color: #0f0;
    border-radius: 10px;
    color: black;
  }
`;

const NavbarButton = () => {
  const navigate = useNavigate();

  const handleClick = (address) => {
    navigate(address);
  };

  return (
    <StyledButtonContainer>
      <StyledButton onClick={() => handleClick("/GamePage")}> <FaGamepad/> </StyledButton>
      <StyledButton onClick={() => handleClick("/chat")}> <FaRocketchat/> </StyledButton>
      <StyledButton onClick={() => handleClick("/social")}> <FaUserFriends/> </StyledButton>
    </StyledButtonContainer>
  );
};
export default NavbarButton;
