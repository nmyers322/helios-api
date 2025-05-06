import React, { useState } from "react";
import OrderFormCard from "../orderform/OrderFormCard";
import Phone, { phoneName } from "../../form/account/Phone";
import FirstName, { firstNameName } from "../../form/account/FirstName";
import LastName, { lastNameName } from "../../form/account/LastName";
import City from "../../form/account/City";
import Company, { companyName } from "../../form/account/Company";
import State from "../../form/account/State";
import Modal from "../../main/Modal";
import { useDispatch, useSelector } from "react-redux";
import LabeledSpinner from "../../main/LabeledSpinner";
import { customerShippingAddressIsEmpty, customerShippingAndBillingAddressesAreEqual, validateAddress1, validateBillingAddressCard } from "../../../modules/accountValidation";
import Address1 from "../../form/account/Address1";
import Address2 from "../../form/account/Address2";
import Postcode from "../../form/account/Postcode";
import Country from "../../form/account/Country";
import { FormInputRow, FormInputRowSpacer } from "../../../styles/Form";
import { updateCustomerField } from "../../../actions/customerActions";
import { useNavigate } from "react-router-dom";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { shippingSameAsBillingName } from "../../form/account/ShippingSameAsBilling";
import { buildShippingAddressFromBillingAddress, updateShippingAddressForm } from "../../../actions/shippingAddressActions";
import { buildBillingAddressFromForm } from "../../../actions/billingAddressActions";
import { updateAddress, updateMyUser } from "../../../modules/heliosApi";


const BillingAddress = ({
  className = "",
}) => {
  const billingAddressForm = useSelector((state) => state.billingAddressForm);
  const customer = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [callComplete, setCallComplete] = useState(false);
  const [modalMessage, setModalMessage] = useState("Populating user data...");
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  const onSubmit = async () => {
    let newBillingAddress = buildBillingAddressFromForm(billingAddressForm);
    setModalMessage("Saving your billing address...");
    setShowLoadingModal(true);
    updateMyUser({
      firstName: billingAddressForm[firstNameName],
      lastName: billingAddressForm[lastNameName],
      phone: billingAddressForm[phoneName],
      company: billingAddressForm[companyName]
    }).then(() => {
      return updateAddress({
        type: "billing",
        ...newBillingAddress
      });
    }).then(() => {
      dispatch(updateCustomerField("billing", [newBillingAddress]));
      dispatch(updateOrderFormField("billing", newBillingAddress));
      if (customerShippingAddressIsEmpty(customer) || customerShippingAndBillingAddressesAreEqual(customer)) {
        dispatch(updateOrderFormField(shippingSameAsBillingName, true));
        let newShippingAddress = buildShippingAddressFromBillingAddress(newBillingAddress);
        dispatch(updateShippingAddressForm(newShippingAddress));
      } else {
        // User has a shipping address, and it's not the same as billing
        dispatch(updateOrderFormField(shippingSameAsBillingName, false));
        dispatch(updateShippingAddressForm(customer?.shipping?.[0]));
      }
      setCallComplete(true);
      setShowLoadingModal(false);
      navigate("/account/shipping-address");
    });
  };

  return (
    <OrderFormCard
      className={className}
      disabled={!validateBillingAddressCard(billingAddressForm).isValid || showLoadingModal || customer?.fetching}
      onSubmit={onSubmit}
      shouldUpdateOrder={false}
      showQuoteButton={false}
      title="Billing Address"
    >
      <FormInputRow>
        <FirstName isDisabled={customer?.fetching} />
        <FormInputRowSpacer />
        <LastName isDisabled={customer?.fetching} />
      </FormInputRow>
      <Company isDisabled={customer?.fetching} />
      <Phone isDisabled={customer?.fetching} />
      <Address1 isDisabled={customer?.fetching} />
      <Address2 isDisabled={customer?.fetching || !validateAddress1(billingAddressForm).isValid} />
      <City isDisabled={customer?.fetching || !validateAddress1(billingAddressForm).isValid} />
      <FormInputRow>
        <State isDisabled={customer?.fetching || !validateAddress1(billingAddressForm).isValid} />
        <FormInputRowSpacer />
        <Postcode isDisabled={customer?.fetching || !validateAddress1(billingAddressForm).isValid} />
      </FormInputRow>
      <Country isDisabled={customer?.fetching || !validateAddress1(billingAddressForm).isValid} />
      { showLoadingModal && 
        <Modal>
          { !callComplete &&
            <LabeledSpinner text={modalMessage} />
          }
          { callComplete &&
            <div>
              <h3>Billing Details Saved!</h3>
            </div>
          }
        </Modal>
      }
      
    </OrderFormCard>
  );
};

export default BillingAddress;
