import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { resetOrderForm, saveLocalOrderForm } from "../../../actions/orderFormActions";
import { isUserLoggedIn } from "../../../modules/authentication";
import { isLocal } from "../../../modules/environment";
import TertiaryButton from "../../form/main/TertiaryButton";
import ContinueAndSaveButton from "../../form/main/ContinueAndSaveButton";
import Modal from "../../main/Modal";
import OrderFormCard from "./OrderFormCard";
import { validateCompleteOrderForm } from "../../../modules/orderFormValidation";
import { hardLoad, useGoTo } from "../../../modules/links";
import { logInLink } from "../../../modules/wordpressApi";
import { setReadyForCheckout } from "../../../actions/metaActions";
import { outerPackagingTypeName } from "../../form/orderform/OuterPackagingType";

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const LineItem = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;

  span {
    width: 50%;
    text-align: left;
  }

  span:first-child {
    font-weight: bold;
  }

  span:last-child {
    font-size: 1rem;
  }
`;

const VerifyText = styled.div`
  padding-top: var(--top-bottom-spacing);
  padding-bottom: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

const OrderSummaryCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const orderForm = useSelector((state) => state.orderForm);
  const backLink = "/order/assembly-options";
  const [showModal, setShowModal] = useState(false);

  const generateOuterPackagingText = () => {
    let text = "";
    if (orderForm.outerPackagingType) {
      text += orderForm.outerPackagingType.label;
    }
    if (orderForm.outerPackagingPrint) {
      text += ", " + orderForm.outerPackagingPrint.label;
    }
    if (orderForm.outerPackagingFinish) {
      text += ", " + orderForm.outerPackagingFinish.label;
    }
    return text;
  }

  const generateInsertText = () => {
    let text = "";
    if (orderForm.insertType) {
      text += orderForm.insertType.label;
    }
    if (orderForm.insertPrint) {
      text += ", " + orderForm.insertPrint.label;
    }
    if (orderForm.insertFinish) {
      text += ", " + orderForm.insertFinish.label;
    }
    return text;
  }

  return (
    <OrderFormCard
      backLink={backLink}
      errorMsg={validateCompleteOrderForm(orderForm).errorMsg}
      showContinueButton={false}
      title={"Order Details"}>
      <CardContent>
        <LineItem>
          <span>Band Name</span>
          <span>{orderForm["bandName"]}</span>
        </LineItem>
        <LineItem>
          <span>Album Title</span>
          <span>{orderForm["albumTitle"]}</span>
        </LineItem>
        <LineItem>
          <span>Catalog Number</span>
          <span>{orderForm["catalogNumber"]}</span>
        </LineItem>
        <LineItem>
          <span>Album Type</span>
          <span>{orderForm["albumType"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Weight</span>
          <span>{orderForm["weight"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Total Quantity</span>
          <span>{orderForm["totalQuantity"]}</span>
        </LineItem>
        <LineItem>
          <span>Test Presses</span>
          <span>{orderForm["testPresses"]}</span>
        </LineItem>
        <LineItem>
          <span>Colors</span>
          <span>{
            orderForm["colors"]?.map(color => color.quantity + " " + color.color.label).join(", ")
          }</span>
        </LineItem>
        <LineItem>
          <span>Center Label</span>
          <span>{orderForm["centerLabel"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Innersleeve</span>
          <span>{orderForm["innersleeve"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Outer Packaging</span>
          <span>{generateOuterPackagingText()}</span>
        </LineItem>
        <LineItem>
          <span>Insert Options</span>
          <span>{generateInsertText()}</span>
        </LineItem>
        <LineItem>
          <span>Polybag</span>
          <span>{orderForm["polybag"]?.label}</span>
        </LineItem>
        {orderForm[outerPackagingTypeName]?.value !== "none" && <LineItem>
          <span>Assembly Option</span>
          <span>{orderForm["assemblyOption"]?.label}</span>
        </LineItem> }
        <VerifyText>Please verify everything above is correct.</VerifyText>
      </CardContent>
      <ContinueAndSaveButton
        buttonText="Continue"
        disabled={!validateCompleteOrderForm(orderForm).isValid}
        onClick={(event) => {
          event.preventDefault();
          dispatch(saveLocalOrderForm(orderForm));
          dispatch(setReadyForCheckout(true));
          if (isLocal()) {
            goTo(`/account/billing-address`);
          } else {
            if (!isUserLoggedIn()) {
              hardLoad(logInLink);
            } else {
              goTo(`/login-success`);
            }
            
          }
        }}
      />
      <TertiaryButton
        buttonText="Cancel Order and Reset All Inputs"
        onClick={(event) => {
          event.preventDefault();
          setShowModal(true);
        }}
      />
      {showModal && (
        <Modal
          title={"Reset All Inputs?"}
          onConfirm={() => {
            dispatch(resetOrderForm());
            setShowModal(false);
            goTo("/order/album-details");
          }}
          onCancel={() => setShowModal(false)}
          confirmText={"Yes, reset all inputs"}
          cancelText={"No, go back"}>
            <p style={{ padding: "1rem", fontSize: "1.25rem" }}>
              Are you sure you want to reset all inputs? This will clear all of your current selections and start the order process over.
            </p>
        </Modal>
      )}
    </OrderFormCard>
  );
};

export default OrderSummaryCard;
