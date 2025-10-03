import { useSelector } from "react-redux";
import Card from "../Card";
import styled from "styled-components";

const Title = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ContactLine = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ContactLabel = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
  min-width: 80px;
`;

const ContactValue = styled.span`
  color: ${props => props.theme.colors.text};
  
  a {
    color: ${props => props.theme.colors.link};
    text-decoration: none;
    
    &:hover {
      color: ${props => props.theme.colors.highlightedText};
    }
  }
`;

const RoleBadge = styled.span`
  background-color: ${props => props.$isAdmin ? props.theme.colors.primary : props.theme.colors.disabledBackground};
  color: ${props => props.$isAdmin ? props.theme.colors.invertedText : props.theme.colors.text};
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: bold;
`;

const AdminCustomerContactCard = ({ orderId }) => {
  const orders = useSelector((state) => state.orders.orders);
  const customer = useSelector((state) => state.customer);
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  
  // Get the order data
  const order = orders?.[orderId];
  
  // Only show this card for admin users
  if (customer?.role !== "admin" || !order) {
    return null;
  }

  // Extract customer info from the order's user relationship
  const customerInfo = order.user;
  
  if (!customerInfo) {
    return (
      <Card title="Customer Contact Information">
        <p>Customer information not available</p>
      </Card>
    );
  }

  return (
    <Card title="Customer Contact Information">
      {customerInfo.email && (
        <ContactLine>
          <ContactLabel>Email:</ContactLabel>
          <ContactValue>
            <a href={`mailto:${customerInfo.email}`}>
              {customerInfo.email}
            </a>
          </ContactValue>
        </ContactLine>
      )}
      
      {customerInfo.phone && (
        <ContactLine>
          <ContactLabel>Phone:</ContactLabel>
          <ContactValue>
            <a href={`tel:${customerInfo.phone}`}>
              {customerInfo.phone}
            </a>
          </ContactValue>
        </ContactLine>
      )}
      
      {customerInfo.company && (
        <ContactLine>
          <ContactLabel>Company:</ContactLabel>
          <ContactValue>{customerInfo.company}</ContactValue>
        </ContactLine>
      )}
      
      <ContactLine>
        <ContactLabel>Name:</ContactLabel>
        <ContactValue>
          {customerInfo.firstName && customerInfo.lastName 
            ? `${customerInfo.firstName} ${customerInfo.lastName}`
            : customerInfo.firstName || customerInfo.lastName || 'Not provided'
          }
        </ContactValue>
      </ContactLine>
      
      <ContactLine>
        <ContactLabel>User ID:</ContactLabel>
        <ContactValue>{customerInfo.id}</ContactValue>
      </ContactLine>
      
      <ContactLine>
        <ContactLabel>Role:</ContactLabel>
        <ContactValue>
          <RoleBadge $isAdmin={customerInfo.role === 'admin'}>
            {customerInfo.role}
          </RoleBadge>
        </ContactValue>
      </ContactLine>
      
      {customerInfo.createdAt && (
        <ContactLine>
          <ContactLabel>Customer Since:</ContactLabel>
          <ContactValue>
            {new Date(customerInfo.createdAt).toLocaleDateString()}
          </ContactValue>
        </ContactLine>
      )}
      
      {customerInfo.updatedAt && customerInfo.updatedAt !== customerInfo.createdAt && (
        <ContactLine>
          <ContactLabel>Last Updated:</ContactLabel>
          <ContactValue>
            {new Date(customerInfo.updatedAt).toLocaleDateString()}
          </ContactValue>
        </ContactLine>
      )}
    </Card>
  );
};

export default AdminCustomerContactCard;
