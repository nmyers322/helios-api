import React from "react";
import { useNavigate } from "react-router-dom";
import { SpinningSunSmall } from "../standalone/SpinningSunSmall";
import { HeaderTitle, StyledHeader } from "../../styles/Header";
import HamburgerIcon from "./HamburgerIcon";
import { SunContainer } from "../../styles/LandingPageHeader";

const Header = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <SunContainer className="visible" onClick={() => navigate("/")}>
        <SpinningSunSmall />
        <HeaderTitle>HELIOS PRESS</HeaderTitle>
      </SunContainer>
      <HamburgerIcon />
    </StyledHeader>
  );
};

export default Header;
