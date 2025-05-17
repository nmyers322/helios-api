import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import TertiaryButton from "../../form/main/TertiaryButton";
import PaymentOptionsCard from "../../card/checkout/PaymentOptionsCard";
import ContactAndShippingInformationCard from "../../card/checkout/ContactAndShippingInformationCard";

const PaymentOptionsStep = () => {
  const isDisabled = false;
  const goTo = useGoTo(useNavigate());
  return (<StepContainer>
    <ContactAndShippingInformationCard isEditable={true} />
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