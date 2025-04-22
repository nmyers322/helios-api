import React, { useState } from "react";
import CheckoutCard from "./CheckoutCard";
import styled from "styled-components";
import SpinningRecordOfSuccess from "../../standalone/SpinningRecordOfSuccess";
import Button from "../../form/main/Button";
import { valueIsEmpty } from "../../../modules/validation";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;

const Title = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
    text-align: center;
    width: 100%;
`;

const OrderConfirmationCard = ({
  className = "",
  order = {}
}) => {
    const [errorText] = useState("");

    if (!valueIsEmpty(order)) {
        return <Container>
            <SpinningRecordOfSuccess />
        </Container>;
    }
    return (
        <CheckoutCard className={className}>
            <Title>Order Unsuccessful</Title>
            <Container>
                <p>There was a problem with your order.</p>
                { errorText && <p>{errorText}</p> }
                <Button
                    buttonText={"Return to Checkout Page"} 
                    onClick={() => window.location.href = "/checkout"} />
            </Container>
        </CheckoutCard>
    );
};

export default OrderConfirmationCard;
