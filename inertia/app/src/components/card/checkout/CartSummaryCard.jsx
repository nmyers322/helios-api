import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Spinner from '../../main/Spinner';
import { setCart, setFetchingCart } from '../../../actions/cartActions';
import { cartIsEmpty, getCartItem, getCartItems, getCartItemVariation, isCartDoubleLP } from '../../../modules/cart';
import { heliosLogger } from '../../../modules/logging';
import { fetchCart } from '../../../modules/wordpressApi';
import { weightOptions } from '../../form/orderform/Weight';
import { centerLabelOptions } from '../../form/orderform/CenterLabel';
import { innersleeveOptions } from '../../form/orderform/Innersleeve';
import { outerPackagingTypeOptions } from '../../form/orderform/OuterPackagingType';
import { outerPackagingPrintOptions } from '../../form/orderform/OuterPackagingPrint';
import { outerPackagingFinishOptions } from '../../form/orderform/OuterPackagingFinish';
import { insertTypeOptions } from '../../form/orderform/InsertType';
import { insertPrintOptions } from '../../form/orderform/InsertPrint';
import { insertFinishOptions } from '../../form/orderform/InsertFinish';
import { PolybagOptions } from '../../form/orderform/Polybag';
import ShippingCost from '../../standalone/ShippingCost';
import { capitalizeWords } from '../../../modules/serialization';

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
  margin-left: 1rem;

  @media (max-width: 40rem) {
    width: calc(100% - 4rem);
    padding-right: 2rem;
    padding-left: 2rem;
    margin-top: 0;
    margin-right: 0;
    margin-left: 0;
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

const CartSummaryCard = ({disabled}) => {
  const cart = useSelector(state => state.cart.cart);
  heliosLogger("Cart Summary Card", cart);
  const dispatch = useDispatch();
  const fetchingCart = useSelector(state => state.cart.fetching);
  const [firstLoad, setFirstLoad] = React.useState(true);

  useEffect(() => {
    const loadCart = async () => {
      if (firstLoad) {
        setFirstLoad(false);
        heliosLogger("Fetching cart data");
        dispatch(setFetchingCart(true));
        const newCart = await fetchCart();
        heliosLogger("Received cart data", newCart);
        dispatch(setCart(newCart));
        dispatch(setFetchingCart(false));
      }
    };
    loadCart();
  }, [dispatch, firstLoad]);

  const getCartItemValue = name => {
    let item = getCartItem(cart, name);
    if (!item) {
      return "";
    }
    if (name === "albumType") {
      return item.quantity === 2 ? "Double LP" : "Single LP";
    } else if (name === "totalQuantity") {
      return item.quantity;
    } else if (name === "testPresses") {
      return item.quantity;
    } else if (name === "weight") {
      return weightOptions.find(option => option.value === getCartItemVariation(cart, "weight", "weight", item))?.label;
    } else if (name === "centerLabel") {
      return centerLabelOptions.find(option => option.value === getCartItemVariation(cart, "centerLabel", "centerLabel", item))?.label;
    } else if (name === "innersleeve") {
      return innersleeveOptions.find(option => option.value === getCartItemVariation(cart, "innersleeve", "innersleeve", item))?.label;
    } else if (name === "polybag") {
      return PolybagOptions.find(option => option.value === getCartItemVariation(cart, "polybag", "polybag", item))?.label;
    }
  }

  const formatPrice = (name, item = null) => {
    let priceInCents = 0;
    if (!item) {
      item = getCartItem(cart, name);
      if (!item) {
        return 0;
      }
    }
    if (name === "discount") {
      priceInCents = item?.totals?.total_discount;
      return priceInCents === 0 ? "" : "$" + (priceInCents / 100).toFixed(2);
    }
    priceInCents = parseInt(item?.prices?.price) * item?.quantity;
    return priceInCents === 0 ? "" : "$" + (priceInCents / 100).toFixed(2);
  }

  const getTestPressFormattedPrice = () => {
    let testPresses = getCartItem(cart, "testPresses");
    let testPressSetupFee = getCartItem(cart, isCartDoubleLP(cart) ? "testPressSetupFeeDoubleLP" : "testPressSetupFeeSingleLP");
    if (!testPresses || !testPressSetupFee) {
      return 0;
    }
    let priceInCents = parseInt(testPresses.totals.line_total) + parseInt(testPressSetupFee.totals.line_total);
    return "$" + (priceInCents / 100).toFixed(2);
  }

  const getOuterPackagingValue = () => {
    let item = getCartItem(cart, "outerPackaging");
    if (!item) {
      return "";
    }
    let output = "";
    let outerPackagingType = getCartItemVariation(cart, "outerPackaging", "outerPackagingType", item);
    let outerPackagingPrint = getCartItemVariation(cart, "outerPackaging", "outerPackagingPrint", item);
    let outerPackagingFinish = getCartItemVariation(cart, "outerPackaging", "outerPackagingFinish", item);
    if (outerPackagingType) {
      output += outerPackagingTypeOptions.find(option => option.value === outerPackagingType)?.label;
      let outerPackagingPrintValue = outerPackagingPrintOptions.find(option => option.value === outerPackagingPrint)?.label;
      if (outerPackagingPrintValue) {
        output += ", " + outerPackagingPrintValue;
      }
      let outerPackagingFinishValue = outerPackagingFinishOptions.find(option => option.value === outerPackagingFinish)?.label;
      if (outerPackagingFinishValue) {
        output += ", " + outerPackagingFinishValue;
      }
    }
    return output;
  }

  const getInsertValue = () => {
    let item = getCartItem(cart, "insert");
    if (!item) {
      return "";
    }
    let output = "";
    let insertType = getCartItemVariation(cart, "insert", "insertType", item);
    let insertPrint = getCartItemVariation(cart, "insert", "insertPrint", item);
    let insertFinish = getCartItemVariation(cart, "insert", "insertFinish", item);
    if (insertType) {
      output += insertTypeOptions.find(option => option.value === insertType)?.label;
      let insertPrintValue = insertPrintOptions.find(option => option.value === insertPrint)?.label;
      if (insertPrintValue) {
        output += ", " + insertPrintValue;
      }
      let insertFinishValue = insertFinishOptions.find(option => option.value === insertFinish)?.label;
      if (insertFinishValue) {
        output += ", " + insertFinishValue;
      }
    }
    return output;
  }

  const getShippingValue = () =>
    cart?.shipping_rates?.at(0)?.shipping_rates?.find(rate => rate.selected)?.name;


  const getShippingFormattedPrice = () => {
    let shipping = cart?.shipping_rates?.at(0)?.shipping_rates?.find(rate => rate.selected)?.price;
    return !shipping ? "" : "$" + (shipping / 100).toFixed(2);
  }

  const getFormattedTotalPrice = () => {
    let total = parseInt(cart?.totals?.total_price);
    if (cart?.totals?.total_discount) {
      total = total - parseInt(cart.totals.total_discount);
    }
    return !total ? "" : "$" + (total / 100).toFixed(2);
  }

  const getCouponDiscountPercentage = item => {
    if (item?.discount_type === "percent") {
      let percent = (item.totals?.total_discount / cart?.totals?.total_items) * 100;
      return "(" + percent.toFixed(0) + "%)";
    }
    return 0;
  }

  return (   
    <Container disabled={disabled}>
      <Title>
        <h2>Order Summary</h2>
      </Title>
      { fetchingCart && 
          <SpinnerContainer>
            <Spinner />
            <span>Loading Order...</span>
          </SpinnerContainer>
      }
      { !fetchingCart && !cartIsEmpty(cart) &&
      <>
        <LineItemTitle>
          Record Setup Fee
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getCartItemValue("albumType")}</LineItemPart>
          <LineItemPart>{formatPrice("albumType")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Quantity/Colors - {getCartItemValue("totalQuantity")} Total
        </LineItemTitle>
        { getCartItems(cart, "color").map((item, index) => (
          <LineItem key={"colorQuantity"+index} className="visible">
            <LineItemPart>{getCartItemVariation(cart, "color", "color", item)}</LineItemPart>
            <LineItemPart>{formatPrice("color", item)}</LineItemPart>
          </LineItem>
        ))}
        { getCartItems(cart, "colorSetupFee").map((item, index) => (
          <LineItem key={"colorSetupFee"+index} className="visible">
            <LineItemPart>Color setup fee</LineItemPart>
            <LineItemPart>{formatPrice("colorSetupFee", item)}</LineItemPart>
          </LineItem>
        ))}
        <LineItem>
          <LineItemPart>{getCartItemValue("testPresses")} Test Presses</LineItemPart>
          <LineItemPart>{getTestPressFormattedPrice()}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Weight
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getCartItemValue("weight")}</LineItemPart>
          <LineItemPart>{formatPrice("weight")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Center Label
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getCartItemValue("centerLabel")}</LineItemPart>
          <LineItemPart>{formatPrice("centerLabel")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Inner Sleeve
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getCartItemValue("innersleeve")}</LineItemPart>
          <LineItemPart>{formatPrice("innersleeve")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Outer Packaging
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getOuterPackagingValue()}</LineItemPart>
          <LineItemPart>{formatPrice("outerPackaging")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Insert
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getInsertValue()}</LineItemPart>
          <LineItemPart>{formatPrice("insert")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Assembly
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getCartItemValue("polybag")}</LineItemPart>
          <LineItemPart>{formatPrice("polybag")}</LineItemPart>
        </LineItem>
        <LineItemTitle>
          Shipping and Handling
        </LineItemTitle>
        <LineItem>
          <LineItemPart>{getShippingValue()}</LineItemPart>
          <LineItemPart>{getShippingFormattedPrice()}<ShippingCost source="cart" /></LineItemPart>
        </LineItem>
        { cart?.coupons?.length > 0 &&
        <LineItemTitle>
          Discounts
        </LineItemTitle>
        }
        { cart?.coupons?.map((item, index) => (
          <LineItem key={"discount"+index} className="visible">
            <LineItemPart>{capitalizeWords(item.code)} {getCouponDiscountPercentage(item)}</LineItemPart>
            <LineItemPart>-{formatPrice("discount", item)}</LineItemPart>
          </LineItem>
        ))}
        <TotalPrice>
          <span>Total</span>
          <span>{getFormattedTotalPrice()}</span>
        </TotalPrice>
      </>
      }
    </Container>
  );
};

export default CartSummaryCard;