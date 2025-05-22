import styled from "styled-components";
import { PageContainer, PageLeftColumn, PageRightColumn } from "../../styles/Page"
import ImmutableOrderFormSummaryCard from "../card/orderform/ImmutableOrderFormSummaryCard"
import OrderSummarySidePanel from "../sidebar/OrderSummarySidePanel"
import { Item } from "../main/PrintModal";
import heliosTxtLogo from '../../images/helios-text-yellow-1000.png';
import CompletedOrderDetailsCard from "../card/checkout/CompletedOrderDetailsCard";
import ContactAndShippingInformationCard from "../card/checkout/ContactAndShippingInformationCard";
import OrderStatus from "../form/admin/OrderStatus";
import { useSelector } from "react-redux";

const StyledPageLeftColumn = styled(PageLeftColumn)`
    width: 100%;
    @media (max-width: 69rem) {
        display: flex;
    }
`;

const StyledPageRightColumn = styled(PageRightColumn)`
    width: 100%;
    @media (max-width: 69rem) {
        display: flex;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-bottom: 1rem;
`;

const StyledPageContainer = styled(PageContainer)`
    padding: 2rem;
    margin-top: 0;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: auto;
    background-color: ${(props) => props.theme.colors.cardBackground};
`;

const TopImage = styled.img`
    width: 6rem;
    height: auto;
    margin-bottom: 1rem;
    margin-top: 1rem;
`;

const PrintableOrderSummary = ({orderId, targetRef}) => {
    const customer = useSelector((state) => state.customer);
    const orders = useSelector((state) => state.orders.orders);
    return (
        <StyledPageContainer ref={targetRef}>
            { !orderId && <Row><Item><TopImage src={heliosTxtLogo} /></Item></Row> }
            <Row>
                { orderId && customer?.role === "admin" && <OrderStatus orderId={orderId} /> }
            </Row>
            <Row>
                <StyledPageLeftColumn>
                    { !orderId && <ImmutableOrderFormSummaryCard /> }
                    { orderId && <CompletedOrderDetailsCard orderId={orderId} /> }
                    { orderId && <ContactAndShippingInformationCard orderNumber={orderId} />}
                </StyledPageLeftColumn>
                <StyledPageRightColumn>
                    { !orderId && <OrderSummarySidePanel /> }
                </StyledPageRightColumn>
            </Row>
        </StyledPageContainer>
    )
}

export default PrintableOrderSummary;