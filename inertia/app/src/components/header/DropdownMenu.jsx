import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { saveLocalTheme, setPrintContent, setShowPrintModal, toggleTheme } from "../../actions/metaActions";
import { hardLoad, useGoTo } from "../../modules/links";
import { isOrderInProgress } from "../../modules/orderFormValidation";
import { onAnyOrderPage, onCheckoutPage } from "../../modules/routes";
import BetaFeaturesLink from "./BetaFeaturesLink";

export const DropDownBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

const StyledDropdownMenu = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 35rem;
  height: calc(100vh - var(--header-height));
  background-color: ${(props) => props.theme.colors.modalBackground};
  box-shadow: -2rem 0 5rem rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.5s ease-in-out;
  z-index: 3;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 6rem 100%);
  padding-top: var(--header-height);
  padding-left: 5rem;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 40rem) {
    width: 25rem;
  }
`;

export const StyledLink = styled.a`
  cursor: pointer;
  display: block;
  padding: 1rem;
  font-size: 1.5rem;
  color: ${(props) => props.$highlight ? props.theme.colors.invertedText : props.theme.colors.text} !important;
  text-decoration: none;
  transition: all 0.3s linear;
  text-align: left;
  background-color: ${(props) => props.$highlight ? props.theme.colors.primary : "transparent"};
  user-select: none;

  &:hover {
    color: ${(props) => props.theme.colors.text} !important;
    background-color: ${(props) => props.theme.colors.secondary};
  }

  @media (max-width: 40rem) {
    font-size: 1.25rem;
  }
`;

export const StyledSubLink = styled.a`
  display: block;
  padding: 0.5rem;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  transition: all 0.3s linear;
  text-align: left;
  cursor: pointer;
  user-select: none;

  &:hover {
    background-color: ${(props) => props.theme.colors.cardBackground};
  }
`;

const DropdownMenu = () => {
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customer);
  const orderForm = useSelector((state) => state.orderForm);
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);

  const generateOrderLinkText = () => {
    if (onCheckoutPage()) {
      return "Back to Order Options";
    } else if (isOrderInProgress(orderForm)) {
      return "Continue Order";
    } else {
      return "Start New Order";
    }
  }
  
  const calculateIndent = (position) => {
    return `${(position*0.5) + 1.5}rem`;
  }

  const links = [];

  if (!onAnyOrderPage()) {
    links.push({ text: generateOrderLinkText(), href: "/order", highlight: "true" });
  }

  links.push({ text: "Home / About", href: "/" });

  if (customer?.role === "admin") {
    links.push({ text: "Admin", href: "/admin" });
  }

  links.push({ text: "Contact Us", href: "/contact-us" });

  links.push({ text: "Download Templates", href: "/templates" });

  links.push({ text: "Mastering", href: "/mastering" });

  if (customer.hasActiveToken) {
    links.push({ text: "Logout", href: "/logout" });
  } else {
    links.push({ text: "Login / Register", href: "/login" });
  }

  return (
    <StyledDropdownMenu>
      {links.map((link, index) => (
        <StyledLink 
          key={index} 
          $highlight={link.highlight} 
          onClick={() => {
            if (link.hardLink) {
              hardLoad(link.hardLink);
            } else {
              goTo(link.href);
            }
          }}
          style={{marginLeft: calculateIndent(index)}}>
          {link.text}
        </StyledLink>
      ))}
      <div style={{
        marginTop: "4rem"
      }}>
        { (onAnyOrderPage() || onCheckoutPage()) && 
          <StyledSubLink
            onClick={() => {
              dispatch(setPrintContent("orderSummary"));
              dispatch(setShowPrintModal(true));
            }}
            style={{marginLeft: "4rem"}}>
            Print Order Summary
          </StyledSubLink>
        }
        <StyledSubLink 
          onClick={() => {
            dispatch(toggleTheme());
            dispatch(saveLocalTheme(currentTheme === "light" ? "dark" : "light"));
          }}
          style={{marginLeft: "4.5rem"}}>
          Change to 
          { currentTheme === "light" && " Dark " }
          { currentTheme === "dark" && " Light " }
          Theme
        </StyledSubLink>
        <BetaFeaturesLink styles={{marginLeft: "5rem"}} />
        <StyledSubLink 
          onClick={() => {
            goTo("/terms")
          }}
          style={{marginLeft: "5.5rem", marginTop: "3rem"}}>
            Terms of Service
        </StyledSubLink>
        <StyledSubLink
          onClick={() => {
            goTo("/privacy")
          }}
          style={{marginLeft: "6.0rem"}}>
            Privacy Policy
        </StyledSubLink>
        <StyledSubLink
          onClick={() => {
            goTo("/returns")
          }}
          style={{marginLeft: "6.5rem"}}>
            Refund Policy
        </StyledSubLink>
        <StyledSubLink
          onClick={() => {
            goTo("/thanks")
          }}
          style={{marginLeft: "7.0rem"}}>
            Contributors
        </StyledSubLink>
      </div>
    </StyledDropdownMenu>
  );
};

export default DropdownMenu;
