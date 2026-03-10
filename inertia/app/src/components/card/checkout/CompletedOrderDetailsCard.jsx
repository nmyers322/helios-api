import React from "react";
import CheckoutCard from "./CheckoutCard";
import styled from "styled-components";
import { bandNameName } from "../../form/orderform/BandName";
import { albumTitleName } from "../../form/orderform/AlbumTitle";
import { catalogNumberLabel, catalogNumberName } from "../../form/orderform/CatalogNumber";
import { getAllColors, getCartItem, getCartItemMetaData, getOrderMetaData, isDoubleLP } from "../../../modules/orders";
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
import { useSelector } from "react-redux";

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
  order = {},
  orderId = null
}) => {
  
    const orders = useSelector(state => state.orders.orders);
    if (orderId) {
        order = orders[orderId];
    };
  const orderType = getCartItemMetaData(getCartItem("orderType", order), "orderType");
  const weight = getCartItemMetaData(getCartItem(weightName, order), weightName);
  const colors = getAllColors(order);
  const centerLabelLineItem = getCartItem(centerLabelName, order);
  const innersleeveLineItem = getCartItem(innersleeveName, order);
  const outerPackagingLineItem = getCartItem("outerPackaging", order);
  const outerPackagingType = getCartItemMetaData(outerPackagingLineItem, outerPackagingTypeName);
  const insertLineItem = getCartItem("insert", order);
  const insertType = getCartItemMetaData(insertLineItem, insertTypeName);

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
                            <Item>Order #{order.id}</Item>
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
                            <Item>{totalQuantityLabel}: {getCartItem(totalQuantityName, order)?.quantity}</Item>
                        </RightColumn>
                    </Row>
                </DetailsLarge>
                <DetailsSmall>
                    <Item>Order #{order.id}</Item>
                    <Item>{getOrderMetaData(bandNameName, order)} - {getOrderMetaData(albumTitleName, order)}</Item>
                    <Item>{catalogNumberLabel}: {getOrderMetaData(catalogNumberName, order)}</Item>
                    <Item>{orderType} {isDoubleLP(order) ? "Double LP" : "Single LP"}</Item>
                    <Item>{totalQuantityLabel}: {getCartItem(totalQuantityName, order)?.quantity}</Item>
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
                            {orderType === "12-inch" && <Item>${getCartItem(albumTypeName, order)?.total?.toFixed(2)}</Item>}
                        </RightColumn>
                    </Row> }
                    <Row>
                        <LeftColumn>
                            <Item>{ isDoubleLP(order) 
                                ? testPressSetupFeeDoubleLPLabel 
                                : testPressSetupFeeSingleLPLabel }</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${ getCartItem(isDoubleLP(order) 
                                ? testPressSetupFeeDoubleLPName 
                                : testPressSetupFeeSingleLPName, order)?.total?.toFixed(2) }</Item>
                        </RightColumn>
                    </Row>
                    <Row>
                        <LeftColumn>
                            <Item>{getCartItem(testPressesName, order)?.quantity} {testPressesLabel}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${getCartItem(testPressesName, order)?.total?.toFixed(2)}</Item>
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
                            <Item>${getCartItem(weightName, order)?.total?.toFixed(2)}</Item>
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
                                ${color.total?.toFixed(2)}
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
                                ${(total => total ? total / colors.filter(color => color.baseFeeType === "color").length : "")(getCartItem("colorSetupFee", order)?.total).toFixed(2)}
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
                                {centerLabelOptions.find(option => option.value === getCartItemMetaData(centerLabelLineItem, centerLabelName))?.label}
                            </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>{(total => total ? "$" + total : "")(centerLabelLineItem?.total?.toFixed(2))}</Item>
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
                                Type: {innersleeveOptions.find(option => option.value === getCartItemMetaData(innersleeveLineItem, innersleeveName))?.label}
                            </Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${innersleeveLineItem?.total?.toFixed(2)}</Item>
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
                                    Print: {outerPackagingPrintOptions.find(option => option.value === getCartItemMetaData(outerPackagingLineItem, outerPackagingPrintName))?.label}
                                </Item>
                            }
                            { outerPackagingType !== "customerSupplied" && outerPackagingType !== "none" &&
                                <Item>
                                    Finish: {outerPackagingFinishOptions.find(option => option.value === getCartItemMetaData(outerPackagingLineItem,outerPackagingFinishName))?.label}
                                </Item> 
                            }
                        </LeftColumn>
                        <RightColumn>
                            <Item>{(total => total ? "$" + total : "")(getCartItem("outerPackaging", order)?.total?.toFixed(2))}</Item>
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
                                <Item>Print: {insertPrintOptions.find(option => option.value === getCartItemMetaData(insertLineItem, insertPrintName))?.label}</Item>
                            }
                            { insertType !== "customerSupplied" && insertType !== "none" && 
                                <Item>Finish: {insertFinishOptions.find(option => option.value === getCartItemMetaData(insertLineItem, insertFinishName))?.label}</Item>
                            }
                        </LeftColumn>
                        <RightColumn>
                            <Item>{(total => total ? "$" + total : "")(insertLineItem?.total?.toFixed(2))}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Assembly</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>{PolybagOptions.find(option => option.value === getCartItemMetaData(getCartItem(polybagName, order), polybagName))?.label}</Item>
                            <Item>{assemblyOptionOptions.find(option => option.value === getCartItemMetaData(getCartItem(assemblyOptionName, order), assemblyOptionName))?.label}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>${getCartItem(polybagName, order)?.total?.toFixed(2)}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            <Section>
                <SectionTitle>Shipping</SectionTitle>
                <SectionContents>
                    <Row>
                        <LeftColumn>
                            <Item>via {order?.selectedShippingOption?.serviceName}</Item>
                        </LeftColumn>
                        <RightColumn>
                            <Item>{(total => total && total !== 0 ? "$" + total.toFixed(2) : "")(order?.selectedShippingOption?.totalCost)}</Item>
                        </RightColumn>
                    </Row>
                </SectionContents>
            </Section>
            { order?.orderComment && (
                <Section>
                    <SectionTitle>Customer Comment</SectionTitle>
                    <SectionContents>
                        <Row>
                            <LeftColumn>
                                <Item>{order.orderComment}</Item>
                            </LeftColumn>
                        </Row>
                    </SectionContents>
                </Section>
            ) }
            <Section>
                <SectionTitle>Total<div>${order?.totalPrice}</div></SectionTitle>
            </Section>
        </Container>
    </CheckoutCard>
  );
};

export default CompletedOrderDetailsCard;
