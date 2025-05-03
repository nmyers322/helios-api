import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { getTokenFromResponse, login } from '../../../modules/heliosApi'
import {
    getQueryParamsObject,
    handlePossiblRedirect,
    useGoTo,
} from '../../../modules/links'
import {
    validateEmailInput,
    validateTextInput,
} from '../../../modules/validation'
import {
    LoginCardContainer,
    LoginCardTitle,
    Separator,
} from '../../../styles/LoginPage'
import BackButton from '../../form/main/BackButton'
import ErrorText from '../../form/main/ErrorText'
import LabeledInput from '../../form/main/LabeledInput'
import SuccessText from '../../form/main/SuccessText'
import TertiaryButton from '../../form/main/TertiaryButton'
import LabeledSpinner from '../../main/LabeledSpinner'
import Modal from '../../main/Modal'
import { setToken } from '../../../actions/metaActions'
import { setActiveTokenStatus } from '../../../actions/customerActions'
import { heliosLogger } from '../../../modules/logging'

const LoginCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const goTo = useGoTo(navigate);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("Logging in...");
    const successCode = getQueryParamsObject()?.success || null;

    return <LoginCardContainer>
        <LoginCardTitle>
            <h2>Login</h2>
            <BackButton
                onClick={(event) => {
                    event.preventDefault();
                    navigate(-1);
                }}
                />
        </LoginCardTitle>
        { successCode === "logout" && <SuccessText text={"You have been logged out successfully."} /> }
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
        { error && <ErrorText text={error} /> }
        <TertiaryButton
            buttonText={"Login"}
            disabled={showModal || !validateEmailInput(email).isValid || !validateTextInput(password, "password").isValid}
            onClick={async () => {
                setShowModal(true);
                let result = await login(email, password);
                if (result?.status === 200) {
                    let token = getTokenFromResponse(result);
                    if (token) {
                        dispatch(setToken(token));
                        dispatch(setActiveTokenStatus(true));
                    }
                    setError(null);
                    setShowModal(true);
                    handlePossiblRedirect(navigate, "/login-success");
                } else {
                    let errorMessage = result?.response?.data?.errors[0]?.message || "There was a problem logging in. Try again or please contact support.";
                    setError(errorMessage);
                    setShowModal(false);
                }
            }} />
        <Separator>
            <span>or</span>
        </Separator>
        <TertiaryButton
            buttonText={"Create Account"}
            disabled={showModal}
            onClick={() => {
                goTo("/register");
            }} />
        <Separator>
            <span>or</span>
        </Separator>
        <TertiaryButton
            buttonText={"Login With Google"}
            disabled={showModal}
            onClick={() => {
                goTo("/login/google");
            }} />
        { showModal && 
            <Modal>
                <LabeledSpinner text={modalMessage} />
            </Modal>
        }
    </LoginCardContainer>
}

export default LoginCard;