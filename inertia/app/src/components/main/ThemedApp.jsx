import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { styled, ThemeProvider } from "styled-components";
import { onCheckoutPage, onContactPage, onInformationPage, onLandingPage, onLoginPage, onWCPage } from "../../modules/routes";
import theme from "../../modules/theme";
import GlobalStyle from "../../styles/GlobalStyle";
import Footer from "../header/Footer";
import Header from "../header/Header";
import LandingPageHeader from "../header/LandingPageHeader";
import WCHeader from "../header/WCHeader";
import LoginHeader from "../header/LoginHeader";
import PrintModal from "./PrintModal";
import Routes from "./Routes";
import { useLocation } from "react-router-dom";

const AppContainer = styled.div`
  margin: 0;
  padding: 0;
  min-height: ${(props) => props.$shouldMinimizePageHeight ? '100%' : '100vh'};
  height: auto;
  width: 100vw;
  overflow-y: visible;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ThemedApp = () => {
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const routesWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const [headerType, setHeaderType] = useState("default");
  const [showFooter, setShowFooter] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (onLandingPage() || onInformationPage() || onContactPage()) {
      setHeaderType("landing");
    } else if (onCheckoutPage()) {
      setHeaderType("wc");
      setShowFooter(false);
    } else if (onLoginPage()) {
      setHeaderType("login");
      setShowFooter(false);
    } else if (onWCPage()) {
      setHeaderType("wc");
    } else {
      setHeaderType("default");
    }
  }, [location.pathname]);


  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <GlobalStyle />
      <AppContainer $shouldMinimizePageHeight={headerType === "wc"}>
        { headerType === "landing" && <LandingPageHeader routesWrapperRef={routesWrapperRef} titleRef={titleRef} /> }
        { headerType === "wc" && <WCHeader /> }
        { headerType === "default" && <Header /> }
        { headerType === "login" && <LoginHeader />}
        <PrintModal />
        <Routes 
          routesWrapperRef={routesWrapperRef}
          $shouldShowHeader={true}
          $shouldMinimizePageHeight={headerType === "wc"}
          titleRef={titleRef} />
        { showFooter && <Footer /> }
      </AppContainer>
    </ThemeProvider>
  );
}

export default ThemedApp;