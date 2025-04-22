import React from "react";
import ColorAndQuantity from "../../form/orderform/ColorAndQuantity";
import OrderFormCard from "../../card/orderform/OrderFormCard";
import { useDispatch, useSelector } from "react-redux";
import { validateColorOptionsCard } from "../../../modules/orderFormValidation";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import Button from "../../form/main/Button";
import TotalQuantity, { maxColorVariations, maximumQuantity, minimumQuantity } from "../../form/orderform/TotalQuantity";
import theme from "../../../modules/theme";
import { FIELD_REQUIRED } from "../../../modules/validation";

const ColorOptions = ({className}) => {
  const dispatch = useDispatch();
  const orderForm = useSelector((state) => state.orderForm);
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const validationResponse = validateColorOptionsCard(orderForm);
  return (
    <OrderFormCard
      backLink="/order/record-details"
      continueLink="/order/center-label-options"
      className={className}
      disabled={!validationResponse.isValid}
      errorMsg={validationResponse && validationResponse.errorMsg !== FIELD_REQUIRED && validationResponse.errorMsg}
      onSubmit={() => {
        dispatch(updateOrderFormField("colorsVerified", true));
      }}
      title="Color Options"
    >
      <h4>Choose the color of your vinyl record, or add variations. The combined quantity of your color selections must match the total quanity of your order.</h4>
      <TotalQuantity />
      { orderForm.colors.map((color, index) => (
        <ColorAndQuantity index={index} key={"colorAndQuantity" + index} />
      ))}
      { orderForm.colors.length < 5 &&
        <Button 
          buttonText={"Add another color"}
          disabled={orderForm.colors.length >= maxColorVariations}
          onClick={() => {
            //if the total of all colors' quantities is the same as the total quantity, 
            let totalColorsQuantity = orderForm.colors.reduce((acc, color) => acc + color.quantity, 0);
            if (totalColorsQuantity === orderForm.totalQuantity) {
              // then we can mutate the color quantities
              dispatch(updateOrderFormField("colors", orderForm.colors.concat({ color: "", quantity: minimumQuantity })));
              dispatch(updateOrderFormField("totalQuantity", Math.min(orderForm.totalQuantity + minimumQuantity, maximumQuantity)));
          } else {
            // if the total of all colors' quantities is not the same as the total quantity, then we can just add a color with the quantity factor amount.
            dispatch(updateOrderFormField("colors", orderForm.colors.concat({ color: "", quantity: minimumQuantity })));
          }}}
          styles={{
            backgroundColor: theme[currentTheme].colors.tertiary,
            color: theme[currentTheme].colors.text,
          }}
        />
      }
    </OrderFormCard>
  );
}

export default ColorOptions;