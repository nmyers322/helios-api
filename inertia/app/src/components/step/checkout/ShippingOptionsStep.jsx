import { useSelector } from "react-redux";
import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import ShippingOptionsCard from "../../card/checkout/ShippingOptionsCard";
import Button from "../../form/main/Button";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";

const ShippingOptionsStep = () => {
  const fetchingShippingOptions = useSelector((state) => state.shippingOptions.fetching);
  const goTo = useGoTo(useNavigate());
  return (<StepContainer>
    <ShippingOptionsCard disabled={fetchingShippingOptions} />
    <CheckoutCard
      disabled={fetchingShippingOptions}>
        <Button
        buttonText="Continue to Payment Options"
        disabled={fetchingShippingOptions}
        onClick={() => {
          goTo("/checkout/payment-options");          
        }} />
    </CheckoutCard>
  </StepContainer>);
}

export default ShippingOptionsStep;