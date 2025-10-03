import '../../styles/ContactUsPage.css'

import { useEffect, useState } from 'react'

import styled from 'styled-components'
import InformationPage from '../../styles/InformationPage'
import { PageTitle } from '../../styles/Page'
import Button from '../form/main/Button'
import LabeledInput from '../form/main/LabeledInput'
import { validateEmailInput } from '../../modules/validation'
import { contactUs } from '../../modules/heliosApi'
import ErrorText from '../form/main/ErrorText'
import SuccessText from '../form/main/SuccessText'

const ContactForm = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    flex-grow: 1;
    box-sizing: border-box;

    @media (max-width: 50rem) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 4rem;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    width: auto;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: top;
    justify-content: space-around;
    width: 100%;
`;



const ContactUsPage = () => {
    const [emailInput, setEmailInput] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [recaptchaToken, setRecaptchaToken] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function getRecaptchaToken() {
        try {
            // Use the global grecaptcha object loaded from CDN
            if (window.grecaptcha && window.grecaptcha.ready) {
                return new Promise((resolve) => {
                    window.grecaptcha.ready(() => {
                        window.grecaptcha.execute(import.meta.env.VITE_REACT_APP_GOOGLE_RECAPTCHA_SITE_KEY, { action: 'contact_form' })
                            .then((token) => resolve(token))
                            .catch(() => resolve('recaptcha-unavailable'));
                    });
                });
            } else {
                return 'recaptcha-unavailable';
            }
        } catch (error) {
            console.error('Error loading recaptcha:', error);
            return 'recaptcha-unavailable';
        }
    }

    useEffect(() => {
        if (recaptchaToken === "") {
            getRecaptchaToken().then((token) => {
                setRecaptchaToken(token);
            }).catch((error) => {
                console.error("Error loading recaptcha:", error);
                setRecaptchaToken("invalid");
            });
        }
    }
    , [recaptchaToken, setRecaptchaToken]);

    return (
        <InformationPage>
            <PageTitle>Contact Us</PageTitle>
            <Row>
                <Column>
                    { isLoading && <SuccessText text="Sending..." /> }
                    { successMessage && <SuccessText text={successMessage} /> }
                    { errorMessage && <ErrorText text={errorMessage} /> }
                    <ContactForm>
                        <LabeledInput
                            name="email"
                            onChange={(event) => {
                                setEmailInput(event.target.value);
                            }}
                            text="Email"
                            type="text"
                            validationResponse={validateEmailInput(emailInput)}
                            value={emailInput} />
                        <LabeledInput
                            name="comment"
                            onChange={(event) => {
                                setCommentInput(event.target.value);
                            }}
                            text="Comment"
                            type="textarea"
                            value={commentInput} />
                        <Button
                            buttonText="Submit"
                            disabled={isLoading || recaptchaToken === "" || recaptchaToken === "invalid" || !validateEmailInput(emailInput).isValid || commentInput.length < 10}
                            onClick={async () => {
                                setIsLoading(true);
                                let contactResult = await contactUs({
                                    email: emailInput,
                                    comment: commentInput,
                                    recaptchaToken: recaptchaToken
                                });
                                if (contactResult.status === 200) {
                                    setSuccessMessage("Thank you for your message! We will get back to you as soon as possible.");
                                    setEmailInput("");
                                    setCommentInput("");
                                    setRecaptchaToken("");
                                } else {
                                    setErrorMessage("There was an error submitting your feedback. Please try again later.");
                                }
                                setIsLoading(false);
                            }} />
                    </ContactForm>
                </Column>
            </Row>
            
        </InformationPage>
    );
};

export default ContactUsPage;