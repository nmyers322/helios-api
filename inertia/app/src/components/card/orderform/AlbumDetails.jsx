import React from "react";
import BandName from "../../form/orderform/BandName";
import AlbumTitle from "../../form/orderform/AlbumTitle";
import CatalogNumber from "../../form/orderform/CatalogNumber";
import AlbumType from "../../form/orderform/AlbumType";
import OrderFormCard from "../../card/orderform/OrderFormCard";
import { validateAlbumDetailsCard } from "../../../modules/orderFormValidation";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { minimumQuantity } from "../../form/orderform/TotalQuantity";
import { minimumTestPresses } from "../../form/orderform/TestPresses";
import { getAvailableColors } from "../../../modules/colors";

const AlbumDetails = ({
  className = "",
}) => {
  const dispatch = useDispatch();
  const orderForm = useSelector((state) => state.orderForm);
  return (
    <OrderFormCard
      continueLink="/order/record-details"
      className={className}
      disabled={!validateAlbumDetailsCard(orderForm).isValid}
      onSubmit={() => {
        if (orderForm.colors.length === 0 && orderForm.totalQuantity === 0 && orderForm.testPresses === 0) {
          const firstColor = getAvailableColors().find((color) => color.value === "Black") || getAvailableColors()[0] || null;
          dispatch(updateOrderFormField("colors", [{color: firstColor, quantity: minimumQuantity}]));
          dispatch(updateOrderFormField("totalQuantity", minimumQuantity));
          dispatch(updateOrderFormField("testPresses", minimumTestPresses));
        }
      }}
      title="Album Details"
    >
      <h4>This information will help identify your unique project.</h4>
      <BandName />
      <AlbumTitle />
      <CatalogNumber />
      <AlbumType />
    </OrderFormCard>
  );
};

export default AlbumDetails;
