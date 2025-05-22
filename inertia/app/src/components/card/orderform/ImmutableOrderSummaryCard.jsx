import React from "react";
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

const ImmutableOrderSummaryCard = ({
  bandName,
  albumTitle,
  catalogNumber,
  albumType,
  weight,
  totalQuantity,
  testPresses,
  colors,
  centerLabel,
  outerPackaging,
  insertOptions,
  polybag,
  assemblyOption,
}) => (
  <StyledImmutableOrderSummaryCard
    showContinueButton={false}
    showQuoteButton={false}
    title={"Order Details"}
  >
    <CardContent>
      <LineItem>
        <span>Band Name</span>
        <span>{bandName}</span>
      </LineItem>
      <LineItem>
        <span>Album Title</span>
        <span>{albumTitle}</span>
      </LineItem>
      <LineItem>
        <span>Catalog Number</span>
        <span>{catalogNumber}</span>
      </LineItem>
      <LineItem>
        <span>Album Type</span>
        <span>{albumType}</span>
      </LineItem>
      <LineItem>
        <span>Weight</span>
        <span>{weight}</span>
      </LineItem>
      <LineItem>
        <span>Total Quantity</span>
        <span>{totalQuantity}</span>
      </LineItem>
      <LineItem>
        <span>Test Presses</span>
        <span>{testPresses}</span>
      </LineItem>
      <LineItem>
        <span>Colors</span>
        <span>{colors}</span>
      </LineItem>
      <LineItem>
        <span>Center Label</span>
        <span>{centerLabel}</span>
      </LineItem>
      <LineItem>
        <span>Outer Packaging</span>
        <span>{outerPackaging}</span>
      </LineItem>
      <LineItem>
        <span>Insert Options</span>
        <span>{insertOptions}</span>
      </LineItem>
      <LineItem>
        <span>Polybag</span>
        <span>{polybag}</span>
      </LineItem>
      <LineItem>
        <span>Assembly Option</span>
        <span>{assemblyOption}</span>
      </LineItem>
    </CardContent>
  </StyledImmutableOrderSummaryCard>
);

export default ImmutableOrderSummaryCard;