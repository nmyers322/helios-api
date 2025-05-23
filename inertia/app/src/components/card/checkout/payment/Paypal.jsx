import { useDispatch } from "react-redux";
import { capturePaypalOrder, initializePaypalOrder } from "../../../../modules/heliosApi";
import { updateOrder } from "../../../../actions/ordersActions";
import { heliosLogger } from "../../../../modules/logging";
import { useGoTo } from "../../../../modules/links";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";

const Paypal = ({
    buildNewOrder,
    setErrorText
}) => {
    const dispatch = useDispatch();
    const goTo = useGoTo(useNavigate());

    return <PayPalButtons
        createOrder={async () => {
            setErrorText("");
            let newOrder = await initializePaypalOrder(await buildNewOrder());
            try {
                const orderData = newOrder?.data?.jsonResponse;
                if (orderData.status === "CREATED" && orderData.id) {
                    dispatch(updateOrder(newOrder?.data?.order));
                    return orderData.id;
                } else {
                    const errorDetail = orderData?.details?.[0];
                    const errorMessage = errorDetail
                        ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                        : JSON.stringify(orderData);
                    throw new Error(errorMessage);
                }
            } catch (error) {
                heliosLogger("Error creating PayPal order:", error);
                setErrorText("There was an error creating the PayPal order. Please try again.");
            }
        }}
        onApprove={async (data, actions) => {
            let capturedOrder = await capturePaypalOrder({
                orderId: data?.orderID
            });
            try {
                const orderData = capturedOrder?.data?.jsonResponse;
                // Three cases to handle:
                const errorDetail = orderData?.details?.[0];
                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                    return actions.restart();
                } else if (errorDetail) {
                    //   (2) Other non-recoverable errors -> Show a failure message
                    throw new Error(`${errorDetail?.description} (${orderData?.debug_id})`);
                } else {
                    //   (3) Successful transaction -> Show confirmation or thank you message
                    dispatch(updateOrder(capturedOrder?.data?.order));
                    // Todo: need to clear the order form and shipping stuff here
                    goTo(`/checkout/order-received/${capturedOrder?.data?.order?.id}`);
                }
            } catch (error) {
                heliosLogger("Error capturing PayPal order:", error);
                setErrorText("There was an error capturing the PayPal order. Please try again.");
            }
        }}
        onError={(error) => {
            heliosLogger("PayPal error:", error);
            setErrorText("There was an error processing your PayPal payment. Please try again.");
        }}
        style={{
            shape: "pill",
            color: "silver",
            label: "pay",
        }} />;
}

export default Paypal;