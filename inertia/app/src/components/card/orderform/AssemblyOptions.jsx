import React from "react";
import Polybag from "../../form/orderform/Polybag";
import AssemblyOption from "../../form/orderform/AssemblyOption";
import OrderFormCard from "./OrderFormCard";
import { useSelector } from "react-redux";
import { validateAssemblyOptionsCard } from "../../../modules/orderFormValidation";

const AssemblyOptions = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/insert-options"
      continueLink="/order/summary"
      className={props.className}
      disabled={!validateAssemblyOptionsCard(orderForm).isValid}
      title="Assembly Options"
    >
      <h4>Choose your final packaging and assembly options.</h4>
      <Polybag />
      <AssemblyOption />
    </OrderFormCard>
  );
};

export default AssemblyOptions;
