import React from "react";
import styled from "styled-components";
import Footer from "../../components/Footer";
import User1 from "../../assets/pixel-art-1.png";
import User2 from "../../assets/pixel-art-2.png";
import User3 from "../../assets/pixel-art-3.png";
import User4 from "../../assets/pixel-art-4.png";
import User5 from "../../assets/pixel-art-5.png";
import SocialBar from "../../components/SocialBar";

const Container = styled.div`
    width: 100%;
    height: 100%;
    background-color: #3a7563;
`;

const UserContainer = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #59a985;
`
const RightDiv = styled.div`
    width: 100%;
    height: 100%;
    background-color: #3a7563;
    justify-content: center;
    text-align: center;
`;

const LeftDiv = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    justify-content: center;
    background-color: #3a7563;
`;

const ProfilePicture = styled.img`
    margin-top: 5%;
    width: 10%;
    height: 10%;
`;

const ProfileUsername = styled.h1`
    color: white;
    width: 100%;
    height: 100%;
`;

const ProfileParagraph = styled.p`
    color: white;
    padding: 3% 5% 7%;
    width: 100%;
    height: 100%;
`;

const BioPage = () => {
    return (
        <Container>
            <UserContainer>
                <LeftDiv>
                </LeftDiv>
                <RightDiv>
                    <ProfilePicture src={User2}/>
                    <ProfileUsername>Mustafa Karakulak</ProfileUsername>
                    <SocialBar />
                    <ProfileParagraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ProfileParagraph>
                </RightDiv>
            </UserContainer>
            <UserContainer>
                <LeftDiv>
                <ProfilePicture src={User3}/>
                    <ProfileUsername>Şerif Ali Palta</ProfileUsername>
                    <SocialBar />
                    <ProfileParagraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ProfileParagraph>
                </LeftDiv>
                <RightDiv>
                </RightDiv>
            </UserContainer>
            <UserContainer>
                <LeftDiv>
                </LeftDiv>
                <RightDiv>
                    <ProfilePicture src={User1}/>
                    <ProfileUsername>Mustafa Melih Yumak</ProfileUsername>
                    <SocialBar />
                    <ProfileParagraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ProfileParagraph>
                </RightDiv>
            </UserContainer>
            <UserContainer>
                <LeftDiv>
                    <ProfilePicture src={User4}/>
                    <ProfileUsername>Resul Bozdemir</ProfileUsername>
                    <SocialBar />
                    <ProfileParagraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ProfileParagraph>
                </LeftDiv>
                <RightDiv>
                </RightDiv>
            </UserContainer>
            <UserContainer>
                <LeftDiv>
                </LeftDiv>
                <RightDiv>
                    <ProfilePicture src={User5}/>
                    <ProfileUsername>Mert İsmail Köroğlu</ProfileUsername>
                    <SocialBar />
                    <ProfileParagraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</ProfileParagraph>
                </RightDiv>
            </UserContainer>
            <Footer />
        </Container>
    );
};

export default BioPage;