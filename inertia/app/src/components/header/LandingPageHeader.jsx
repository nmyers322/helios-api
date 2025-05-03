import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveLocalTheme, toggleTheme } from '../../actions/metaActions';
import { useGoTo } from '../../modules/links';
import { validateAlbumDetailsCard } from '../../modules/orderFormValidation';
import { onLandingPage } from '../../modules/routes';
import { HeaderButtonContainer, HeaderContainerLarge, HeaderContainerSmall, HeaderLink } from '../../styles/LandingPageHeader';
import Button from '../form/main/Button';
import BetaFeaturesLink from './BetaFeaturesLink';
import HamburgerIcon from './HamburgerIcon';
import MiniDropDown from './MiniDropDown';

const LandingPageHeader = ({
    routesWrapperRef,
    titleRef
}) => {
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.meta.theme);
  const customer = useSelector((state) => state.customer);
  const orderForm = useSelector((state) => state.orderForm);
  const [isAccountDropDownOpen, setIsAccountDropDownOpen] = useState(false);

  const scrollToAbout = () => {
    const aboutElement = document.querySelector('#about');
    if (aboutElement) {
      window.scrollTo({ top: aboutElement.offsetTop, behavior: 'smooth' });
    }
  }

  const toggleAccountDropDown = () => {
    setIsAccountDropDownOpen(!isAccountDropDownOpen);
  }

  const toggleThemeLocal = () => {
    dispatch(toggleTheme());
    dispatch(saveLocalTheme(currentTheme === "light" ? "dark" : "light"));
  }
  
  return (
    <>
      <HeaderContainerLarge>
        <HeaderButtonContainer>
          <Button 
            buttonText={validateAlbumDetailsCard(orderForm).isValid ? "CONTINUE ORDER" : "START PRESSING"} 
            onClick={() => goTo('/order')}
            styles={{marginTop: "0"}} />
        </HeaderButtonContainer>
        <HeaderLink onClick={() => {
          if (!onLandingPage()) {
            goTo("/");
          }
          scrollToAbout();
        }}>About</HeaderLink>
        <HeaderLink onClick={() => goTo('/contact-us')}>Contact Us</HeaderLink>
        <HeaderLink onClick={() => goTo('/templates')}>Templates</HeaderLink>
        <HeaderLink onClick={() => goTo('/mastering')}>Mastering</HeaderLink>
        { customer.hasActiveToken
          ? <HeaderLink onClick={() => toggleAccountDropDown()}>
              Account
              <MiniDropDown closer={toggleAccountDropDown} open={isAccountDropDownOpen}>
                <HeaderLink onClick={() => toggleThemeLocal()}>Toggle Theme</HeaderLink>
                <BetaFeaturesLink LinkClass={HeaderLink} />
                <HeaderLink onClick={() => goTo('/logout')}>Logout</HeaderLink>
              </MiniDropDown>
            </HeaderLink>
          : <HeaderLink onClick={() => goTo('/login')}>Log In</HeaderLink>
        }
      </HeaderContainerLarge>
      <HeaderContainerSmall>
        <HeaderButtonContainer>
          <Button 
            buttonText={validateAlbumDetailsCard(orderForm).isValid ? "CONTINUE ORDER" : "START PRESSING"}
            onClick={() => goTo('/order')}
            styles={{marginTop: "0"}} />
        </HeaderButtonContainer>
        <HamburgerIcon />
      </HeaderContainerSmall>
    </>
  );
};

export default LandingPageHeader;