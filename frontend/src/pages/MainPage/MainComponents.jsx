import styled from "styled-components";

export const Container = styled.div`
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
    align-items: center;
`;

export const Logo = styled.img`
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
    width: 100%;
    padding: 20px;
`;

export const RightBar = styled.div`
    padding-left: 20px;
    padding-right: 20px;
    width: 40%;
    margin-right: 20px;
`;

export const NewsDiv = styled.div`
    background-color: red;
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
`;

export const Banner = styled.img`
    width: 100%;
    border-radius: 3%;
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
    top: 100%;
    position: absolute;
    left: 0;
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
        background-color: #0f0;
        border-radius: 10px;
        color: black;
    }
    `;