import { useNavigate } from "react-router-dom";
import recordStockImage from "../../images/record-stock.png";
import { useSelector } from "react-redux";
import { validatePreviousStep } from "../../modules/orderFormValidation.js";
import theme from "../../modules/theme";
import { styled } from "styled-components";
import { getOrderFormFromLocalStorage } from "../../modules/dataPersistMiddleware.js";
import { getOrderStep, getPathParts, onOrderRootPage } from "../../modules/routes.js";

const OrderFormProgressContainer = styled.div`
`;

const RecordImagesContainer = styled.div`
  width: 4rem;
  height: 4rem;
  position: relative;
  margin-right: 2rem;
`;

const FirstRecordImage = styled.img`
  width: 4rem;
  height: 4rem;
  margin-right: 2rem;
`;

const SecondRecordImage = styled.img`
  width: 4rem;
  height: 4rem;
  position: absolute;
  left: 1rem;
  top: 0;
`;

const AlbumIdentifierTextColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const AlbumIdentifierText = styled.p`
  margin-top: 0;
  margin-bottom: 0.25rem;
  font-weight: bold;
  padding-right: 1rem;
`;

const Chevron = styled.p`
  font-size: 1.25rem;
  margin-right: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
  color: ${(props) => props.theme.colors.sideBar.text};
`;

const AlbumIdentifier = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  margin: 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.sideBar.border};
  background-color: ${(props) => props.theme.colors.sideBar.background};
  color: ${(props) => props.theme.colors.sideBar.text};
  cursor: default;
`;

const StepTitle = styled.p`
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
`;

const OrderFormProgress = () => {
  
  const currentTheme = useSelector((state) => state.meta.currentTheme);

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

  const stepOrder = [
    "album-details",
    "record-details",
    "color-options",
    "center-label-options",
    "innersleeve-options",
    "outer-packaging-options",
    "insert-options",
    "assembly-options",
    "summary",
  ];

  const orderForm = useSelector((state) => state.orderForm);
  const persistantOrderForm = getOrderFormFromLocalStorage();
  const navigate = useNavigate();

  const getStepFromPathname = () => {
    if (onOrderRootPage()) {
      return "album-details";
    }
    const pathParts = getPathParts();
    return pathParts[pathParts.length - 1];
  };

  const determineStepStyle = (step) => {
    let calculatedStepStyle = { ...stepStyle };
    // if this step is valid, add cursor pointer, otherwise add no pointer
    if (validatePreviousStep(persistantOrderForm, step).isValid) {
      calculatedStepStyle.cursor = "pointer";
      calculatedStepStyle.color = theme[currentTheme].colors.sideBar.text;
    } else {
      calculatedStepStyle.cursor = "not-allowed";
    }
    if (getOrderStep() === step) {
      return { ...calculatedStepStyle, ...activeStepStyle };
    } else if (
      stepOrder.indexOf(getStepFromPathname()) > stepOrder.indexOf(step)
    ) {
      return { ...calculatedStepStyle, ...completedStepStyle };
    } else {
      return calculatedStepStyle;
    }
  };

  const navigateToStep = (step) => {
    if (validatePreviousStep(persistantOrderForm, step).isValid) {
      navigate(`/order/${step}`);
    }
  };

  return (
    <OrderFormProgressContainer>
      <AlbumIdentifier>
        {orderForm.albumType?.value === "double" ? (
          <RecordImagesContainer>
            <FirstRecordImage
              src={recordStockImage}
              alt="Double Record"
            />
            <SecondRecordImage
              src={recordStockImage}
              alt="Double Record"
            />
          </RecordImagesContainer>
        ) : (
          <FirstRecordImage
            src={recordStockImage}
            alt="Single Record"
          />
        )}
        <AlbumIdentifierTextColumn>
          <AlbumIdentifierText>
            {orderForm.catalogNumber ? orderForm.catalogNumber : "New Record"}
          </AlbumIdentifierText>
          <AlbumIdentifierText>
            {orderForm.bandName ? orderForm.bandName : "(Band Name)"}
          </AlbumIdentifierText>
          <AlbumIdentifierText>
            {orderForm.albumTitle ? orderForm.albumTitle : "(Album Title)"}
          </AlbumIdentifierText>
        </AlbumIdentifierTextColumn>
      </AlbumIdentifier>
      <div
        onClick={() => navigateToStep("album-details")}
        style={determineStepStyle("album-details")}
      >
        <StepTitle>Album Details</StepTitle>
        {getStepFromPathname() === "album-details" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("record-details")}
        style={determineStepStyle("record-details")}
      >
        <StepTitle>Record Details</StepTitle>
        {getStepFromPathname() === "record-details" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("color-options")}
        style={determineStepStyle("color-options")}
      >
        <StepTitle>Color Options</StepTitle>
        {getStepFromPathname() === "color-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("center-label-options")}
        style={determineStepStyle("center-label-options")}
      >
        <StepTitle>Center Label Options</StepTitle>
        {getStepFromPathname() === "center-label-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("innersleeve-options")}
        style={determineStepStyle("innersleeve-options")}
      >
        <StepTitle>Innersleeve Options</StepTitle>
        {getStepFromPathname() === "innersleeve-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("outer-packaging-options")}
        style={determineStepStyle("outer-packaging-options")}
      >
        <StepTitle>Outer Packaging Options</StepTitle>
        {getStepFromPathname() === "outer-packaging-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("insert-options")}
        style={determineStepStyle("insert-options")}
      >
        <StepTitle>Insert Options</StepTitle>
        {getStepFromPathname() === "insert-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("assembly-options")}
        style={determineStepStyle("assembly-options")}
      >
        <StepTitle>Assembly Options</StepTitle>
        {getStepFromPathname() === "assembly-options" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => navigateToStep("summary")}
        style={determineStepStyle("summary")}
      >
        <StepTitle>Summary Details</StepTitle>
        {getStepFromPathname() === "summary" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
    </OrderFormProgressContainer>
  );
};

export default OrderFormProgress;
