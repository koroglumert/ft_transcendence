import styled from "styled-components";

export const Container = styled.div`
    background: linear-gradient(#0f0, #3a4750);
    width: 100%;
    height: 100vh;
`;

export const Navbar = styled.div`
    background: linear-gradient(#222, #444);
    padding: 4px;
    gap: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Body = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 3%;
    padding: 1%;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px;
        gap: 1vh;
    }
`;

export const Logo = styled.img`
    cursor: pointer;
    width: 250px;
    height: 24px;
    @media (max-width: 768px) {
        width: 150px;
        height: 24px;
    }
    @media (max-width: 576px) {
        width: 100px;
        height: 24px;
    }
    @media (max-width: 375px) {
        width: 50px;
        height: 24px;
    }
`;

export const ProfilePhoto = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: red;
    cursor: pointer;
    object-fit: cover;
    @media (max-width: 768px) {
        width: 30px;
        height: 30px;
    }
    @media (max-width: 576px) {
        width: 20px;
        height: 20px;
    }
    @media (max-width: 375px) {
        width: 20px;
        height: 20px;
    }
`;

export const LeftBar = styled.div`
    width: 100%;
`;

export const RightBar = styled.div`
    width: 60%;
`;

export const NewsDiv = styled.div`
    color: white;
    padding: 4%;
    background: linear-gradient(#3a4750, #303841);
    border-radius: 12px;
    perspective: 900px;
    box-shadow: 0 7px 20px #242424;
`;

export const Banner = styled.img`
    width: 100%;
`;

export const Notification = styled.img`
    width: 18%;
    height: 18%;
    cursor: pointer;
`;

export const Header1 = styled.h1`
    font-size: 40px;
    font-weight: bold;
    color: white;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 20px;
    }
    @media (max-width: 576px) {
        font-size: 15px;
    }
`;

export const Header2 = styled.h1`
    font-size: 20px;
    font-weight: bold;
    color: white;
    text-align: center;
    @media (max-width: 768px) {
        font-size: 20px;
    }
    @media (max-width: 576px) {
        font-size: 15px;
    }
    @media (max-width: 375px) {
        font-size: 10px;
    }
`;

export const ProfileDropDown = styled.div`
    top: 99%;
    position: absolute;
    left: 0;
    flex-direction: column;
    background: linear-gradient(#222, #444);
    border: 1px solid gray;
    border-radius: 10px;
    width: 100%;
    z-index: 1;
`;

export const ProfileDropDownItem = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
    color: #fff;
    cursor: pointer;
    &:hover {
        background-color: #0f0;
        border-radius: 10px;
        color: black;
    }
`;

export const NotificationDropDown = styled.div`
    position: absolute;
    flex-direction: column;
    background: linear-gradient(#222, #444);
    border: 1px solid gray;
    border-radius: 10px;
    width: 100%;
    z-index: 1;
`;

export const NotificationDropDownItem = styled.div`
    width: 100%;
    height: 100%;
    padding: 10px;
    color: #fff;
    cursor: pointer;
    
    &:hover {
        border-radius: 10px;
        color: black;
    }
`;