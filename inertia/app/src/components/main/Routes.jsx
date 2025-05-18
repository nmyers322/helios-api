import React from "react";
import { Routes as LibRoutes, Navigate, Route } from "react-router-dom";
import { styled } from "styled-components";
import { onLandingPage } from "../../modules/routes";
import AccountPage from "../page/AccountPage";
import CheckoutPage from "../page/CheckoutPage";
import ContactUsPage from "../page/ContactUsPage";
import LandingPage from "../page/LandingPage";
import LoginSuccessPage from "../page/LoginSuccess";
import MasteringPage from "../page/MasteringPage";
import OrderPage from "../page/OrderPage";
import OrderReceivedPage from "../page/OrderReceivedPage";
import StripeErrorPage from "../page/StripeErrorPage";
import PrivacyPolicy from "../page/PrivacyPolicy";
import ReturnPolicy from "../page/ReturnPolicy";
import TemplatesPage from "../page/TemplatesPage";
import TermsOfService from "../page/TermsOfService";
import ThanksPage from "../page/ThanksPage";
import LoginPage from "../page/LoginPage";
import RegisterCard from "../card/login/RegisterCard";
import Logout from "../standalone/Logout";
import LoginCard from "../card/login/LoginCard";

const RoutesWrapper = styled.div`
  margin-top: var(--header-height);
  margin-bottom: 0;
  height: auto;
  width: 100vw;
  background-color: ${(props) => props.$isLandingPage ? props.theme.colors.background : props.theme.colors.background};
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: default;
  scroll-behavior: smooth;
`;

const Routes = ({
    $shouldMinimizePageHeight = false,
    $shouldShowHeader = true,
    initialPage = null,
    routesWrapperRef,
    titleRef
}) => {

    return (
        <RoutesWrapper 
            ref={routesWrapperRef} 
            $shouldShowHeader={true} 
            $shouldMinimizePageHeight={false}>
            <LibRoutes>
                <Route path="/" element={<LandingPage routesWrapperRef={routesWrapperRef} titleRef={titleRef} />} />
                <Route path="/account/*" element={<AccountPage />} />
                <Route path="/contact-us" element={<ContactUsPage />} />
                <Route path="/checkout/order-received/*" element={<OrderReceivedPage />} />
                <Route path="/checkout/stripe-error" element={<StripeErrorPage />} />
                <Route path="/checkout/*" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />}>
                    <Route path="" element={<LoginCard />} />
                </Route>
                <Route path="/login-success-google" element={<Navigate to="/login-success" replace />} />
                <Route path="/login-success" element={<LoginSuccessPage />} />
                <Route path="/logout" element={<LoginPage />}>
                    <Route path="" element={<Logout />} />
                </Route>
                <Route path="/mastering" element={<MasteringPage />} />
                <Route path="/order/*" element={<OrderPage />} />
                <Route path="/register" element={<LoginPage />}>
                    <Route path="" element={<RegisterCard />} />
                </Route>
                <Route path="/templates" element={<TemplatesPage />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/thanks" element={<ThanksPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/returns" element={<ReturnPolicy />} />
            </LibRoutes>
        </RoutesWrapper>
    );
}

export default Routes;