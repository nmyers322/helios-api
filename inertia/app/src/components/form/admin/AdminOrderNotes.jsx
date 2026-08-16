import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../main/Button";
import styled from "styled-components";
import { updateOrderAdminNotes } from "../../../modules/heliosApi";
import { updateOrder } from "../../../actions/ordersActions";
import ErrorText from "../main/ErrorText";
import SuccessText from "../main/SuccessText";

const NotesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
`;

const NotesTextarea = styled.textarea`
    width: 100%;
    min-height: 8rem;
    resize: vertical;
    box-sizing: border-box;
    padding: 0.6rem;
    border-radius: 0.4rem;
    border: 1px solid ${(props) => props.theme.colors.input.border};
    background-color: ${(props) => props.theme.colors.input.background};
    color: ${(props) => props.theme.colors.input.text};
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.4;

    &:disabled {
        color: ${(props) => props.theme.colors.input.disabledText};
    }
`;

const AdminOrderNotes = ({ orderId }) => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const savedNotes = orders[orderId]?.adminNotes || "";
  const [notes, setNotes] = useState(savedNotes);
  const [updateInProgress, setUpdateInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setNotes(savedNotes);
  }, [orderId, savedNotes]);

  useEffect(() => {
    const timeoutIds = [];
    if (successMessage) {
      timeoutIds.push(setTimeout(() => setSuccessMessage(null), 5000));
    }
    if (errorMessage) {
      timeoutIds.push(setTimeout(() => setErrorMessage(null), 5000));
    }
    return () => timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
  }, [successMessage, errorMessage]);

  const hasChanges = notes !== savedNotes;

  return (
    <NotesContainer>
        { successMessage && <SuccessText text={successMessage} /> }
        { errorMessage && <ErrorText text={errorMessage} /> }
        <NotesTextarea
            disabled={updateInProgress}
            maxLength={10000}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Internal notes (admins only)"
            value={notes}
        />
        <Button
            buttonText="Save Notes"
            disabled={updateInProgress || !hasChanges}
            onClick={async () => {
                setErrorMessage(null);
                setSuccessMessage(null);
                setUpdateInProgress(true);
                const updateResult = await updateOrderAdminNotes(orderId, notes);
                if (updateResult.status === 200) {
                    dispatch(updateOrder({
                        ...orders[orderId],
                        adminNotes: updateResult.data?.order?.adminNotes ?? null,
                    }));
                    setNotes(updateResult.data?.order?.adminNotes || "");
                    setSuccessMessage("Notes saved");
                } else {
                    setErrorMessage("Error saving notes");
                    console.error("Error saving notes:", updateResult);
                }
                setUpdateInProgress(false);
            }}
        />
    </NotesContainer>
  );
};

export default AdminOrderNotes;
