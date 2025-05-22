import { useNavigate } from "react-router-dom";
import { LoginCardContainer, LoginCardTitle } from "../../../styles/LoginPage";
import LabeledInput from "../../form/main/LabeledInput";
import { useState } from "react";
import TertiaryButton from "../../form/main/TertiaryButton";
import BackButton from "../../form/main/BackButton";
import ErrorText from "../../form/main/ErrorText";
import { requestPasswordReset } from "../../../modules/heliosApi";
import Modal from "../../main/Modal";
import LabeledSpinner from "../../main/LabeledSpinner";

const beenSent = "Your reset password email has been sent. Please check your inbox.";

const ForgotPasswordCard = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("Sending password reset email...");

    return <LoginCardContainer>
        <LoginCardTitle>
            <h2>Forgot Password</h2>
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
            value={email}
        />
        {error && <ErrorText text={error} />}
        <TertiaryButton
            buttonText={"Submit"}
            disabled={showModal}
            onClick={async () => {
                setShowModal(true);
                let result = await requestPasswordReset(email);
                if (result?.status !== 200) {
                    result?.response?.data?.message && setError("Unable to send request: " + result?.response?.data?.message);
                    setShowModal(false);
                } else {
                    setModalMessage(beenSent);
                }
            }} />
        { showModal && 
            <Modal>
                { modalMessage !== beenSent && <LabeledSpinner text={modalMessage} /> }
                { modalMessage === beenSent && beenSent }
            </Modal>
        }
    </LoginCardContainer>
}

export default ForgotPasswordCard;