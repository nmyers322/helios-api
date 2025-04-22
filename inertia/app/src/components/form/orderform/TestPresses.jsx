import React from "react";
import LabeledInput from "../main/LabeledInput";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { useDispatch, useSelector } from "react-redux";
import { validateTestPresses, validateTotalQuantity, validateWeight } from "../../../modules/orderFormValidation";

export const minimumTestPresses = 5;
export const maximumTestPresses = 30;

export const testPressesName = "testPresses";
export const testPressesLabel = "Test Presses";
export const testPressSetupFeeSingleLPName = "testPressSetupFeeSingleLP";
export const testPressSetupFeeSingleLPLabel = "Test Press Setup Fee (Single LP)";
export const testPressSetupFeeDoubleLPName = "testPressSetupFeeDoubleLP";
export const testPressSetupFeeDoubleLPLabel = "Test Press Setup Fee (Double LP)";

export const TestPresses = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      isDisabled={!validateWeight(orderForm) || !validateTotalQuantity(orderForm)}
      validationResponse={validateTestPresses(orderForm)}
      min={minimumTestPresses}
      max={maximumTestPresses}
      name={testPressesName}
      onChange={(event) => dispatch(updateOrderFormField(testPressesName, parseInt(event.target.value, 10)))}
      text={testPressesLabel}
      type="number"
      value={orderForm.testPresses}
    />
  );
}

export default TestPresses;