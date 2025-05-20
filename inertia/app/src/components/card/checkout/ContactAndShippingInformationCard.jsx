import { useEffect, useState } from "react";
import CheckoutCard from "./CheckoutCard";
import { useSelector } from "react-redux";
import { getCountryFromCode, parseAddressIntoCityStateZip, parseAddressIntoFullName, parseAddressIntoStreetAddress } from "../../../modules/serialization";
import { FormInputColumnSpacer } from "../../../styles/Form";
import styled from "styled-components";
import { valueIsEmpty } from "../../../modules/validation";
import { heliosLogger } from "../../../modules/logging";

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const AddressLine = styled.p`
  margin-top: 0.15rem;
  margin-bottom: 0rem;
  padding-left: 1rem;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const OrderContactCard = ({
  className = "",
  disabled = false,
  isEditable = false,
  orderNumber = null
}) => {
  const orderForm = useSelector((state) => state.orderForm);
  const orders = useSelector((state) => state.orders);
  let [billing, setBilling] = useState({});
  let [shipping, setShipping] = useState({});

  useEffect(() => {
    let order = orders?.orders[orderNumber];
    if (valueIsEmpty(order)) {
      if (orderForm && orderForm.billing) {
        setBilling(orderForm.billing);
      }
      if (orderForm && orderForm.shipping) {
        setShipping(orderForm.shipping);
      }
    } else {
      if (!valueIsEmpty(order.billingAddress)) {
        setBilling(order.billingAddress);
      }
      if (!valueIsEmpty(order.shippingAddress)) {
        setShipping(order.shippingAddress);
      }
    }
  }, [orderForm, orders, orderNumber]);

  return (
    <CheckoutCard
      className={className}
      disabled={disabled}
      title="Contact and Shipping Information"
    >
      { billing?.company && <OneLine><Title>Company Name:</Title><AddressLine>{billing.company} { isEditable && <a href="/account/billing-address">(Edit)</a> }</AddressLine></OneLine> }
      <Title>Billing Address: { isEditable && <a href="/account/billing-address">(Edit)</a> }</Title>
      <AddressLine>{billing && parseAddressIntoFullName(billing)}</AddressLine>
      <AddressLine>{billing && parseAddressIntoStreetAddress(billing)}</AddressLine>
      <AddressLine>{billing && parseAddressIntoCityStateZip(billing)}</AddressLine>
      { billing && billing.country && <AddressLine>{getCountryFromCode(billing.country)}</AddressLine> }
      <FormInputColumnSpacer />
      <Title>Shipping Address: { isEditable && <a href="/account/shipping-address">(Edit)</a> }</Title>
      <AddressLine>{shipping && parseAddressIntoFullName(shipping)}</AddressLine>
      <AddressLine>{shipping && parseAddressIntoStreetAddress(shipping)}</AddressLine>
      <AddressLine>{shipping && parseAddressIntoCityStateZip(shipping)}</AddressLine>
      { shipping && shipping.country && <AddressLine>{getCountryFromCode(shipping.country)}</AddressLine> }
      <FormInputColumnSpacer />
      { billing?.phone && <OneLine><Title>Phone number:</Title><AddressLine>{billing.phone} { isEditable && <a href="/account/billing-address">(Edit)</a> }</AddressLine></OneLine> }
    </CheckoutCard>
  );
};

export default OrderContactCard;
