import React from "react";
import CenterLabel from "../../form/orderform/CenterLabel";
import OrderFormCard from "../../card/orderform/OrderFormCard";
import { validateCenterLabelOptionsCard } from "../../../modules/orderFormValidation";
import { useSelector } from "react-redux";

const CenterLabelOptions = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/color-options"
      continueLink="/order/innersleeve-options"
      className={props.className}
      disabled={!validateCenterLabelOptionsCard(orderForm).isValid}
      title="Center Label Options"
    >
      <h4>Choose the print type of the center label. Artwork will be uploaded at a later step. </h4>
      <CenterLabel />
      { orderForm.centerLabel && orderForm.centerLabel.value === "customerSupplied" &&
        <h4>You will be prompted later to make additional arrangements for getting your own labels to us before production begins.</h4>
      }
    </OrderFormCard>
  );
}

export default CenterLabelOptions;