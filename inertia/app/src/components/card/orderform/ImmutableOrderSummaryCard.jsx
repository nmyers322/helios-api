import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import OrderFormCard from "./OrderFormCard";

const StyledImmutableOrderSummaryCard = styled(OrderFormCard)`
  width: calc(100% - 6rem);
`;

const CardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const LineItem = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;

  span {
    width: 50%;
    text-align: left;
  }

  span:first-child {
    font-weight: bold;
  }

  span:last-child {
    font-size: 1rem;
  }
`;

const ImmutableOrderSummaryCard = () => {
  const orderForm = useSelector((state) => state.orderForm);

  const generateOuterPackagingText = () => {
    let text = "";
    if (orderForm.outerPackagingType) {
      text += orderForm.outerPackagingType.label;
    }
    if (orderForm.outerPackagingPrint) {
      text += ", " + orderForm.outerPackagingPrint.label;
    }
    if (orderForm.outerPackagingFinish) {
      text += ", " + orderForm.outerPackagingFinish.label;
    }
    return text;
  }

  const generateInsertText = () => {
    let text = "";
    if (orderForm.insertType) {
      text += orderForm.insertType.label;
    }
    if (orderForm.insertPrint) {
      text += ", " + orderForm.insertPrint.label;
    }
    if (orderForm.insertFinish) {
      text += ", " + orderForm.insertFinish.label;
    }
    return text;
  }

  return (
    <StyledImmutableOrderSummaryCard
      showContinueButton={false}
      showQuoteButton={false}
      title={"Order Details"}>
      <CardContent>
        <LineItem>
          <span>Band Name</span>
          <span>{orderForm["bandName"]}</span>
        </LineItem>
        <LineItem>
          <span>Album Title</span>
          <span>{orderForm["albumTitle"]}</span>
        </LineItem>
        <LineItem>
          <span>Catalog Number</span>
          <span>{orderForm["catalogNumber"]}</span>
        </LineItem>
        <LineItem>
          <span>Album Type</span>
          <span>{orderForm["albumType"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Weight</span>
          <span>{orderForm["weight"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Total Quantity</span>
          <span>{orderForm["totalQuantity"]}</span>
        </LineItem>
        <LineItem>
          <span>Test Presses</span>
          <span>{orderForm["testPresses"]}</span>
        </LineItem>
        <LineItem>
          <span>Colors</span>
          <span>{
            orderForm["colors"]?.map(color => color.quantity + " " + color.color.label).join(", ")
          }</span>
        </LineItem>
        <LineItem>
          <span>Center Label</span>
          <span>{orderForm["centerLabel"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Outer Packaging</span>
          <span>{generateOuterPackagingText()}</span>
        </LineItem>
        <LineItem>
          <span>Insert Options</span>
          <span>{generateInsertText()}</span>
        </LineItem>
        <LineItem>
          <span>Polybag</span>
          <span>{orderForm["polybag"]?.label}</span>
        </LineItem>
        <LineItem>
          <span>Assembly Option</span>
          <span>{orderForm["assemblyOption"]?.label}</span>
        </LineItem>
      </CardContent>
      
    </StyledImmutableOrderSummaryCard>
  );
};

export default ImmutableOrderSummaryCard;
