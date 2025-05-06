import React, { useEffect, useState } from "react";
import OrderFormCard from "../orderform/OrderFormCard";
import FirstName from "../../form/account/FirstName";
import LastName from "../../form/account/LastName";
import City from "../../form/account/City";
import State from "../../form/account/State";
import Modal from "../../main/Modal";
import { useDispatch, useSelector } from "react-redux";
import LabeledSpinner from "../../main/LabeledSpinner";
import { validateAddress1, validateShippingAddressCard } from "../../../modules/accountValidation";
import Address1 from "../../form/account/Address1";
import Address2 from "../../form/account/Address2";
import Postcode from "../../form/account/Postcode";
import Country from "../../form/account/Country";
import { FormInputColumnSpacer, FormInputRow, FormInputRowSpacer } from "../../../styles/Form";
import ShippingSameAsBilling from "../../form/account/ShippingSameAsBilling";
import { camelCaseToSnakeCaseAllObjectKeys } from "../../../modules/serialization";
import { updateCustomer } from "../../../modules/wordpressApi";
import { buildShippingAddressFromForm } from "../../../actions/shippingAddressActions";
import { updateAddress } from "../../../modules/heliosApi";
import { useGoTo } from "../../../modules/links";
import { useNavigate } from "react-router-dom";
import { updateCustomerField } from "../../../actions/customerActions";
import { updateOrderFormField } from "../../../actions/orderFormActions";

const ShippingAddress = ({
  className = "",
}) => {
  const customer = useSelector((state) => state.customer);
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  const goTo = useGoTo(useNavigate());
  const shippingAddressForm = useSelector((state) => state.shippingAddressForm);
  const fieldsAreDisabled = orderForm?.shippingSameAsBilling || customer?.fetching || false;
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Populating user data...");

  const onSubmit = async () => {
    let newShippingAddress = buildShippingAddressFromForm(shippingAddressForm);
    setModalMessage("Saving your shipping address...");
    setShowLoadingModal(true);
    updateAddress({
      type: "shipping",
      ...newShippingAddress
    }).then(() => {
      dispatch(updateCustomerField("shipping", [newShippingAddress]));
      dispatch(updateOrderFormField("shipping", newShippingAddress));
      goTo("/checkout");
    });
  }

  return (
    <OrderFormCard
      className={className}
      disabled={!validateShippingAddressCard(shippingAddressForm).isValid || showLoadingModal || customer?.fetching}
      onSubmit={onSubmit}
      shouldUpdateOrder={false}
      showQuoteButton={false}
      title="Shipping Address"
    >
      <ShippingSameAsBilling />
      <FormInputColumnSpacer />
      <FormInputRow>
        <FirstName isDisabled={fieldsAreDisabled} addressType="shipping" />
        <FormInputRowSpacer />
        <LastName isDisabled={fieldsAreDisabled} addressType="shipping" />
      </FormInputRow>
      <Address1 isDisabled={fieldsAreDisabled} addressType="shipping" />
      <Address2 isDisabled={fieldsAreDisabled || !validateAddress1(shippingAddressForm)} addressType="shipping" />
      <City isDisabled={fieldsAreDisabled || !validateAddress1(shippingAddressForm)} addressType="shipping" />
      <FormInputRow>
        <State isDisabled={fieldsAreDisabled || !validateAddress1(shippingAddressForm)} addressType="shipping" />
        <FormInputRowSpacer />
        <Postcode isDisabled={fieldsAreDisabled || !validateAddress1(shippingAddressForm)} addressType="shipping" />
      </FormInputRow>
      <Country isDisabled={fieldsAreDisabled || !validateAddress1(shippingAddressForm)} addressType="shipping" />
      { showLoadingModal && 
        <Modal>
          <LabeledSpinner text={modalMessage} />
        </Modal>
      }
      
    </OrderFormCard>
  );
};

export default ShippingAddress;
