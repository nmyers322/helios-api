import { Outlet } from "react-router-dom";
import { LoginPageCardColumn, LoginPageContainer } from "../../styles/LoginPage";

const LoginPage = () => {
    return (
        <LoginPageContainer>
            <LoginPageCardColumn>
                <Outlet />
            </LoginPageCardColumn>
        </LoginPageContainer>
    );
};

export default LoginPage;