import React from "react";
import Photo from '../../assets/404.png';
import styled from "styled-components";

const StyledButton = styled.button`
  border: 0px;
  font-size: 35px;
  padding: 20px;
  background-color: black;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    background-color: #0f0;
    color: black;
  }
`;

function Page404() {
    const goBack = () => {
        window.location.href = "/";
    }

    return (
        <div style={{gap:"20px", display:"flex", flexDirection:"column", width:"100%", height:"100%" ,backgroundColor:"red", textAlign:"center", alignItems:"center"}}>
            <img style={{width:"50%", height:"50%"}} src={Photo} alt="404" />
            <StyledButton onClick={goBack} >Go Back</StyledButton>
        </div>
    )
}

export default Page404;