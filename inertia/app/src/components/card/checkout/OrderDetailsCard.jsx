import React from "react";
import CheckoutCard from "./CheckoutCard";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { bandNameLabel, bandNameName } from "../../form/orderform/BandName";
import { albumTitleLabel, albumTitleName } from "../../form/orderform/AlbumTitle";
import { catalogNumberLabel, catalogNumberName } from "../../form/orderform/CatalogNumber";
import { albumTypeLabel, albumTypeName } from "../../form/orderform/AlbumType";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 1rem 0;
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
`;

const ItemTitle = styled.div`
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.2rem;
`;

const Item = styled.div`
    font-size: 1rem;
    margin-bottom: 0.2rem;
`;

const OrderDetailsCard = ({
  className = "",
  disabled = false
}) => {
  const orderForm = useSelector((state) => state.orderForm);

  return (
    <CheckoutCard
      className={className}
      disabled={disabled}
      title="Order Details"
    >
        <Container>
            <LeftColumn>
                <ItemTitle>{bandNameLabel}</ItemTitle>
                <ItemTitle>{albumTitleLabel}</ItemTitle>
                <ItemTitle>{catalogNumberLabel}</ItemTitle>
                <ItemTitle>{albumTypeLabel}</ItemTitle>
            </LeftColumn>
            <RightColumn>
                <Item>{orderForm[bandNameName]}</Item>
                <Item>{orderForm[albumTitleName]}</Item>
                <Item>{orderForm[catalogNumberName]}</Item>
                <Item>{orderForm[albumTypeName]?.label}</Item>
            </RightColumn>
        </Container>
    </CheckoutCard>
  );
};

export default OrderDetailsCard;
