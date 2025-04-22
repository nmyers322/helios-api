import React from "react";
import CheckoutCard from "./CheckoutCard";
import styled from "styled-components";
import { bandNameName } from "../../form/orderform/BandName";
import { albumTitleName } from "../../form/orderform/AlbumTitle";
import { catalogNumberLabel, catalogNumberName } from "../../form/orderform/CatalogNumber";
import { getAllColors, getLineItem, getLineItemMetaData, getOrderMetaData, isDoubleLP } from "../../../modules/orders";
import { weightName } from "../../form/orderform/Weight";
import { totalQuantityLabel, totalQuantityName } from "../../form/orderform/TotalQuantity";
import { testPressesLabel, testPressesName, testPressSetupFeeDoubleLPLabel, testPressSetupFeeDoubleLPName, testPressSetupFeeSingleLPLabel, testPressSetupFeeSingleLPName } from "../../form/orderform/TestPresses";
import { centerLabelName, centerLabelOptions } from "../../form/orderform/CenterLabel";
import { outerPackagingTypeName, outerPackagingTypeOptions } from "../../form/orderform/OuterPackagingType";
import { insertTypeName, insertTypeOptions } from "../../form/orderform/InsertType";
import { outerPackagingPrintName, outerPackagingPrintOptions } from "../../form/orderform/OuterPackagingPrint";
import { outerPackagingFinishName, outerPackagingFinishOptions } from "../../form/orderform/OuterPackagingFinish";
import { assemblyOptionName, assemblyOptionOptions } from "../../form/orderform/AssemblyOption";
import { insertPrintName, insertPrintOptions } from "../../form/orderform/InsertPrint";
import { insertFinishName, insertFinishOptions } from "../../form/orderform/InsertFinish";
import { polybagName, PolybagOptions } from "../../form/orderform/Polybag";
import { albumTypeName } from "../../form/orderform/AlbumType";
import { innersleeveName, innersleeveOptions } from "../../form/orderform/Innersleeve";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 1rem 0;
`;

const Section = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1.6rem;
`;

const SectionTitle = styled.div`
    font-size: 1.3rem;
    margin-bottom: 0.9rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

const SectionContents = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 0.3rem;
`;

const LeftColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    box-sizing: border-box;
    padding-left: 1rem;
    max-width: 75%;
`;

const RightColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    height: 100%;
    box-sizing: border-box;
`;

const DetailsLarge = styled(SectionContents)`
    @media (max-width: 40rem) {
        display: none;
    }
`;

const DetailsSmall = styled.div`
    display: none;

    @media (max-width: 40rem) {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        box-sizing: border-box;
        padding-left: 1rem;
    }
`;

const Item = styled.div`
    font-size: 1.2rem;
    margin-bottom: 0.2rem;
`;

const CompletedOrderDetailsCard = ({
  className = "",
  order = {}
}) => {
  const orderType = getLineItemMetaData(getLineItem("orderType", order), "orderType");
  const weight = getLineItemMetaData(getLineItem(weightName, order), weightName);
  const colors = getAllColors(order);
  const centerLabelLineItem = getLineItem(centerLabelName, order);
  const innersleeveLineItem = getLineItem(innersleeveName, order);
  const outerPackagingLineItem = getLineItem("outerPackaging", order);
  const outerPackagingType = getLineItemMetaData(outerPackagingLineItem, outerPackagingTypeName);
  const insertLineItem = getLineItem("insert", order);
  const insertType = getLineItemMetaData(insertLineItem, insertTypeName);

  return (
    <CheckoutCard
      className={className}
      title="Order Summary"
    >
        <Container>
            <Section>
                <DetailsLarge>
                    <Row>
                        <LeftColumn>
                            <Item>{getOrderMetaData(bandNameName, order)} - {getOrderMetaData(albumTitleName, order)}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>Order #{order.number}</Item>
                        </RightColumn>
                    </Row>
                    <Row>
                        <LeftColumn>
                            <Item>{catalogNumberLabel}: {getOrderMetaData(catalogNumberName, order)}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>{orderType} {isDoubleLP(order) ? "Double LP" : "Single LP"}</Item>
                        </RightColumn>
                    </Row>
                    <Row>
                        <LeftColumn>
                        </LeftColumn>
                        <RightColumn>
                            <Item>{totalQuantityLabel}: {getLineItem(totalQuantityName, order)?.quantity}</Item>
                        </RightColumn>
                    </Row>
                </DetailsLarge>
                <DetailsSmall>
                    <Item>Order #{order.number}</Item>
                    <Item>{getOrderMetaData(bandNameName, order)} - {getOrderMetaData(albumTitleName, order)}</Item>
                    <Item>{catalogNumberLabel}: {getOrderMetaData(catalogNumberName, order)}</Item>
                    <Item>{orderType} {isDoubleLP(order) ? "Double LP" : "Single LP"}</Item>
                    <Item>{totalQuantityLabel}: {getLineItem(totalQuantityName, order)?.quantity}</Item>
                </DetailsSmall>
            </Section>
            <Section>
                <SectionTitle>Setup and Test Presses</SectionTitle>
                <SectionContents>
                    { orderType === "12-inch" && <Row>
                        <LeftColumn>
                            {orderType === "12-inch" && <Item>12-inch base fee {isDoubleLP(order) && "(x2)"}</Item>}
                        </LeftColumn>
                        <RightColumn>
                            {orderType === "12-inch" && <Item>${getLineItem(albumTypeName, order)?.total}</Item>}
                        </RightColumn>
                    </Row> }
                    <Row>
                        <LeftColumn>
                            <Item>{ isDoubleLP(order) 
                                ? testPressSetupFeeDoubleLPLabel 
                                : testPressSetupFeeSingleLPLabel }</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${ getLineItem(isDoubleLP(order) 
                                ? testPressSetupFeeDoubleLPName 
                                : testPressSetupFeeSingleLPName, order)?.total }</Item>
                        </RightColumn>
                    </Row>
                    <Row>
                        <LeftColumn>
                            <Item>{getLineItem(testPressesName, order)?.quantity} {testPressesLabel}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${getLineItem(testPressesName, order)?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Weight</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>{weight}</Item>
                        </LeftColumn>
                        <RightColumn>
                            {weight === "180g" && <Item>${getLineItem(weightName, order)?.total}</Item>}
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Quantities and Colors</SectionTitle>
                <SectionContents>
                    { colors && colors.map(color => <Row key={color.name + "-row"}>
                        <LeftColumn>
                        <Item key={"order-details-color-"+color.name?.replace(" ", "-")}>
                            {color.quantity} {color.name}
                        </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item key={"order-details-color-"+color.name?.replace(" ", "-")+"-total"}>
                                ${color.total}
                            </Item>
                        </RightColumn>
                    </Row> ) }
                    { colors && colors.filter(color => color.baseFeeType === "color").map(color => <Row key={color.name + "-setup-fee-row"}>
                        <LeftColumn>
                            <Item key={"order-details-color-"+color.name?.replace(" ", "-")+"-setup-fee"}>
                                Color Setup Fee ({color.name}) 
                            </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item key={"order-details-color-"+color.name?.replace(" ", "-")+"-setup-fee"}>
                                ${getLineItem("colorSetupFee", order)?.price}
                            </Item>
                        </RightColumn>
                    </Row> ) }
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Center Labels</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>
                                Print: {centerLabelOptions.find(option => option.value === getLineItemMetaData(centerLabelLineItem, centerLabelName))?.label}
                            </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${centerLabelLineItem?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Innersleeve</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>
                                Type: {innersleeveOptions.find(option => option.value === getLineItemMetaData(innersleeveLineItem, innersleeveName))?.label}
                            </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${innersleeveLineItem?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Outer Packaging</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>
                                {outerPackagingTypeOptions.find(option => option.value === outerPackagingType)?.label}
                            </Item>
                            { outerPackagingType !== "customerSupplied" && outerPackagingType !== "none" && 
                                <Item>
                                    Print: {outerPackagingPrintOptions.find(option => option.value === getLineItemMetaData(outerPackagingLineItem, outerPackagingPrintName))?.label}
                                </Item>
                            }
                            { outerPackagingType !== "customerSupplied" && outerPackagingType !== "none" &&
                                <Item>
                                    Finish: {outerPackagingFinishOptions.find(option => option.value === getLineItemMetaData(outerPackagingLineItem,outerPackagingFinishName))?.label}
                                </Item> 
                            }
                        </LeftColumn>
                        <RightColumn>
                            <Item>${getLineItem("outerPackaging", order)?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Insert</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>{insertTypeOptions.find(option => option.value === insertType)?.label}</Item>
                            { insertType !== "customerSupplied" && insertType !== "none" && 
                                <Item>Print: {insertPrintOptions.find(option => option.value === getLineItemMetaData(insertLineItem, insertPrintName))?.label}</Item>
                            }
                            { insertType !== "customerSupplied" && insertType !== "none" && 
                                <Item>Finish: {insertFinishOptions.find(option => option.value === getLineItemMetaData(insertLineItem, insertFinishName))?.label}</Item>
                            }
                        </LeftColumn>
                        <RightColumn>
                            <Item>${insertLineItem?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Assembly</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>{PolybagOptions.find(option => option.value === getLineItemMetaData(getLineItem(polybagName, order), polybagName))?.label}</Item>
                            <Item>{assemblyOptionOptions.find(option => option.value === getLineItemMetaData(getLineItem(assemblyOptionName, order), assemblyOptionName))?.label}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${getLineItem(polybagName, order)?.total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Shipping</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>via {order?.shipping_lines?.[0]?.method_title}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${order?.shipping_total}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Total<div>${order?.total}</div></SectionTitle>
            </Section>
        </Container>
    </CheckoutCard>
  );
};

export default CompletedOrderDetailsCard;
