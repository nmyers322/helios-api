import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { removeColor, updateColor, updateOrderForm, updateOrderFormField } from "../../../actions/orderFormActions";
import { getAvailableColors } from "../../../modules/colors";
import { validateColorOption, validateColorQuantity } from "../../../modules/orderFormValidation";
import LabeledInput from "../main/LabeledInput";
import RedXButton from "../main/RedXButton";
import { maximumQuantity, minimumQuantity, quantityFactor } from "./TotalQuantity";
import { isPackageLocked } from "../../../modules/packageDeals";

const ColorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: top;
  width: 100%;

  @media (max-width: 35rem) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const ColorQuantityContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 1rem;

  @media (max-width: 35rem) {
    width: 100%;
    margin-left: 0;
    margin-bottom: 1rem;
  }
`;

const DeleteColorColumn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 1rem;
`;

const ColorAndQuantity = ({
  index
}) => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  const previouslySelectedColors = orderForm.colors.map((color) => color.color.value);
  const filteredColorOptions = getAvailableColors()
    .map((option) => ({ 
      ...option, 
      disabled: previouslySelectedColors.includes(option.value) && previouslySelectedColors.indexOf(option.value) !== index,
    }))
    .sort((a, b) => a.disabled - b.disabled);
  const quantity = orderForm.colors[index] && orderForm.colors[index].quantity;
  return (
    <ColorContainer>
      <LabeledInput 
        isSearchable={true}
        validationResponse={validateColorOption(orderForm.colors[index])}
        name={"color" + index}
        onChange={(option) => {
          if (option.disabled) return;
          delete option.disabled;
          dispatch(updateColor(index, option, quantity));
        }}
        options={filteredColorOptions}
        text="Color"
        type="Select"
        showRecordColor={true}
        value={orderForm.colors[index] && orderForm.colors[index].color}
      />
      <ColorQuantityContainer>
        <LabeledInput
          isDisabled={orderForm.colors.length === 1}
          validationResponse={validateColorQuantity(orderForm.colors[index])}
          max={maximumQuantity}
          min={minimumQuantity}
          name="colorQuantity"
          onChange={(event) => {
            const value = parseInt(event.target.value, 10);
            // check if the total quantity matches all colors' quantities
            const totalColorsQuantity = orderForm.colors.reduce((acc, color) => acc + color.quantity, 0);
            // if it does, then we can mutate the total quantity
            if (totalColorsQuantity === orderForm.totalQuantity) {
              // if we are adding, then we need to check if we're not exceeding the maximum quantity
              if (value > quantity && (orderForm.totalQuantity + value - quantity) <= maximumQuantity) {
                dispatch(updateOrderForm({ totalQuantity: orderForm.totalQuantity + value - quantity }));
              } else if (value < quantity && (orderForm.totalQuantity + value - quantity) >= minimumQuantity) {
                dispatch(updateOrderForm({ totalQuantity: orderForm.totalQuantity + value - quantity }));
              }
            }
            dispatch(updateColor(index, orderForm.colors[index].color, value));
          }}
          step={quantityFactor}
          text="Quantity"
          type="number"
          value={quantity}
        />
        { orderForm.colors.length > 1 && !isPackageLocked(orderForm) &&
          <DeleteColorColumn>
            <RedXButton 
              onClick={() => {
                // check if the total quantity matches all colors' quantities
                const totalColorsQuantity = orderForm.colors.reduce((acc, color) => acc + color.quantity, 0);
                // if it does, then we can mutate the color quantities
                if (totalColorsQuantity === orderForm.totalQuantity) {
                  // Remove this color's amount from the total quantity
                  dispatch(updateOrderFormField('totalQuantity', Math.max(orderForm.totalQuantity - quantity, minimumQuantity)));
                }
                dispatch(removeColor(index));
              }}
            />
          </DeleteColorColumn>
        }
      </ColorQuantityContainer>
    </ColorContainer>
  );
}

export default ColorAndQuantity;

export {
  getAvailableColors,
  ColorAndQuantity as Colors
};
