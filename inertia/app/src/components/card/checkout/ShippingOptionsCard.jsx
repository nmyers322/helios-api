import React, { use, useEffect, useState } from "react";
import CheckoutCard from "./CheckoutCard";
import { useDispatch, useSelector } from "react-redux";
import { getCountryFromCode, parseAddressIntoCityStateZip, parseAddressIntoFullName, parseAddressIntoStreetAddress } from "../../../modules/serialization";
import { FormInputColumnSpacer } from "../../../styles/Form";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import styled from "styled-components";
import { valueIsEmpty } from "../../../modules/validation";
import Modal from "../../main/Modal";
import LabeledSpinner from "../../main/LabeledSpinner";
import RadioSelector from "../../form/main/RadioSelector";
import { getShippingOptions } from "../../../modules/heliosApi";
import { selectShippingOption, setFetchingShippingOptions, setShippingOptions } from "../../../actions/shippingOptionsActions";
import ErrorText from "../../form/main/ErrorText";
import { calculateShippingCost, CUSTOM_FREIGHT_QUOTE_OPTION, IN_STORE_PICKUP_OPTION } from "../../../modules/shipping";

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
        order: orderForm
      });
      if (shippingOptions?.data?.shippingOptions) {
        dispatch(setShippingOptions(shippingOptions.data.shippingOptions));
        dispatch(selectShippingOption(shippingOptions.data.shippingOptions[0].serviceCode));
      } else {
        setErrorText("Error fetching shipping options. Please try again later or contact support at <a href=\"mailto:contact@heliospressing.com\">contact@heliospressing.com</a>.");
      }
      dispatch(setFetchingShippingOptions(false));
    };
    if (firstLoad) {
      setFirstLoad(false);
      loadShippingOptions();
    }
  }
  , [firstLoad, dispatch]);

  return (
    <CheckoutCard
      disabled={disabled}
      title="Shipping Options"
    >
      { !fetchingShippingOptions && shippingOptions.map((option) => (
        <OneLine key={option.serviceCode} $isSelected={option.serviceCode === selectedShippingOption}
          onClick={() => {
            dispatch(selectShippingOption(option.serviceCode));
            dispatch(updateOrderFormField("shippingOption", option.serviceCode));
          }}>
          <RadioSelector 
            checked={option.serviceCode === selectedShippingOption}
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
