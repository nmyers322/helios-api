import React, { useEffect, useState } from "react";
import { WCPageContainer } from "../../styles/Page";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../main/Modal";
import LabeledSpinner from "../main/LabeledSpinner";
import "../../styles/OrderReceivedPage.css";
import ContactAndShippingInformationCard from "../card/checkout/ContactAndShippingInformationCard";
import styled from "styled-components";
import OrderConfirmationCard from "../card/checkout/OrderConfirmationCard";
import { getOrderNumber } from "../../modules/orders";
import CompletedOrderDetailsCard from "../card/checkout/CompletedOrderDetailsCard";
import NextStepsCard from "../card/checkout/NextStepsCard";
import { useNavigate } from "react-router-dom";
import { useGoTo } from "../../modules/links";
import { setReadyForCheckout } from "../../actions/metaActions";
import { resetOrderForm } from "../../actions/orderFormActions";

const OrderReceivedPageCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 0;
  margin-right: 0;
  height: 100%;
  box-sizing: border-box;
  width: 100vw;
`;

const MobileView = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  padding-top: 3rem;
  box-sizing: border-box;
  margin-left: 0;

  @media (max-width: 40rem) {
    width: 100vw;
    display: flex;
  }
`;

const LeftColumnLarge = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 30rem;
  height: 100%;
  box-sizing: border-box;
  margin-left: 0;

  @media (max-width: 40rem) {
    display: none;
  }
`;

const RightColumnLarge = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 30rem;
  height: 100%;
  box-sizing: border-box;
  margin-right: 0;

  @media (max-width: 40rem) {
    display: none;
  }
`;

const OrderReceivedPage = () => {
  const customer = useSelector((state) => state.customer);
  const orders = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const [modalText, setModalText] = useState("Fetching your details...");
  const orderNumber = getOrderNumber();
  const order = orders?.orders[orderNumber];


  useEffect(() => {
    if (!orderNumber) {
      setModalText("No order number found. Redirecting to the main page...");
      setTimeout(() => {
        goTo("/");
      }, 4000);
    }
  }, [goTo, orderNumber]);

  useEffect(() => {
    if (orders.error) {
      setModalText(orders.error);
      setTimeout(() => {
        goTo("/");
      }, 4000);
    }
  }, [goTo, orders.error]);

  useEffect(() => {
    if (order) {
      dispatch(setReadyForCheckout(false));
      dispatch(resetOrderForm());
    }
  }, [dispatch, order]);

  return (
    <WCPageContainer>
      { (customer?.fetching || orders?.fetching || !order) && 
        <Modal>
          <LabeledSpinner text={modalText} />
        </Modal>
      }
      { !customer?.fetching && !orders?.fetching && !!order &&
        <OrderReceivedPageCardContainer>
          <MobileView>
            <OrderConfirmationCard order={orders.orders[orderNumber]} />
            <NextStepsCard />
            <CompletedOrderDetailsCard order={orders.orders[orderNumber]} />
            <ContactAndShippingInformationCard orderNumber={orderNumber} />
          </MobileView>
          <LeftColumnLarge>
            <OrderConfirmationCard order={orders.orders[orderNumber]} />
            <NextStepsCard />
            <ContactAndShippingInformationCard orderNumber={orderNumber} />
          </LeftColumnLarge>
          <RightColumnLarge>
            <CompletedOrderDetailsCard order={orders.orders[orderNumber]} />
          </RightColumnLarge>
        </OrderReceivedPageCardContainer>
      }
     </WCPageContainer>
  );
};

export default OrderReceivedPage;
