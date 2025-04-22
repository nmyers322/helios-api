import React from "react";
import OuterPackagingType from "../../form/orderform/OuterPackagingType";
import OuterPackagingPrint from "../../form/orderform/OuterPackagingPrint";
import OuterPackagingFinish from "../../form/orderform/OuterPackagingFinish";
import OrderFormCard from "./OrderFormCard";
import { useSelector } from "react-redux";
import { validateOuterPackagingOptionsCard } from "../../../modules/orderFormValidation";

const OuterPackagingOptions = (props) => {
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      backLink="/order/innersleeve-options"
      continueLink="/order/insert-options"
      className={props.className}
      disabled={!validateOuterPackagingOptionsCard(orderForm).isValid}
      title="Outer Packaging Options"
    >
      <h4>Choose the print options for your record cover. Artwork will be uploaded at a later step. </h4>
      <OuterPackagingType />
      <OuterPackagingPrint />
      <OuterPackagingFinish />
      { orderForm.outerPackagingType && orderForm.outerPackagingType.value === "customerSupplied" &&
        <h4>You will be prompted later to make additional arrangements for getting your own covers to us before production begins.</h4>
      }
      { orderForm.outerPackagingFinish && 
        orderForm.outerPackagingFinish.value === "reversePrint" &&
        orderForm.outerPackagingType &&
        orderForm.outerPackagingType.value !== "customerSupplied" &&
        orderForm.outerPackagingType.value !== "none" &&
        <h4>Reverse print requires a minimum of 1000 jackets per order. If you choose a total quantity of records less than 1000, we can save the remainder of the jackets for a future press.</h4>
      }
    </OrderFormCard>
  );
}

export default OuterPackagingOptions;