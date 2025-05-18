import { useState } from "react";
import CheckoutCard from "./CheckoutCard";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import LabeledSpinner from "../../main/LabeledSpinner";
import RadioSelector from "../../form/main/RadioSelector";
import { capturePaypalOrder, createOrder, initializePaypalOrder, initializeStripeOrder } from "../../../modules/heliosApi";
import ErrorText from "../../form/main/ErrorText";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { buildCartFromOrderForm } from "../../../modules/cart";
import Button from "../../form/main/Button";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import { updateOrder } from "../../../actions/ordersActions";
import { heliosLogger } from "../../../modules/logging";
import { CheckoutProvider, PaymentElement, useCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutButton from "../../form/checkout/StripeCheckoutButton";

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_API_KEY);

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Icon = styled.p`
  margin-top: 0.1rem;
  margin-bottom: 0rem;
  padding-left: 1rem;
  margin-left: auto;
`;

const PaymentOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-left: 1rem;
  padding-right: 1rem;
  cursor: pointer;
  border: ${(props) => props.$isSelected ? `2px solid ${props.theme.colors.text}` : "2px solid transparent"};
`;

const PaymentOptionHeader = styled.div`
  display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

const PaymentOption = styled.div`
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 0.5rem;
    padding-bottom: 2rem;
    width: calc(100% - 4rem);
`;

const PaymentOptionsCard = ({
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const goTo = useGoTo(useNavigate());
  const orderForm = useSelector((state) => state.orderForm);
  const billingAddress = useSelector((state) => state.orderForm.billing);
  const products = useSelector((state) => state.products?.products);
  const shippingAddress = useSelector((state) => state.orderForm.shipping);
  const shippingOptions = useSelector((state) => state.shippingOptions);
  const [errorText, setErrorText] = useState("");
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("bank_transfer");
  const [loadingStripe, setLoadingStripe] = useState(false);

  const buildNewOrder = async () => ({
    billingAddress: billingAddress,
    cart: await buildCartFromOrderForm(orderForm, products),
    selectedShippingOption: shippingOptions?.selectedOption,
    shippingAddress: shippingAddress
  });

  return (
    <CheckoutCard
      disabled={disabled}
      title={"Payment Options"}
      subtitle={`Please select a payment option for your order`}
    >
      
      <PaymentOptionContainer 
        $isSelected={selectedPaymentOption === "bank_transfer"}
        onClick={() => {
          setSelectedPaymentOption("bank_transfer");
        }}>
        <PaymentOptionHeader>
            <RadioSelector 
            checked={selectedPaymentOption === "bank_transfer"}
            name={"Bank Transfer"} />
            <Title>
            Direct bank transfer (Preferred Payment Method)
            </Title>
            <Icon>
              
            </Icon>
        </PaymentOptionHeader>
        {selectedPaymentOption === "bank_transfer" &&
            <PaymentOption>
                We are pleased to offer a direct bank transfer as a payment option. 
                By selecting this method, you will receive an automatic 5% discount 
                on the total of your order. For orders over $4000, we offer the option 
                to pay a 50% deposit now and the remaining balance before shipment. You 
                can contact us at contact@heliospressing.com if you have any questions 
                or need assistance. By default, our team will reach out to you after 
                reviewing your order. We look forward to facilitating a smooth and 
                efficient transaction for you.
                <Button
                  buttonText="Submit Order"
                  disabled={false}
                  onClick={async () => {
                    setErrorText("");
                    let createOrderResult = await createOrder(await buildNewOrder());
                    let order = createOrderResult?.data?.order;
                    if (order) {
                      dispatch(updateOrder(order));
                      // Todo: need to clear the order form and shipping stuff here
                      goTo(`/checkout/order-received/${order.id}`);
                    } else {
                      heliosLogger("Error creating order:", createOrderResult);
                      setErrorText("There was an error creating the order. Please try again.");
                    } 
                  }} />
            </PaymentOption>
        }
      </PaymentOptionContainer>
      <PaymentOptionContainer 
        $isSelected={selectedPaymentOption === "paypal"}
        onClick={() => {
          setSelectedPaymentOption("paypal");
        }}>
        <PaymentOptionHeader>
            <RadioSelector 
            checked={selectedPaymentOption === "paypal"}
            name={"PayPal"} />
            <Title>
              PayPal
            </Title>
            <Icon>
              
            </Icon>
        </PaymentOptionHeader>
        { selectedPaymentOption === "paypal" &&
            <PaymentOption>
                <PayPalButtons
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
                    }} />
            </PaymentOption>
        }
      </PaymentOptionContainer>
      <PaymentOptionContainer 
        $isSelected={selectedPaymentOption === "stripe"}
        onClick={() => {
          selectedPaymentOption !== "stripe" && setLoadingStripe(true);
          setSelectedPaymentOption("stripe");
        }}>
        <PaymentOptionHeader>
            <RadioSelector 
              checked={selectedPaymentOption === "stripe"}
              name={"Credit/Debit Card with Stripe"} />
            <Title>
              Credit/Debit Card
            </Title>
            <Icon>
              
            </Icon>
        </PaymentOptionHeader>
        { loadingStripe && <LabeledSpinner text={"Loading..."} /> }
        { selectedPaymentOption === "stripe" &&
          <CheckoutProvider stripe={stripePromise} options={{
            fetchClientSecret: async () => {
              setErrorText("");
              let newOrder = await initializeStripeOrder(await buildNewOrder());
              try {
                const order = newOrder?.data?.order;
                if (order.status === "open" && order.id) {
                  dispatch(updateOrder(order));
                  return newOrder?.data?.checkoutSessionClientSecret;
                } else {
                  throw new Error(newOrder);
                }
              } catch (error) {
                heliosLogger("Error creating Stripe order:", error);
                setErrorText("There was an error creating the Stripe order. Please try again.");
              }
            }
          }}>
            <PaymentOption>
              <PaymentElement 
                onLoaderStart={() => setLoadingStripe(false)}/>
              <StripeCheckoutButton 
                isDisabled={loadingStripe} 
                onClick={() => {
                  setLoadingStripe(true);
                }} 
                setErrorText={setErrorText} />
            </PaymentOption>
          </CheckoutProvider>
        }
      </PaymentOptionContainer>
      { errorText && <ErrorText text={errorText} /> }
    </CheckoutCard>
  );
};

export default PaymentOptionsCard;
