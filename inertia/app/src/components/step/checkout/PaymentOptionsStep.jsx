import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import TertiaryButton from "../../form/main/TertiaryButton";
import PaymentOptionsCard from "../../card/checkout/PaymentOptionsCard";
import ContactAndShippingInformationCard from "../../card/checkout/ContactAndShippingInformationCard";
import SelectedShippingOptionCard from "../../card/checkout/SelectedShippingOptionCard";
import { validateAddress } from "../../../modules/accountValidation";
import { validateCompleteOrderForm } from "../../../modules/orderFormValidation";
import { useSelector } from "react-redux";

const PaymentOptionsStep = () => {
  const goTo = useGoTo(useNavigate());
  const orderForm = useSelector((state) => state.orderForm);
  const selectedShippingOption = useSelector((state) => state.shippingOptions.selectedOption);
  const isDisabled = !validateAddress(orderForm.billing, "billing").isValid
    || !validateAddress(orderForm.shipping, "shipping").isValid
    || !validateCompleteOrderForm(orderForm)
    || !selectedShippingOption;
  return (<StepContainer>
    <ContactAndShippingInformationCard isEditable={true} />
    <SelectedShippingOptionCard />
    <PaymentOptionsCard 
      disabled={isDisabled}/>
    <CheckoutCard>
        <TertiaryButton
          buttonText="Back to Shipping Options"
          onClick={() => {
            goTo("/checkout/shipping");          
          }} />
    </CheckoutCard>
  </StepContainer>);
}

export default PaymentOptionsStep;