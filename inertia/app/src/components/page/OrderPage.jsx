import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  resetOrderForm
} from "../../actions/orderFormActions";
import { getOrderFormFromLocalStorage } from "../../modules/dataPersistMiddleware";
import { useGoTo } from "../../modules/links";
import { PageCardColumn, PageContainer, PageLeftColumn, PageRightColumn } from "../../styles/Page";
import AlbumDetails from "../card/orderform/AlbumDetails";
import AssemblyOptions from "../card/orderform/AssemblyOptions";
import CenterLabelOptions from "../card/orderform/CenterLabelOptions";
import ColorOptions from "../card/orderform/ColorOptions";
import InnsersleeveOptions from "../card/orderform/InnersleeveOptions";
import InsertOptions from "../card/orderform/InsertOptions";
import OrderSummaryCard from "../card/orderform/OrderSummaryCard";
import OuterPackagingOptions from "../card/orderform/OuterPackagingOptions";
import RecordDetails from "../card/orderform/RecordDetails";
import Modal from "../main/Modal";
import OrderFormProgress from "../sidebar/OrderFormProgress";
import OrderSummarySidePanel from "../sidebar/OrderSummarySidePanel";

const MobileQuotePanel = styled.div`
  display: none;

  @media (max-width: 69rem) {
    display: ${(props) => (props.$visible ? "flex" : "none")};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh - 6rem);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 4;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding-top: 3rem;
    padding-bottom: 3rem;
    overflow-y: scroll;
  }
`;

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const goTo = useGoTo(navigate);
  const showQuoteOnMobile = useSelector((state) => state.orderForm.showQuoteOnMobile);
  const [showModal, setShowModal] = useState(false);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const orderForm = getOrderFormFromLocalStorage();
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      if (orderForm) {
        setShowModal(true);
      }
    }
  }, [dispatch, isFirstLoad]);

  return (
    <PageContainer>
      {showModal && (
        <Modal
          cancelText={"No, clear form and start over"}
          confirmText={"Yes, continue"}
          title="Continue Order?"
          onConfirm={() => setShowModal(false)}
          onCancel={() => {
            dispatch(resetOrderForm());
            setShowModal(false);
            goTo("/order/album-details");
          }}
          styles={{ maxWidth: "45rem" }}
        >
          <p style={{ padding: "1rem", fontSize: "1.25rem" }}>
            It looks like you still have an order in progress. Do you want to
            continue your previous order or start a new one?
          </p>
        </Modal>
      )}
      <PageLeftColumn>
        <OrderFormProgress />
      </PageLeftColumn>
      <PageCardColumn>
        <Routes>
          <Route
            path="/"
            element={<AlbumDetails />}
          />
          <Route
            path="/album-details"
            element={<AlbumDetails />}
          />
          <Route
            path="/record-details"
            element={<RecordDetails />}
          />
          <Route
            path="/color-options"
            element={<ColorOptions />}
          />
          <Route
            path="/center-label-options"
            element={<CenterLabelOptions />}
          />
          <Route
            path="/innersleeve-options"
            element={<InnsersleeveOptions />}
          />
          <Route
            path="/outer-packaging-options"
            element={<OuterPackagingOptions />}
          />
          <Route
            path="/insert-options"
            element={<InsertOptions />}
          />
          <Route
            path="/assembly-options"
            element={<AssemblyOptions />}
          />
          <Route path="/summary" element={<OrderSummaryCard />} />
        </Routes>
      </PageCardColumn>
      <PageRightColumn>
        <OrderSummarySidePanel />
      </PageRightColumn>
      <MobileQuotePanel $visible={showQuoteOnMobile}>
        <OrderSummarySidePanel />
      </MobileQuotePanel>
    </PageContainer>
  );
};

export default OrderPage;
