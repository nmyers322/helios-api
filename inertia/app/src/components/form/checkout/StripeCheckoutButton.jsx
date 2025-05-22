import { useCheckout } from "@stripe/react-stripe-js"
import { heliosLogger } from "../../../modules/logging";
import Button from "../main/Button";
import { useSelector } from "react-redux";

const StripeCheckoutButton = ({isDisabled, onClick, reset, setErrorText}) => {
    const checkout = useCheckout();
    const customer = useSelector((state) => state.customer);

    return (<Button
        buttonText="Submit Order"
        disabled={isDisabled}
        onClick={async () => {
            onClick && onClick();
            heliosLogger("Stripe Checkout Button clicked");
            setErrorText("");
            const emailResult = await checkout?.updateEmail(customer?.email);
            if (emailResult.error) {
                heliosLogger("Error updating email:", emailResult.error);
                setErrorText("There was an error setting up the Stripe order. Please try again.");
                return;
            }
            heliosLogger("Stripe email updated:", emailResult);
            const result = await checkout?.confirm();
            if (result.error) {
                heliosLogger("Error confirming Stripe payment:", result);
                setErrorText("There was an error confirming the Stripe payment. Please try again.");
                reset && reset();
            } else {
                heliosLogger("Stripe payment confirmed:", result);
                alert("success");
            }
            // let createOrderResult = await createOrder(await buildNewOrder());
            // let order = createOrderResult?.data?.order;
            // if (order) {
            //   dispatch(updateOrder(order));
            //   // Todo: need to clear the order form and shipping stuff here
            //   goTo(`/checkout/order-received/${order.id}`);
            // } else {
            //   heliosLogger("Error creating order:", createOrderResult);
            //   setErrorText("There was an error creating the order. Please try again.");
            // } 
        }} 
    />);
}

export default StripeCheckoutButton;