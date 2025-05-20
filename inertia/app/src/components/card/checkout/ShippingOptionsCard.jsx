import React, { useEffect, useState } from "react";
import CheckoutCard from "./CheckoutCard";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import styled from "styled-components";
import LabeledSpinner from "../../main/LabeledSpinner";
import RadioSelector from "../../form/main/RadioSelector";
import { getShippingOptions } from "../../../modules/heliosApi";
import { selectShippingOption, setFetchingShippingOptions, setShippingOptions } from "../../../actions/shippingOptionsActions";
import ErrorText from "../../form/main/ErrorText";
import { calculateShippingCost, CUSTOM_FREIGHT_QUOTE_OPTION, IN_STORE_PICKUP_OPTION } from "../../../modules/shipping";
import { albumTypeName } from "../../form/orderform/AlbumType";
import { outerPackagingTypeName } from "../../form/orderform/OuterPackagingType";
import { totalQuantityName } from "../../form/orderform/TotalQuantity";
import { validateCompleteOrderForm } from "../../../modules/orderFormValidation";
import { validateAddress } from "../../../modules/accountValidation";

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Price = styled.p`
  margin-top: 0.1rem;
  margin-bottom: 0rem;
  padding-left: 1rem;
  margin-left: auto;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1rem;
  padding-right: 1rem;
  cursor: pointer;
  border: ${(props) => props.$isSelected ? `2px solid ${props.theme.colors.text}` : "2px solid transparent"};
`;

const ShippingOptionsCard = ({
  disabled = false,
}) => {
  const dispatch = useDispatch();
  const fetchingShippingOptions = useSelector((state) => state.shippingOptions.fetching);
  const shippingOptions = useSelector((state) => state.shippingOptions.shippingOptions);
  const orderForm = useSelector((state) => state.orderForm);
  const selectedShippingOption = useSelector((state) => state.shippingOptions.selectedOption);
  const shippingAddress = useSelector((state) => state.orderForm.shipping);
  const [firstLoad, setFirstLoad] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadShippingOptions() {
      dispatch(setFetchingShippingOptions(true));
      let shippingOptions = await getShippingOptions({
        shippingAddress,
        albumType: orderForm[albumTypeName]?.value,
        packagingType: orderForm[outerPackagingTypeName]?.value,
        totalQuantity: orderForm[totalQuantityName]
      });
      if (shippingOptions?.data?.shippingOptions) {
        dispatch(setShippingOptions(shippingOptions.data.shippingOptions));
        dispatch(selectShippingOption(shippingOptions.data.shippingOptions[0]));
      } else {
        setErrorText("Error fetching shipping options. Please try again later or contact support at contact@heliospressing.com.");
      }
      dispatch(setFetchingShippingOptions(false));
    };
    if (firstLoad && validateCompleteOrderForm(orderForm).isValid && validateAddress(shippingAddress, "shipping").isValid) {
      setFirstLoad(false);
      loadShippingOptions();
    }
  }
  , [firstLoad, dispatch, shippingAddress, orderForm]);

  return (
    <CheckoutCard
      disabled={disabled}
      title={"Shipping Options"}
      subtitle={shippingAddress?.postcode && `Shipping to ${shippingAddress.postcode}`}
    >
      { !fetchingShippingOptions && shippingOptions.map((option) => (
        <OneLine key={option.serviceCode} $isSelected={option.serviceCode === selectedShippingOption?.serviceCode}
          onClick={() => {
            dispatch(selectShippingOption(option));
            dispatch(updateOrderFormField("shippingOption", option));
          }}>
          <RadioSelector 
            checked={option.serviceCode === selectedShippingOption?.serviceCode}
            name={option.serviceName} />
          <Title>
            {option.serviceName}
          </Title>
          <Price>
            { option.serviceCode === IN_STORE_PICKUP_OPTION.serviceCode ?
              "Free" : option.serviceCode === CUSTOM_FREIGHT_QUOTE_OPTION.serviceCode ?
              "Quoted and Invoiced Separately" : option.shipmentCost === 0 ?
              "Free" : "$" + calculateShippingCost(option) }
          </Price>
        </OneLine>
      ))}
      { errorText && <ErrorText text={errorText} /> }
      { fetchingShippingOptions &&
        <LabeledSpinner text="Fetching shipping options..." />
      }
    </CheckoutCard>
  );
};

export default ShippingOptionsCard;
