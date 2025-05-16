import { useSelector } from "react-redux";
import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import ShippingOptionsCard from "../../card/checkout/ShippingOptionsCard";
import Button from "../../form/main/Button";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import TertiaryButton from "../../form/main/TertiaryButton";

const ShippingOptionsStep = () => {
  const fetchingShippingOptions = useSelector((state) => state.shippingOptions.fetching);
  const goTo = useGoTo(useNavigate());
  return (<StepContainer>
    <ShippingOptionsCard />
    <CheckoutCard
      disabled={fetchingShippingOptions}>
        <Button
          buttonText="Continue to Payment Options"
          disabled={fetchingShippingOptions}
          onClick={() => {
            goTo("/checkout/payment");          
          }} />
        <TertiaryButton
          buttonText="Back to Order Form"
          disabled={fetchingShippingOptions}
          onClick={() => {
            goTo("/order");
          }} />
    </CheckoutCard>
  </StepContainer>);
}

export default ShippingOptionsStep;