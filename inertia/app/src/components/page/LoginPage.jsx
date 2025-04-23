import { FloatRightImage } from "../../styles/LandingPage";
import styled from "styled-components";
import { LoginPageCardColumn, LoginPageContainer } from "../../styles/LoginPage";
import LoginCard from "../card/login/LoginCard";

const EnormousDoorImage = styled(FloatRightImage)`
    @media (max-width: 40rem) {
        width: 15rem;
        height: auto;
    }
`;

const LoginPage = () => {
    return (
        <LoginPageContainer>
            <LoginPageCardColumn>
                <LoginCard />
            </LoginPageCardColumn>
        </LoginPageContainer>
    );
};

export default LoginPage;