import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Container = styled.div`
    display: flex;
    justify-content: center;
    gap: 3px;
    width: 100%;
    height: 100%;
`;

const SocialButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2%;
    border-radius: 50%;
    border: none;
    width: 50px;
    height: 50px;
    cursor: pointer;
    color: white;
    font-size: 1.5em;
    font-weight: bold;
    background-color: ${(props) => props.backgroundColor};
    transition: background-color 0.3s;
    &:hover {
        background-color: ${(props) => props.hoverColor};
    }
`;

const socialMediaColors = {
    instagram: "#E4405F",
    github: "#333",
    linkedin: "#0077B5",
};

const SocialBar = () => {
    return (
        <Container>
            <SocialButton backgroundColor={socialMediaColors.instagram} hoverColor="#ff69b4">
                <FontAwesomeIcon icon={faInstagram} />
            </SocialButton>
            <SocialButton backgroundColor={socialMediaColors.github} hoverColor="#6e6e6e">
                <FontAwesomeIcon icon={faGithub} />
            </SocialButton>
            <SocialButton backgroundColor={socialMediaColors.linkedin} hoverColor="#005c9e">
                <FontAwesomeIcon icon={faLinkedin} />
            </SocialButton>
        </Container>
    );
};

export default SocialBar;
