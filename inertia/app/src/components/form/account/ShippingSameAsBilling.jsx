import React from "react";
import LabeledCheckbox from "../main/LabeledCheckbox";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { buildShippingAddressFromBillingAddress, updateShippingAddressForm } from "../../../actions/shippingAddressActions";

const shippingSameAsBillingName = "shippingSameAsBilling";
const shippingSameAsBillingLabel = "Shipping address is the same as billing address";

const ShippingSameAsBilling = () => {
  const dispatch = useDispatch();
  const orderForm = useSelector((state) => state.orderForm);
  const customer = useSelector((state) => state.customer);
  let isChecked = orderForm?.shippingSameAsBilling || false;

  const handleCheckboxChange = (e) => {
    let checked = e.target.checked;
    dispatch(updateOrderFormField(shippingSameAsBillingName, checked));
    if (checked) {
        dispatch(updateShippingAddressForm(buildShippingAddressFromBillingAddress(customer?.billing[0])));
    }
  };

  return (
    <LabeledCheckbox
      name={shippingSameAsBillingName}
      onChange={handleCheckboxChange}
      text={shippingSameAsBillingLabel}
      checked={isChecked}
    />
  );
};

export default ShippingSameAsBilling;

export { shippingSameAsBillingName, shippingSameAsBillingLabel };