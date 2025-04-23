import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useGoTo } from "../../../modules/links";
import { LoginCardContainer, Separator, LoginCardTitle } from "../../../styles/LoginPage";
import LabeledInput from "../../form/main/LabeledInput";
import { useState } from "react";
import Button from "../../form/main/Button";
import TertiaryButton from "../../form/main/TertiaryButton";
import { validateEmail } from "../../../modules/accountValidation";
import { validateEmailInput, validateTextInput } from "../../../modules/validation";
import BackButton from "../../form/main/BackButton";

const LoginCard = ({backLink = "/"}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const goTo = useGoTo(navigate);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return <LoginCardContainer>
        <LoginCardTitle>
            <h2>Login</h2>
            <BackButton
                onClick={(event) => {
                    event.preventDefault();
                    goTo(backLink);
                }}
                />
        </LoginCardTitle>
        <LabeledInput
            isDisabled={false}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            text="Email"
            type="text"
            value={email}
        />
        <LabeledInput
            isDisabled={false}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            text="Password"
            type="password"
            value={password}
        />
        <TertiaryButton
            buttonText={"Login"}
            disabled={isLoading || !validateEmailInput(email).isValid || !validateTextInput(password, "password").isValid}
            onClick={() => {
                setIsLoading(true);
                //setIsLoading(false);
            }} />
        <Separator><span>or</span></Separator>
        <TertiaryButton
            buttonText={"Login With Google"}
            disabled={isLoading}
            onClick={() => {
                console.log("no op")
            }} />
    </LoginCardContainer>
}

export default LoginCard;