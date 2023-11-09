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

const Footer = () => {
    return (
        <FooterDiv>
            <img src={Crew} alt="Crew" style={{ width: "10%", height: "10%", objectFit: "cover" }} />
            <FooterText>©2023 Fin-Pong | Created by FintecFellow Students</FooterText>
        </FooterDiv>
    );
}

export default Footer;