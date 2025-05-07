import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { formatPrice, getColorOrBlackValue, getPrice } from '../../modules/products';
import Spinner from '../main/Spinner';
import { isDoubleLP } from '../../reducers/orderFormReducer';
import ShippingCost from '../standalone/ShippingCost';
import { isLocal } from '../../modules/environment';
import RedXButton from '../form/main/RedXButton';
import { updateOrderFormField } from '../../actions/orderFormActions';

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
    if (isLocal()) {
      return 0;
    }
    if (!populated) {
      return 0;
    }
    if (color) {
      if (memoedPrice[name+color?.color?.value]) {
        return memoedPrice[name+color?.color?.value];
      }
      const price = getPrice(name, orderForm, products, variations, color);
      if (price) {
        memoedPrice[name+color?.color?.value] = price;
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

  const getSelectedOptionLabel = name => 
    orderForm && orderForm[name] && orderForm[name].label ? 
      orderForm[name].label : 
      orderForm[name] ? 
        orderForm[name] : 
        "";

  const getColorSetupFeeLabel = color => {
    if (!color.color) {
      return `(Undecided) Setup Fee`;
    }
    return `${color.color.label} Setup Fee`;
  }

  const getColorLabel = color => {
    let recordsLabel = isDoubleLP(orderForm) ? "Double Records" : "Records";
    if (!color.color) {
      return `(Undecided) ${color.quantity} ${recordsLabel}`;
    }
    return `${color.quantity} ${color.color.label} ${recordsLabel}`;
  }
  
  const getOuterPackagingOptions = () => {
    const outerPackagingType = getSelectedOptionLabel("outerPackagingType");
    const outerPackagingPrint = getSelectedOptionLabel("outerPackagingPrint");
    const outerPackagingFinish = getSelectedOptionLabel("outerPackagingFinish");
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
    const insertType = getSelectedOptionLabel("insertType");
    const insertPrint = getSelectedOptionLabel("insertPrint");
    const insertFinish = getSelectedOptionLabel("insertFinish");
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

  const getShippingPrice = () => {
    return shippingOptions?.shippingOptions?.find(option => option.id === shippingOptions.selectedOption)?.price || 0;
  }

  const getTotalPrice = () => {
    let total = 0;
    const pricedItems = [
      "albumType",
      "weight",
      "testPresses",
      "colorSetupFeeTotal",
      "centerLabel",
      "innersleeve",
      "outerPackaging",
      "insert",
      "polybag"
    ];
    pricedItems.forEach(item => {
      total += calculatePrice(item);
    });
    orderForm.colors.length > 0 && orderForm.colors.forEach(color => {
      total += calculatePrice("color", color);
    });
    let shippingPrice = getShippingPrice();
    shippingPrice && (total += parseFloat(shippingPrice));
    return total;
  };

  const getFormattedTotalPrice = () => {
    if (isLocal()) {
      return "$100.00";
    }
    const total = getTotalPrice();
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
          <LineItemPart>{getSelectedOptionLabel("albumType")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("albumType"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.quantity ? "visible" : "invisible"}>
          Quantity/Colors - {getSelectedOptionLabel("totalQuantity")} Total
        </LineItemTitle>
        { orderForm.colors && orderForm.colors.map((color, index) => (
          <LineItem key={"colorQuantity"+index} className="visible">
            <LineItemPart>{getColorLabel(color)}</LineItemPart>
            <LineItemPart>{formatPrice(calculatePrice("color", color))}</LineItemPart>
          </LineItem>
        ))}
        { orderForm.colors && orderForm.colors.filter(color => getColorOrBlackValue(color) !== "black").map((color, index) => (
          <LineItem key={"colorSetupFee"+index} className="visible">
            <LineItemPart>{getColorSetupFeeLabel(color)}</LineItemPart>
            <LineItemPart>{formatPrice(calculatePrice("colorSetupFee", color?.color?.value))}</LineItemPart>
          </LineItem>
        ))}
        <LineItem className={visibleSections.testPresses ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel("testPresses")} Test Presses</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("testPresses"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.weight ? "visible" : "invisible"}>
          Weight
        </LineItemTitle>
        <LineItem className={visibleSections.weight ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel("weight")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("weight"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.centerLabel ? "visible" : "invisible"}>
          Center Label
        </LineItemTitle>
        <LineItem className={visibleSections.centerLabel ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel("centerLabel")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("centerLabel"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.innersleeve ? "visible" : "invisible"}>
          Inner Sleeve
        </LineItemTitle>
        <LineItem className={visibleSections.innersleeve ? "visible" : "invisible"}>
          <LineItemPart>{getSelectedOptionLabel("innersleeve")}</LineItemPart>
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
          <LineItemPart>{getSelectedOptionLabel("polybag")}</LineItemPart>
          <LineItemPart>{formatPrice(calculatePrice("polybag"))}</LineItemPart>
        </LineItem>
        <LineItemTitle className={visibleSections.albumType ? "visible" : "invisible"}>
          Shipping and Handling
        </LineItemTitle>
        <LineItem className={visibleSections.albumType ? "visible" : "invisible"}>
          <LineItemPart><ShippingCost /></LineItemPart>
          <LineItemPart><ShippingCost output="price" /></LineItemPart>
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