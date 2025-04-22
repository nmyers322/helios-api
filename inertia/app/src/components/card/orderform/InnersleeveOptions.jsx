import React from "react";
import Innersleeve from "../../form/orderform/Innersleeve";
import OrderFormCard from "../../card/orderform/OrderFormCard";
import { validateInnersleeveOptionsCard } from "../../../modules/orderFormValidation";
import { useSelector } from "react-redux";

const InnersleeveOptions = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/center-label-options"
      continueLink="/order/outer-packaging-options"
      className={props.className}
      disabled={!validateInnersleeveOptionsCard(orderForm).isValid}
      title="Innersleeve Options"
    >
      <h4>Choose the innersleeve type. The innersleeve is the thin packaging that directly encases each record.</h4>
      <Innersleeve />
    </OrderFormCard>
  );
}

export default InnersleeveOptions;