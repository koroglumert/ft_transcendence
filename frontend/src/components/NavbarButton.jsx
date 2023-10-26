import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const StyledButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  background-color: transparent;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px;
`;

const StyledButton = styled.button`
  border: 0px;
  width: 100%;
  font-size: 25px;
  height: 100%;
  background-color: black;
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
  }

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownProfile, setDropdownProfile] = useState(false);

  const handleProfileEnter = () => {
    setDropdownProfile(!isDropdownProfile);
  };

  const handleSocialEnter = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <StyledButtonContainer>
      <StyledButton onClick={() => handleClick("/GamePage")}>Play</StyledButton>
      <StyledButton onClick={() => handleClick("/chat")}>Chat</StyledButton>
      <StyledButtonContainer onMouseEnter={handleSocialEnter} onMouseLeave={handleSocialEnter}>
        <StyledButton onClick={() => handleClick("/social")} >Social</StyledButton>
        <StyledDropdown style={{ display: isDropdownOpen ? 'flex' : 'none' }}>
          <StyledDropdownItem> Friends </StyledDropdownItem>
          <StyledDropdownItem> Blocked </StyledDropdownItem>
        </StyledDropdown>
      </StyledButtonContainer>
      <StyledButtonContainer onMouseEnter={handleProfileEnter} onMouseLeave={handleProfileEnter}>
      </StyledButtonContainer>
    </StyledButtonContainer>
  );
};
export default NavbarButton;
