import loginBackground from "../images/helios-login-background-6.png";
import styled from "styled-components";

export const LoginPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
  height: calc(100vh - var(--header-height));
  box-sizing: border-box;
  width: 100vw;
  background-image: url(${loginBackground}) !important;
  background-size: cover !important;
`;

export const LoginPageCardColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  box-sizing: border-box;
  width: 100vw;

  @media (max-width: 40rem) {
    width: 100vw;
  }
`;

export const LoginCardContainer = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 1rem 2rem 2rem 2rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: 1rem;
  margin-left: 1rem;
  margin-top: 12rem;
  width: calc(100% - 12rem);
  max-width: 40rem;

  @media (max-width: 30rem) {
    margin-top: 3rem;
    padding: 1rem 2rem 1.5rem 2rem;
    width: calc(100% - 4rem);
  }
`;

export const LoginCardTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-top: 1rem;
`;

export const Separator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 6rem);
    margin: 1rem 3rem;
    height: 1px;
    background-color: ${(props) => props.theme.colors.cardBackground};
    position: relative;
    font-size: 1rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    padding: 1rem 0rem;
    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        background-color: ${(props) => props.theme.colors.text};
    }
    &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 100%;
        height: 1px;
        z-index: 0;
        background-color: ${(props) => props.theme.colors.text};
    }
    @media (max-width: 40rem) {
        font-size: 0.8rem;
        padding: 0 0.5rem;
    }
    @media (max-width: 30rem) {
        font-size: 0.7rem;
        padding: 0 0.3rem;
    }
    span {
        position: relative;
        z-index: 1;
        background-color: ${(props) => props.theme.colors.cardBackground};
        padding: 0 0.5rem;
        @media (max-width: 40rem) {
            padding: 0 0.3rem;
        }
        @media (max-width: 30rem) {
            padding: 0 0.2rem;
        }
    }
`;
