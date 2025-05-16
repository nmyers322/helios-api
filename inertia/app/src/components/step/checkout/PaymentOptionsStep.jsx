import { useSelector } from "react-redux";
import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import Button from "../../form/main/Button";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import TertiaryButton from "../../form/main/TertiaryButton";
import PaymentOptionsCard from "../../card/checkout/PaymentOptionsCard";

const PaymentOptionsStep = () => {
  const isDisabled = false;
  const goTo = useGoTo(useNavigate());
  return (<StepContainer>
    <PaymentOptionsCard />
    <CheckoutCard
      disabled={isDisabled}>
        <TertiaryButton
          buttonText="Back to Shipping Options"
          disabled={isDisabled}
          onClick={() => {
            goTo("/checkout/shipping");          
          }} />
    </CheckoutCard>
  </StepContainer>);
}

export default PaymentOptionsStep;