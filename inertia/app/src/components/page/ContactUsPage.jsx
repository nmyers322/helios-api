import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InformationPage from "../../styles/InformationPage";
import { PageTitle } from "../../styles/Page";
import '../../styles/ContactUsPage.css';

const ContactFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ContactInformation = ({ContainerClass}) => {
    return <ContainerClass>

    </ContainerClass>;
}

const ContactInformationLarge = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    @media (max-width: 50rem) {
        display: none;
    }
`;

const ContactInformationSmall = styled.div`
    display: none;

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
    const [formHtml, setFormHtml] = useState("");

    useEffect(() => {
        // Get the form HTML from the DOM
        const formElement = document.querySelector(".wpcf7-form");
        if (formElement) {
            setFormHtml(formElement.outerHTML);
        }
    }, []);

    return (
        <InformationPage>
            <PageTitle>Contact Us</PageTitle>
            <Row>
                <Column>
                    <ContactInformation ContainerClass={ContactInformationSmall} />
                    <ContactFormContainer dangerouslySetInnerHTML={{ __html: formHtml }} />
                </Column>
                <ContactInformation ContainerClass={ContactInformationLarge} />
            </Row>
            
        </InformationPage>
    );
};

export default ContactUsPage;