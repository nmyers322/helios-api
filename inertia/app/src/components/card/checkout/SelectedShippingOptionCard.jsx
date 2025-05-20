import CheckoutCard from "./CheckoutCard";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { calculateShippingCost, CUSTOM_FREIGHT_QUOTE_OPTION, IN_STORE_PICKUP_OPTION } from "../../../modules/shipping";
import { Link } from "react-router-dom";

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
  border: ${(props) => props.$isSelected ? `2px solid ${props.theme.colors.text}` : "2px solid transparent"};
`;

const SelectedShippingOptionCard = ({
}) => {
  const option = useSelector((state) => state.shippingOptions.selectedOption);
  const shippingAddress = useSelector((state) => state.orderForm.shipping);

  if (!option) {
    return (
      <CheckoutCard
        title={"Selected Shipping Option"}
        subtitle={shippingAddress?.postcode && `Shipping to ${shippingAddress.postcode}`}
      >
        <OneLine>
          <Title>
            No shipping option selected. <Link to="/checkout/shipping">Select a shipping option</Link>
          </Title>
        </OneLine>
      </CheckoutCard>
    );
  }
  return (
    <CheckoutCard
      title={"Selected Shipping Option"}
      subtitle={shippingAddress?.postcode && `Shipping to ${shippingAddress.postcode}`}
    >
      <OneLine>
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
    </CheckoutCard>
  );
};

export default SelectedShippingOptionCard;
