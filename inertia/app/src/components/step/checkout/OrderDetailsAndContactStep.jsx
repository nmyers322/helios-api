import { useNavigate } from "react-router-dom";
import { useGoTo } from "../../../modules/links";
import OrderDetailsCard from "../../card/checkout/OrderDetailsCard";
import CheckoutCard from "../../card/checkout/CheckoutCard";
import Button from "../../form/main/Button";
import ContactAndShippingInformationCard from "../../card/checkout/ContactAndShippingInformationCard";
import { StepContainer } from "../../../styles/CheckoutPage";

const OrderDetailsAndContactStep = ({isDisabled = false}) => {
const goTo = useGoTo(useNavigate());
return (<StepContainer>
    <OrderDetailsCard
    disabled={isDisabled} />
    <ContactAndShippingInformationCard 
    disabled={isDisabled}
    isEditable={!isDisabled} />
    <CheckoutCard
    disabled={isDisabled}
    className="checkout-card">
        <Button
        buttonText="Continue to Shipping Options" 
        disabled={isDisabled}
        onClick={() => {
            goTo("/checkout/shipping");
        }} />
    </CheckoutCard>
</StepContainer>);
}

export default OrderDetailsAndContactStep;