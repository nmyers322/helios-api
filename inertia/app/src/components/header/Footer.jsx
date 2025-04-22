import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useGoTo } from "../../modules/links";

const StyledFooter = styled.footer`
    background-color: ${props => props.theme.colors.footerBackground};
    color: ${props => props.theme.colors.text};
    padding: 1rem;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
    text-transform: uppercase;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    height: 100%;
    box-sizing: border-box;
    z-index: 2;
`;

const FooterLink = styled.div`
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
`;

const Footer = () => {
    const navigate = useNavigate();
    const goTo = useGoTo(navigate);

    return (
        <StyledFooter>
            <FooterLink onClick={() => goTo("/thanks")}>Contributors</FooterLink>
            <FooterLink onClick={() => goTo("/privacy")}>Privacy Policy</FooterLink>
            <FooterLink onClick={() => goTo("/terms")}>Terms of Service</FooterLink>
            <FooterLink onClick={() => goTo("/returns")}>Refund Policy</FooterLink>
        </StyledFooter>
    );
};

export default Footer;