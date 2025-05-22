import { useNavigate } from "react-router-dom";
import { getQueryParamsObject, handlePossiblRedirect, useGoTo } from "../../../modules/links";
import { LoginCardContainer, LoginCardTitle } from "../../../styles/LoginPage";
import LabeledInput from "../../form/main/LabeledInput";
import { useState } from "react";
import TertiaryButton from "../../form/main/TertiaryButton";
import { validateEmailInput, validateTextInput } from "../../../modules/validation";
import BackButton from "../../form/main/BackButton";
import ErrorText from "../../form/main/ErrorText";
import { createAccount, resetPassword } from "../../../modules/heliosApi";
import Modal from "../../main/Modal";
import LabeledSpinner from "../../main/LabeledSpinner";
import { getLastPathPart } from "../../../modules/routes";

const ResetPasswordCard = () => {
    const navigate = useNavigate();
    const goTo = useGoTo(navigate);
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const passwordValidation = validateTextInput(password, "password");
    const password2Validation = validateTextInput(password2, "password");
    const passwordsMatch = password === password2;
    const isValid = passwordValidation.isValid && password2Validation.isValid && passwordsMatch;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("Creating account...");
    const token = getQueryParamsObject().token;

    return <LoginCardContainer>
        <LoginCardTitle>
            <h2>Reset Password</h2>
        </LoginCardTitle>
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
                let result = await resetPassword(token, password);
                if (result?.status !== 200) {
                    result?.response?.data?.message && setError("Unable to reset password: " + result?.response?.data?.message);
                    setShowModal(false);
                } else {
                    setModalMessage("Password reset successful. Redirecting to login...");
                    
                    setTimeout(() => {
                        handlePossiblRedirect(navigate, "/login");
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

export default ResetPasswordCard;