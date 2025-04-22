import React from "react";
import InsertType from "../../form/orderform/InsertType";
import InsertPrint from "../../form/orderform/InsertPrint";
import InsertFinish from "../../form/orderform/InsertFinish";
import OrderFormCard from "./OrderFormCard";
import { useSelector } from "react-redux";
import { validateInsertOptionsCard } from "../../../modules/orderFormValidation";

const InsertOptions = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/outer-packaging-options"
      continueLink="/order/assembly-options"
      className={props.className}
      disabled={!validateInsertOptionsCard(orderForm).isValid}
      title="Insert Options"
    >
      <h4>Choose the print options for your insert. Artwork will be uploaded at a later step. </h4>
      <InsertType />
      <InsertPrint />
      <InsertFinish />
      { orderForm.insertType && orderForm.insertType.value === "customerSupplied" &&
        <h4>You will be prompted later to make additional arrangements for getting your own inserts to us before production begins.</h4>
      }
    </OrderFormCard>
  );
}

export default InsertOptions;