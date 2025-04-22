import React, { useState } from "react";
import DropdownMenu, { DropDownBackdrop } from "./DropdownMenu";
import styled from "styled-components";

export const HamburgerContainer = styled.div`
  width: 12rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 2rem;
`;

export const StyledHamburgerIcon = styled.div`
  width: 2rem;
  height: 2rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  z-index: 4;

  div {
    width: 100%;
    height: 0.3rem;
    background-color: ${(props) => props.theme.colors.text};
    border-radius: 1rem;
    transition: all 0.3s linear;
    position: relative;
  }
`;

const HamburgerIcon = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <HamburgerContainer>
      <StyledHamburgerIcon onClick={toggleDropdown}>
        <div></div>
        { !isDropdownOpen && <div></div> }
        { !isDropdownOpen && <div></div> }
      </StyledHamburgerIcon>
      {isDropdownOpen &&
        <DropDownBackdrop onClick={toggleDropdown}>
          <DropdownMenu />
        </DropDownBackdrop>
      }
    </HamburgerContainer>
  );
};

export default HamburgerIcon;
