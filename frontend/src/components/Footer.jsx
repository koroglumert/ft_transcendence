import React from "react";
import styled from "styled-components";

const FooterDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 50px 0px 0px 0px;
    background-color: transparent;
`;

const FooterText = styled.h1`
    font-size: 13px;
    font-weight: 900;
    color: gray;
`;

const Footer = () => {
    return (
        <FooterDiv>
            <FooterText>©2023 Fin-Pong | Created by FintecFellow Students</FooterText>
        </FooterDiv>
    );
}

export default Footer;