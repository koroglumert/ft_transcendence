import React from 'react'
import styled from 'styled-components'
import { BACK_URL } from './../env';

const StyledButton = styled.button`
  position: relative;
  padding: 10px 10px;
  margin-left: 22%;
  color: white;
  margin-bottom: 50px;
  font-size: 20px;
  background: black;
  font-weight: bold;
  border: 2px solid rgba(0, 200, 0, 0.5);
  border-radius: 4px;
  text-shadow: 0 0 15px var(--color);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  transition: 0.5s;
  z-index: 1;

  &:hover {
    color: black;
    font-weight: bold;
    border: 2px solid rgba(0, 0, 0, 0);
    box-shadow: 0 0 0px var(--color);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--color);
    z-index: -1;
    transform: scale(0);
    transition: 0.2s;
  }

  &:hover::before {
    transform: scale(1);
    transition-delay: 0.2s;
    box-shadow: 0 0 10px var(--color),
      0 0 30px var(--color),
      0 0 60px var(--color);
  }

  span {
    position: absolute;
    background: var(--color);
    pointer-events: none;
    border-radius: 2px;
    box-shadow: 0 0 10px var(--color),
      0 0 20px var(--color),
      0 0 30px var(--color),
      0 0 50px var(--color),
      0 0 100px var(--color);
    transition: 0.5s ease-in-out;
    transition-delay: 0.1s;
  }

  &:hover span {
    opacity: 0;
    transition-delay: 0s;
  }

  span:nth-child(1),
  span:nth-child(3) {
    width: 40px;
    height: 4px;
  }

  &:hover span:nth-child(1),
  &:hover span:nth-child(3) {
    transform: translateX(0);
  }

  span:nth-child(2),
  span:nth-child(4) {
    width: 4px;
    height: 40px;
  }

  &:hover span:nth-child(1),
  &:hover span:nth-child(3) {
    transform: translateY(0);
  }

  span:nth-child(1) {
    top: calc(50% - 2px);
    left: -50px;
    transform-origin: left;
  }

  &:hover span:nth-child(1) {
    left: 50%;
  }

  span:nth-child(3) {
    top: calc(50% - 2px);
    right: -50px;
    transform-origin: right;
  }

  &:hover span:nth-child(3) {
    right: 50%;
  }

  span:nth-child(2) {
    left: calc(50% - 2px);
    top: -50px;
    transform-origin: top;
  }

  &:hover span:nth-child(2) {
    top: 50%;
  }

  span:nth-child(4) {
    left: calc(50% - 2px);
    bottom: -50px;
    transform-origin: bottom;
  }

  &:hover span:nth-child(4) {
    bottom: 50%;
  }
`;

function AuthorizeButton() {

  const handleAuthorize = () => {
    const authorizeUrl = `${BACK_URL}/api/42api/auth`;
    window.location.href = authorizeUrl;
  };

  return (
    <StyledButton onClick={handleAuthorize} style={{ '--color': '#6eff3e' }}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      Authorize Intra
    </StyledButton>
  )
}

export default AuthorizeButton