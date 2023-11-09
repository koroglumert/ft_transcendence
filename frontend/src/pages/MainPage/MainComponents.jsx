import styled from "styled-components";

export const Container = styled.div`
    background-color: #0f0;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

export const Navbar = styled.div`
    padding: 4px;
    gap: 5px;
    background-color: black;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Body = styled.div`
    display: flex;
    justify-content: space-between;
    justify-items: center;
    align-items: center;
`;

export const Logo = styled.img`
    cursor: pointer;
    width: 150px;
    height: 50px;
`;

export const ProfilePhoto = styled.img`
    margin-right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: red;
    cursor: pointer;
    object-fit: cover;
`;

export const LeftBar = styled.div`
    width: 70%;
`;

export const RightBar = styled.div`
    margin-bottom: 24%;
    margin-right: 6%;
    justify-content: center;
    align-items: center;
    justify-items: center;
    
`;

export const NewsDiv = styled.div`
    background-color: #444;
    color: white;
    padding: 4%;
    border-radius: 4px;
    margin: 2%;
`;

export const Banner = styled.img`
    width: 100%;
`;

export const Notification = styled.img`
    width: 18%;
    height: 18%;
    cursor: pointer;
`;

export const ProfileDropDown = styled.div`
    top: 99%;
    position: absolute;
    left: 0;
    flex-direction: column;
    background-color: black;
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
    background-color: black;
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