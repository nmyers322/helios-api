import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { formatPrice, getColorOrBlackValue, getPrice } from '../../modules/products';
import { getColorLabel, getQuoteDisplayLines, getSelectedOptionLabel } from '../../modules/quoteDisplay';
import Spinner from '../main/Spinner';
import { isLocal } from '../../modules/environment';
import RedXButton from '../form/main/RedXButton';
import { updateOrderFormField } from '../../actions/orderFormActions';
import { calculateShippingCost, CUSTOM_FREIGHT_QUOTE_OPTION, IN_STORE_PICKUP_OPTION } from '../../modules/shipping';

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.sideBar.background};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 23rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 0.5rem;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  @media (max-width: 40rem) {
    width: calc(100% - 10rem);
    padding-right: 4rem;
    padding-left: 4rem;
    margin-top: 0;
    margin-right: 1rem;
    margin-left: 1rem;
    background-color: ${(props) => props.theme.colors.cardBackground};
  }
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 1rem 0 1rem 0;
  font-weight: bold;

  @media (max-width: 40rem) {
    display: flex;
    justify-content: flex-start;
  }
`;

const LineItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 0 1rem 0;
  border-top: 1px solid ${(props) => props.theme.colors.sideBar.invertedBorder};
  font-weight: bold;
`;

const LineItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 2rem);
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
`;

const LineItemPart = styled.div`
  padding-left: 1rem;
  padding-right: 0rem;
`;

const LineItemPartRight = styled.div`
  padding-left: 1rem;
  padding-right: 0rem;
  margin-left: auto;
  text-align: right;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  border-top: 1px solid ${(props) => props.theme.colors.sideBar.invertedBorder};
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 5rem;
  margin-bottom: 5rem;

  span {
    font-size: .8rem;
    padding-top: 1rem;
  }
`;

const CloseQuoteButton = styled(RedXButton)`
  display: none;

  @media (max-width: 69rem) {
    display: inline-flex;
    margin-left: 7rem;
  }
`;

const OrderSummarySidePanel = ({disabled}) => {
  const dispatch = useDispatch();
  const fetchingProductsOrVariations = useSelector(state => state.products.fetchingProductsOrVariations);
  const orderForm = useSelector(state => state.orderForm);
  const products = useSelector(state => state.products.products);
  const variations = useSelector(state => state.products.variations);
  const shippingOptions = useSelector(state => state.shippingOptions);
  const selectedShippingOption = shippingOptions.selectedOption;
  let memoedPrice = {};

  const [visibleSections, setVisibleSections] = useState({
  });

  const populated = () => 
    !!products && !!variations && products.length > 0;

  useEffect(() => {
    if (!!orderForm) {
      setVisibleSections({
        albumType: !!orderForm.albumType,
        weight: !!orderForm.weight,
        quantity: orderForm.totalQuantity > 0,
        colors: orderForm.colors.length > 0 && orderForm.totalQuantity > 0,
        testPresses: !!orderForm.testPresses,
        centerLabel: !!orderForm.centerLabel,
        innersleeve: !!orderForm.innersleeve,
        outerPackaging: !!orderForm.outerPackagingType,
        insert: !!orderForm.insertType,
        polybag: !!orderForm.polybag,
        assembly: !!orderForm.assemblyOption || orderForm.polybag,
        shipping: !!orderForm.albumType
      });
    }
  }, [orderForm]);

  const calculatePrice = (name, color) => {
    if (!populated()) {
      return 0;
    }
    if (color) {
      const memoKey = name + color?.color?.value;
      if (memoedPrice[memoKey]) {
        return memoedPrice[memoKey];
      }
      const price = getPrice(name, orderForm, products, variations, color);
      if (price) {
        memoedPrice[memoKey] = price;
        return price;
      }
      return 0;
    }
    if (memoedPrice[name]) {
      return memoedPrice[name];
    }
    const price = getPrice(name, orderForm, products, variations);
    if (price) {
      memoedPrice[name] = price;
      return price;
    }
    return 0;
  }

  const formatShippingPrice = (option) => {
    if (!option) {
      return "";
    }
    if (option.serviceCode === IN_STORE_PICKUP_OPTION.serviceCode) {
      return "Free";
    } else if (option.serviceCode === CUSTOM_FREIGHT_QUOTE_OPTION.serviceCode) {
      return "Quoted and Invoiced Separately";
    } else {
      const shippingPrice = calculateShippingCost(option);
      if (shippingPrice) {
        return formatPrice(shippingPrice);
      }
      return "Free";
    }
  }

  const getColorSetupFeeLabel = color => {
    if (!color.color) {
      return `(Undecided) Setup Fee`;
    }
    return `${color.color.label} Setup Fee`;
  }
  
  const getOuterPackagingOptions = () => {
    const outerPackagingType = getSelectedOptionLabel(orderForm, "outerPackagingType");
    const outerPackagingPrint = getSelectedOptionLabel(orderForm, "outerPackagingPrint");
    const outerPackagingFinish = getSelectedOptionLabel(orderForm, "outerPackagingFinish");
    let output = "";
    if (outerPackagingType) {
      output += outerPackagingType;
    }
    if (outerPackagingPrint) {
      output += `, ${outerPackagingPrint}`;
    }
    if (outerPackagingFinish) {
      output += `, ${outerPackagingFinish}`;
    }
    return output;
  }

  const getInsertOptions = () => {
    const insertType = getSelectedOptionLabel(orderForm, "insertType");
    const insertPrint = getSelectedOptionLabel(orderForm, "insertPrint");
    const insertFinish = getSelectedOptionLabel(orderForm, "insertFinish");
    let output = "";
    if (insertType) {
      output += insertType;
    }
    if (insertPrint) {
      output += `, ${insertPrint}`;
    }
    if (insertFinish) {
      output += `, ${insertFinish}`;
    }
    return output;
  }

  const shippingPriceValue = parseFloat(calculateShippingCost(selectedShippingOption) || 0) || 0;
  const quoteDisplay = getQuoteDisplayLines({
    weightLabel: getSelectedOptionLabel(orderForm, "weight"),
    weightTotal: calculatePrice("weight"),
    totalQuantity: orderForm.totalQuantity,
    colors: (orderForm.colors || []).map((color) => ({
      label: getColorLabel(orderForm, color),
      colorTotal: calculatePrice("color", color),
      quantity: color.quantity,
    })),
    otherPricedRows: [
      { key: "albumType", amount: calculatePrice("albumType") },
      { key: "testPresses", amount: calculatePrice("testPresses") },
      { key: "colorSetupFeeTotal", amount: calculatePrice("colorSetupFeeTotal") },
      { key: "centerLabel", amount: calculatePrice("centerLabel") },
      { key: "innersleeve", amount: calculatePrice("innersleeve") },
      { key: "outerPackaging", amount: calculatePrice("outerPackaging") },
      { key: "insert", amount: calculatePrice("insert") },
      { key: "polybag", amount: calculatePrice("polybag") },
    ],
    shippingAmount: shippingPriceValue,
  });

  const getFormattedTotalPrice = () => {
    if (isLocal()) {
      return "$100.00";
    }
    const total = quoteDisplay.grandTotal;
    return total === 0 ? "$0.00" : formatPrice(total);
  }

  return (   
    <Container disabled={disabled}>
      <Title>
        <h2>Order Summary</h2>
        { orderForm?.showQuoteOnMobile && 
          <CloseQuoteButton
            onClick={() => dispatch(updateOrderFormField("showQuoteOnMobile", false))}
          />
        }
      </Title>
      { fetchingProductsOrVariations && 
          <SpinnerContainer>
            <Spinner />
            <span>Loading Rates...</span>
          </SpinnerContainer>
      }
      { !fetchingProductsOrVariations && !!populated &&
      <>
        <LineItemTitle className={visibleSections.albumType ? "visible" : "invisible"}>
          Record Setup Fee
        </LineItemTitle>
        <LineItem className={visibleSections.albumType ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel(orderForm, "albumType")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("albumType"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.quantity ? "visible" : "invisible"}>
          Quantity/Colors - {getSelectedOptionLabel(orderForm, "totalQuantity")} Total
        </LineItemTitle>
        { quoteDisplay.colorLines.map((colorLine, index) => (
          <LineItem key={"colorQuantity"+index} className="visible">
            <LineItemPart>{colorLine.label}</LineItemPart>
            <LineItemPart>{formatPrice(colorLine.amount)}</LineItemPart>
          </LineItem>
        ))}
        { orderForm.colors && orderForm.colors.filter(color => getColorOrBlackValue(color) !== "black").map((color, index) => (
          <LineItem key={"colorSetupFee"+index} className="visible">
            <LineItemPart>{getColorSetupFeeLabel(color)}</LineItemPart>
            <LineItemPart>{formatPrice(calculatePrice("colorSetupFee", color?.color?.value))}</LineItemPart>
          </LineItem>
        ))}
        <LineItem className={visibleSections.testPresses ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel(orderForm, "testPresses")} Test Presses</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("testPresses"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.weight ? "visible" : "invisible"}>
          Weight
        </LineItemTitle>
        <LineItem className={visibleSections.weight ? "visible" : "invisible"}>
          <LineItemPart>{quoteDisplay.weight.label}</LineItemPart>
          <LineItemPart></LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.centerLabel ? "visible" : "invisible"}>
          Center Label
        </LineItemTitle>
        <LineItem className={visibleSections.centerLabel ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel(orderForm, "centerLabel")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("centerLabel"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.innersleeve ? "visible" : "invisible"}>
          Inner Sleeve
        </LineItemTitle>
        <LineItem className={visibleSections.innersleeve ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel(orderForm, "innersleeve")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("innersleeve"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.outerPackaging ? "visible" : "invisible"}>
          Outer Packaging
        </LineItemTitle>
        <LineItem className={visibleSections.outerPackaging ? "visible" : "invisible"}>
          <LineItemPart>{getOuterPackagingOptions()}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("outerPackaging"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.insert ? "visible" : "invisible"}>
          Insert
        </LineItemTitle>
        <LineItem className={visibleSections.insert ? "visible" : "invisible"}>
          <LineItemPart>{getInsertOptions()}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("insert"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.assembly ? "visible" : "invisible"}>
          Assembly
        </LineItemTitle>
        <LineItem className={visibleSections.assembly ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel(orderForm, "polybag")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("polybag"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.albumType ? "visible" : "invisible"}>
          Shipping and Handling
        </LineItemTitle>
        <LineItem className={visibleSections.albumType ? "visible" : "invisible"}>
          <LineItemPart>{ selectedShippingOption?.serviceName || "Not Yet Calculated" }</LineItemPart>
          <LineItemPartRight>{ formatShippingPrice(selectedShippingOption) }</LineItemPartRight>
        </LineItem>
        <TotalPrice>
          <span>Total</span>
          <span>{getFormattedTotalPrice()}</span>
        </TotalPrice>
      </>
      }
    </Container>
  );
};

export default OrderSummarySidePanel;