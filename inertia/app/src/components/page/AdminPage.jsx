import InformationPage from "../../styles/InformationPage"
import { PageContainer, PageCardColumn, PageLeftColumn } from "../../styles/Page";
import { PageTitle } from "../../styles/Page";
import { useSelector } from "react-redux";
import { useGoTo } from "../../modules/links";
import { Route, Routes, useNavigate } from "react-router-dom";
import OrdersOverviewCard from "../card/admin/OrdersOverviewCard";
import AdminMenu from "../sidebar/AdminMenu";

const AdminPage = () => {
    const customer = useSelector((state) => state.customer);
    const goTo = useGoTo(useNavigate());
    if (customer.role !== "admin") {
        return (
            <InformationPage>
                <PageTitle>Access Denied</PageTitle>
                <p>You do not have permission to access this page.</p>
            </InformationPage>
        );
    }
    return (
        <PageContainer>
            <PageLeftColumn>
                <AdminMenu />
            </PageLeftColumn>
            <PageCardColumn>
                <Routes>
                    <Route
                        path="/"
                        element={<OrdersOverviewCard statuses={["CREATED", "PAID"]} />}
                    />
                    <Route
                        path="/open-orders"
                        element={<OrdersOverviewCard statuses={["CREATED", "PAID"]} />}
                    />
                    <Route
                        path="/all-orders"
                        element={<OrdersOverviewCard />}
                    />
                </Routes>
            </PageCardColumn>
        </PageContainer>
    );
};

export default AdminPage;