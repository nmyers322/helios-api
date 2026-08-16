import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import theme from "../../modules/theme";
import { styled } from "styled-components";
import { getPathParts, onAdminRootPage } from "../../modules/routes.js";
import { useGoTo } from "../../modules/links.js";

const AdminMenuContainer = styled.div`
`;

const Chevron = styled.p`
  font-size: 1.25rem;
  margin-right: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
  color: ${(props) => props.theme.colors.sideBar.text};
`;

const StepTitle = styled.p`
  font-weight: bold;
  font-size: 1.25rem;
  margin-top: 0;
  margin-bottom: 0;
  user-select: none;
`;

const AdminMenu = () => {
  
  const currentTheme = useSelector((state) => state.meta.currentTheme);
  const goTo = useGoTo(useNavigate());

  const linkStyle = {
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

  const activeLinkStyle = {
    backgroundColor: theme[currentTheme].colors.sideBar.activeOption,
    color: theme[currentTheme].colors.sideBar.text,
  };

  const getAdminSubPage = () => {
    if (onAdminRootPage()) {
      return "open-orders";
    }
    const pathParts = getPathParts();
    return pathParts[pathParts.length - 1];
  };

  const determineLinkStyle = (link) => {
    let calculatedStyle = { ...linkStyle };
    calculatedStyle.cursor = "pointer";
    calculatedStyle.color = theme[currentTheme].colors.sideBar.text;
    if (getAdminSubPage() === link) {
      return { ...calculatedStyle, ...activeLinkStyle };
    } else {
      return calculatedStyle;
    }
  };

  return (
    <AdminMenuContainer>
      <div
        onClick={() => goTo("/admin/open-orders")}
        style={determineLinkStyle("open-orders")}
      >
        <StepTitle>Open Orders</StepTitle>
        {getAdminSubPage() === "open-orders" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => goTo("/admin/all-orders")}
        style={determineLinkStyle("all-orders")}
      >
        <StepTitle>All Orders</StepTitle>
        {getAdminSubPage() === "all-orders" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => goTo("/admin/colors")}
        style={determineLinkStyle("colors")}
      >
        <StepTitle>Colors</StepTitle>
        {getAdminSubPage() === "colors" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
      <div
        onClick={() => goTo("/admin/packages")}
        style={determineLinkStyle("packages")}
      >
        <StepTitle>Packages</StepTitle>
        {getAdminSubPage() === "packages" && (
          <Chevron>&gt;</Chevron>
        )}
      </div>
    </AdminMenuContainer>
  );
};

export default AdminMenu;
