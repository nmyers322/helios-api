import React from "react";
import { Routes, Route } from "react-router-dom";
import BillingAddress from "../card/account/BillingAddressCard";
import { PageCardColumn, PageContainer, PageLeftColumn } from "../../styles/Page";
import ShippingAddress from "../card/account/ShippingAddressCard";
import EditAccountNav from "../sidebar/EditAccountNav";
import { useSelector } from "react-redux";
import Modal from "../main/Modal";
import LabeledSpinner from "../main/LabeledSpinner";

const AccountPage = () => {
  const customer = useSelector((state) => state.customer);
  return (
    <PageContainer>
      <PageLeftColumn>
        <EditAccountNav />
      </PageLeftColumn>
      <PageCardColumn>
        <Routes>
          <Route
            path="/billing-address"
            element={<BillingAddress />}
          />
          <Route
            path="/shipping-address"
            element={<ShippingAddress />}
          />
        </Routes>
      </PageCardColumn>
      { customer?.fetching && 
        <Modal>
          <LabeledSpinner text={"Fetching your details..."} />
        </Modal>
      }
    </PageContainer>
  );
};

export default AccountPage;
