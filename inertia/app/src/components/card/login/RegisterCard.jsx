import { useNavigate } from "react-router-dom";
import { getQueryParamsObject, handlePossiblRedirect, useGoTo } from "../../../modules/links";
import { LoginCardContainer, LoginCardTitle } from "../../../styles/LoginPage";
import LabeledInput from "../../form/main/LabeledInput";
import { useState } from "react";
import TertiaryButton from "../../form/main/TertiaryButton";
import { validateEmailInput, validateTextInput } from "../../../modules/validation";
import BackButton from "../../form/main/BackButton";
import ErrorText from "../../form/main/ErrorText";
import { createAccount } from "../../../modules/heliosApi";
import Modal from "../../main/Modal";
import LabeledSpinner from "../../main/LabeledSpinner";

const RegisterCard = () => {
    const navigate = useNavigate();
    const goTo = useGoTo(navigate);
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const emailValidation = validateEmailInput(email);
    const passwordValidation = validateTextInput(password, "password");
    const password2Validation = validateTextInput(password2, "password");
    const passwordsMatch = password === password2;
    const isValid = emailValidation.isValid && passwordValidation.isValid && password2Validation.isValid && passwordsMatch;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("Creating account...");

    return <LoginCardContainer>
        <LoginCardTitle>
            <h2>Create Account</h2>
            <BackButton
                onClick={(event) => {
                    event.preventDefault();
                    navigate(-1);
                }}
                />
        </LoginCardTitle>
        <LabeledInput
            isDisabled={false}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            text="Email"
            type="text"
            validationResponse={emailValidation}
            value={email}
        />
        <LabeledInput
            isDisabled={false}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            text="Password"
            type="password"
            validationResponse={passwordValidation}
            value={password}
        />
        <LabeledInput
            isDisabled={false}
            name="password2"
            onChange={(e) => setPassword2(e.target.value)}
            text="Password (again)"
            type="password"
            validationResponse={password2Validation}
            value={password2}
        />
        {!passwordsMatch && <ErrorText text={"Passwords must match."} /> }
        {error && <ErrorText text={error} />}
        <TertiaryButton
            buttonText={"Submit"}
            disabled={showModal || !isValid}
            onClick={async () => {
                setShowModal(true);
                let result = await createAccount(email, password, password2);
                if (result?.status !== 200) {
                    result?.response?.data?.message && setError("Unable to create account: " + result?.response?.data?.message);
                    setShowModal(false);
                } else {
                    setModalMessage("Account successfully created. Logging in...");
                    
                    setTimeout(() => {
                        handlePossiblRedirect(navigate, "/login-success");
                    }, 3000);
                }
            }} />
        { showModal && 
            <Modal>
                <LabeledSpinner text={modalMessage} />
            </Modal>
        }
    </LoginCardContainer>
}

export default RegisterCard;