import styled from "styled-components";
import logo from "../../images/helios-yellow-1000.png";

export const SpinningSunLarge = styled.div`
  height: 20rem;
  pointer-events: none;
  position: relative;
  width: 20rem;
  overflow: hidden;
  user-select: none;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    background-image: url(${logo});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform: translate(-50%, -50%);
    animation: spin 100s linear infinite;
  }

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;