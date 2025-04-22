import React from "react";
import { SpinningSunSmall } from "../standalone/SpinningSunSmall";
import { HeaderTitle, StyledWCHeader } from "../../styles/Header";
import HamburgerIcon from "./HamburgerIcon";
import { SunContainer } from "../../styles/LandingPageHeader";
import { useNavigate } from "react-router-dom";
import { useGoTo } from "../../modules/links";
import { onOrderReceivedPage } from "../../modules/routes";

const WCHeader = () => {
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);

  return (
    <StyledWCHeader>
      <SunContainer className="visible" onClick={() => {
        if (onOrderReceivedPage()) {
          goTo("/");
        }
      }}>
        <SpinningSunSmall />
        <HeaderTitle>HELIOS PRESS</HeaderTitle>
      </SunContainer>
      <HamburgerIcon />
    </StyledWCHeader>
  );
};

export default WCHeader;
