import React from "react";
import Photo from '../../assets/404.png';
import styled from "styled-components";

const StyledButton = styled.button`
  border: 0px;
  font-size: 150%;
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
        <div style={{display:"flex", flexDirection:"column", width:"100%", height:"100%" ,backgroundColor:"white", textAlign:"center", alignItems:"center"}}>
            <img style={{width:"70%"}} src={Photo} alt="404" />
            <div style={{padding:"22px"}}>
              <StyledButton onClick={goBack} >Go Back</StyledButton>
            </div>
        </div>
    )
}

export default Page404;