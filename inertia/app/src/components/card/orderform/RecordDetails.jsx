import React from "react";
import Weight from "../../form/orderform/Weight";
import TotalQuantity from "../../form/orderform/TotalQuantity";
import TestPresses from "../../form/orderform/TestPresses";
import OrderFormCard from "../../card/orderform/OrderFormCard";
import { validateRecordDetailsCard } from "../../../modules/orderFormValidation";
import { useSelector } from "react-redux";

const RecordDetails = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/album-details"
      continueLink="/order/color-options"
      className={props.className}
      disabled={!validateRecordDetailsCard(orderForm).isValid}
      title="Record Details"
    >
      <h4>Decide the format and quantity of your release here.</h4>
      <Weight />
      <TotalQuantity />
      <TestPresses />
    </OrderFormCard>
  );
};

export default RecordDetails;
