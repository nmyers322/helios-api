import React, { useEffect, useState } from "react";
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

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Price = styled.p`
  margin-top: 0.1rem;
  margin-bottom: 0rem;
  padding-left: 1rem;
`;

const OneLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  const fetchingShippingOptions = false;
  const shippingOptions = useSelector((state) => state.shippingOptions.shippingOptions);
  const selectedShippingOption = useSelector((state) => state.shippingOptions.selectedOption);
  const shippingAddress = useSelector((state) => state.orderForm.shipping);
  const [firstLoad, setFirstLoad] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadShippingOptions() {
      let shippingOptions = await getShippingOptions({
        shippingAddress,
        order: {}
      });
      if (shippingOptions?.data?.shippingOptions) {
        dispatch(setShippingOptions(shippingOptions.data.shippingOptions));
        setSelectedShippingOption(shippingOptions.data.shippingOptions[0].id);
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
      title="Contact and Shipping Information"
    >
      { !fetchingShippingOptions && shippingOptions.map((option) => (
        <OneLine key={option.id} $isSelected={option.id === selectedShippingOption}
          onClick={() => {
            dispatch(selectShippingOption(option.id));
            dispatch(updateOrderFormField("shippingOption", option.id));
          }}>
          <RadioSelector 
            checked={option.id === selectedShippingOption}
            name={option.name} />
          <Title>
            {option.name}
          </Title>
          <Price>${option.price.toFixed(2)}</Price>
        </OneLine>
      ))}
      { fetchingShippingOptions &&
        <LabeledSpinner text="Fetching shipping options..." />
      }
    </CheckoutCard>
  );
};

export default ShippingOptionsCard;
