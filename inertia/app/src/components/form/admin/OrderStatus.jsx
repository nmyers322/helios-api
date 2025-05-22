import React, { useEffect } from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import Button from "../main/Button";
import styled from "styled-components";
import { updateOrderStatus } from "../../../modules/heliosApi";
import { updateOrder } from "../../../actions/ordersActions";
import ErrorText from "../main/ErrorText";
import SuccessText from "../main/SuccessText";

//"CART" | "CREATED" | "PAID" | "SHIPPED" | "CANCELLED" | "REFUNDED" | "COMPLETED" | "DELETED"
const orderStatusOptions = [
  { value: "CART", label: "Still Shopping" },
  { value: "CREATED", label: "Created" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DELETED", label: "Deleted" }
];

const orderStatusLabel = "Order Status";
const orderStatusName = "status";

const OrderStatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 50%;
`;

const OrderStatus = ({orderId}) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const currentValue = orders[orderId]?.status;
  const [selectedOption, setSelectedOption] = React.useState(orderStatusOptions.find(option => option.value === currentValue) || null);
  const [updateInProgress, setUpdateInProgress] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (successMessage) {
        setSuccessMessage(null);
      }
    }, 5000);
    setTimeout(() => {
      if (errorMessage) {
        setErrorMessage(null);
      }
    }, 5000);
  }, [successMessage, errorMessage]);

  return (
    <OrderStatusContainer>
        { successMessage && <SuccessText text={successMessage} /> }
        { errorMessage && <ErrorText text={errorMessage} /> }
        <LabeledInput
            helpText={null}
            isDisabled={updateInProgress}
            isSearchable={false}
            validationResponse={null}
            name={orderStatusName}
            onChange={(option) => setSelectedOption(option)}
            options={orderStatusOptions}
            text={orderStatusLabel}
            type="Select"
            value={selectedOption}
        />
        <Button
            buttonText="Update Order Status"
            disabled={updateInProgress}
            onClick={async () => {
                setErrorMessage(null);
                setSuccessMessage(null);
                setUpdateInProgress(true);
                let updateResult = await updateOrderStatus(orderId, selectedOption.value);
                if (updateResult.status === 200) {
                    dispatch(updateOrder({
                        ...orders[orderId],
                        status: selectedOption.value,
                    }));
                    setSuccessMessage("Order status updated successfully");
                } else {
                    setErrorMessage("Error updating order status");
                    console.error("Error updating order status:", updateResult);
                }
                setUpdateInProgress(false);
            }}
        />
    </OrderStatusContainer>
  );
};

export default OrderStatus;

export {
  orderStatusOptions,
  OrderStatus,
  orderStatusLabel,
  orderStatusName,
};