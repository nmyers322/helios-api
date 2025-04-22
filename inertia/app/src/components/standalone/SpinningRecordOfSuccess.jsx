import styled, { keyframes } from "styled-components";
import Confetti from "react-confetti";
import { useState } from "react";

const spinAnimation = keyframes`
    0% {
        transform: scaleX(0);
    }
    2% {
        transform: scaleX(1);
    }
    5% {
        transform: scaleX(0);
    }
    20% {
        transform: scaleX(1);
    }
    50% {
        transform: scaleX(0);
    }
    100% {
        transform: scaleX(1);
    }
`;

const Container = styled.div`
    margin-bottom: 3rem;
`;

const Vinyl = styled.div`
    margin-top: 0;
    width: 20rem;
    height: 20rem;
    background-color: black;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: ${spinAnimation} 1s ease-out;
`;

const CenterLabel = styled.div`
    width: 30%;
    height: 30%;
    padding: var(--top-bottom-spacing);
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    justify-content: space-around;
`;

const CenterHole = styled.div`
    width: 1rem;
    height: 1rem;
    background-color: black;
    border-radius: 50%;
`;

const Text = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    color: black;
`;

const SpinningRecordOfSuccess = () => {
    const [showConfetti] = useState(true);

    return (
        <Container>
            <Vinyl>
                <CenterLabel>
                    <Text>Order</Text>
                    <CenterHole />
                    <Text>Successful!</Text>
                </CenterLabel>
            </Vinyl>
            { showConfetti && <Confetti initialVelocityY={5} numberOfPieces={200} recycle={false} /> }
        </Container>
    );
}

export default SpinningRecordOfSuccess;