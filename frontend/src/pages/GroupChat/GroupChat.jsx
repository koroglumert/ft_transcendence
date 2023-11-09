import React from "react";
import styled from "styled-components";
import NavbarButton from "../../components/NavbarButton";

const Container = styled.div`
    padding-top: 50px;
    display: flex;
    width: 100%;
    height: 100%;
    background-color: yellow;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const FriendList = styled.div`
    width: 30%;
    min-height: 500px;
    background-color: red;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const TextDiv = styled.div`
    width: 70%;
    min-height: 500px;
    background-color: green;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const GroupChat = () => {
    return (
        <div>
        <NavbarButton />
        <Container>
            <FriendList>
                AGALAR
                <div>
                </div>
            </FriendList>
            <TextDiv>
                MESAJLAR
                <div>
                </div>
            </TextDiv>
        </Container>
        </div>
    );
}

export default GroupChat;