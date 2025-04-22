import React from "react";
import styled from "styled-components";
import CheckoutCard from "./CheckoutCard";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    font-size: 1.25rem;
`;

const Title = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
    text-align: center;
    width: 100%;
`;

const NextStepsCard = ({
  className = "",
  order = {}
}) => {
    return (
        <CheckoutCard className={className}>
            <Title>Next Steps</Title>
            <Container>
                <p>Thank you for your order. An automated email with your order confirmation will arrive shortly. The Helios team will review your order within one business day, and you will receive a follow-up email with instructions on the next steps. We look forward to the privilege of working with you.</p>
            </Container>
        </CheckoutCard>
    );
};

export default NextStepsCard;
