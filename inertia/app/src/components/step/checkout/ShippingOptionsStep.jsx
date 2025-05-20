import { useSelector } from "react-redux";
import { StepContainer } from "../../../styles/CheckoutPage";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import ShippingOptionsCard from "../../card/checkout/ShippingOptionsCard";
import ContactAndShippingInformationCard from "../../card/checkout/ContactAndShippingInformationCard";
import Button from "../../form/main/Button";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import TertiaryButton from "../../form/main/TertiaryButton";

const ShippingOptionsStep = () => {
  const fetchingShippingOptions = useSelector((state) => state.shippingOptions.fetching);
  const selectedShippingOption = useSelector((state) => state.shippingOptions.selectedOption);
  const goTo = useGoTo(useNavigate());
  return (<StepContainer>
    <ContactAndShippingInformationCard isEditable={true} />
    <ShippingOptionsCard />
    <CheckoutCard
      disabled={fetchingShippingOptions}>
        <Button
          buttonText="Continue to Payment Options"
          disabled={fetchingShippingOptions || !selectedShippingOption}
          onClick={() => {
            goTo("/checkout/payment");          
          }} />
        <TertiaryButton
          buttonText="Back to Order Form"
          onClick={() => {
            goTo("/order");
          }} />
    </CheckoutCard>
  </StepContainer>);
}

export default ShippingOptionsStep;