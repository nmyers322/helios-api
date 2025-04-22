import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import theme from "../../modules/theme";
import { styled } from "styled-components";

const EditAccountNavContainer = styled.div`
  margin-top: 3rem;
`;

const Chevron = styled.p`
  font-size: 1.25rem;
  margin-right: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
  color: ${(props) => props.theme.colors.sideBar.text};
`;

const NavHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.sideBar.border};
  background-color: ${(props) => props.theme.colors.sideBar.background};
  color: ${(props) => props.theme.colors.sideBar.text};
  cursor: default;
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-weight: bold;
  padding-right: 1rem;
`;

const StepTitle = styled.p`
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
`;

const EditAccountNav = () => {
  
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const customer = useSelector((state) => state.customer);
  const customerHasNoSavedBillingAddress = !customer?.billing || customer?.billing.length === 0;

  const stepStyle = {
    margin: "0",
    padding: "1rem",
    borderBottom: `1px solid ${theme[currentTheme].colors.sideBar.border}`,
    backgroundColor: theme[currentTheme].colors.sideBar.unavailableOption,
    color: theme[currentTheme].colors.sideBar.unavailableText,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    cursor: "pointer",
  };

  const activeStepStyle = {
    backgroundColor: theme[currentTheme].colors.sideBar.activeOption,
    color: theme[currentTheme].colors.sideBar.text,
  };

  const completedStepStyle = {
    backgroundColor: theme[currentTheme].colors.sideBar.completedOption,
    color: theme[currentTheme].colors.sideBar.text,
  };

  const navigate = useNavigate();

  const getStepFromPathname = () => {
    const pathParts = window.location.hash.split("/");
    if (pathParts.length === 2) {
      return "album-details";
    }
    return pathParts[pathParts.length - 1];
  };

  const determineStepStyle = (step) => {
    let calculatedStepStyle = { ...stepStyle };
    let path = window.location.pathname;
    switch (step) {
        case "billing-address":
            calculatedStepStyle.cursor = "pointer";
            calculatedStepStyle.color = theme[currentTheme].colors.sideBar.text;
            if ((path === "/account" || path === `/account/billing-address`) && step === "billing-address") {
                calculatedStepStyle = { ...calculatedStepStyle, ...activeStepStyle };
            } else {
                calculatedStepStyle = { ...calculatedStepStyle, ...completedStepStyle };
            }
            break;
        case "shipping-address":
            if (path === `/account/shipping-address`) {
                calculatedStepStyle = { ...calculatedStepStyle, ...activeStepStyle };
            } else if (customerHasNoSavedBillingAddress) {
                calculatedStepStyle.cursor = "not-allowed";
                calculatedStepStyle.color = theme[currentTheme].colors.sideBar.unavailableText;
            } else {
                calculatedStepStyle.cursor = "pointer";
                calculatedStepStyle.color = theme[currentTheme].colors.sideBar.text;
            }
            break;
        default:
            break;
    }
    return calculatedStepStyle;
  };

  const navigateToStep = (step) => {
    if (step === "shipping-address" && customerHasNoSavedBillingAddress) {
        return;
    }
    navigate(`/account/${step}`);
  };

  return (
    <EditAccountNavContainer>
      <NavHeader>
        Update Customer Account
      </NavHeader>
      <div
        onClick={() => navigateToStep("billing-address")}
        style={determineStepStyle("billing-address")}
      >
        <StepTitle>Edit Billing Address</StepTitle>
        {getStepFromPathname() === "billing-address" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("shipping-address")}
        style={determineStepStyle("shipping-address")}
      >
        <StepTitle>Edit Shipping Address</StepTitle>
        {getStepFromPathname() === "shipping-address" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
    </EditAccountNavContainer>
  );
};

export default EditAccountNav;
