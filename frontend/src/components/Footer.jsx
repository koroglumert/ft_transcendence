import React from "react";
import styled from "styled-components";
import Crew from "../assets/pixel-art-crew.png";

const FooterDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1%;
    background-color: transparent;
`;

const FooterText = styled.h1`
    font-size: 13px;
    font-weight: 900;
    color: white;
`;

const FooterLink = styled.a`
    font-size: 13px;
    font-weight: 900;
    color: #00FF00;
    text-decoration: none;
    &:hover {
        color: black;
        text-decoration: underline;
    }
`;

const handleBioClick = () => {
    window.location.href = "http://localhost:3000/bio";
}

const Footer = () => {
    return (
        <FooterDiv>
            <img onClick={ handleBioClick } src={Crew} alt="Crew" style={{ width: "10%", height: "10%", objectFit: "cover", cursor:"pointer" }} />
            <FooterText>©2023 Fin-Pong | Created by <FooterLink href="http://localhost:3000/bio">FintechFellow Students</FooterLink></FooterText>
        </FooterDiv>
    );
}

export default Footer;