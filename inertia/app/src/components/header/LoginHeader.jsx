import React from "react";
import { useNavigate } from "react-router-dom";
import { SpinningSunSmall } from "../standalone/SpinningSunSmall";
import { HeaderTitle, StyledHeader } from "../../styles/Header";
import { SunContainer } from "../../styles/LandingPageHeader";

const LoginHeader = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <SunContainer className="visible" onClick={() => navigate("/")}>
        <SpinningSunSmall />
        <HeaderTitle>HELIOS PRESS</HeaderTitle>
      </SunContainer>
    </StyledHeader>
  );
};

export default LoginHeader;
