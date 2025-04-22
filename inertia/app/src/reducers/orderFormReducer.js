import { albumTypeOptionDouble } from "../components/form/orderform/AlbumType";
import { emptyCart } from "../modules/cart";

const initialState = {
  albumTitle: "",
  albumType: null,
  bandName: "",
  billing: null,
  catalogNumber: "",
  centerLabel: null,
  colors: [],
  colorsVerified: false,
  innersleeve: null,
  insertType: null,
  insertFinish: null,
  insertPrint: null,
  assemblyOption: null,
  outerPackagingFinish: null,
  outerPackagingPrint: null,
  outerPackagingType: null,
  payment: null,
  polybag: null,
  shipping: null,
  shippingCost: null,
  shippingSameAsBilling: false,
  showQuoteOnMobile: false,
  testPresses: 0,
  totalQuantity: 0,
  weight: null,
};

export const isDoubleLP = (state) => state.albumType?.value === albumTypeOptionDouble;

const formFieldReducer = (state = initialState, action) => {
  switch (action.type) {
    case "REMOVE_COLOR":
      return {
        ...state,
        colors: state.colors.filter((option, index) => index !== action.payload),
      };
    case "RESET_ORDER_FORM":
      emptyCart();
      localStorage.removeItem("orderForm");
      return initialState;
    case "SAVE_LOCAL_ORDER_FORM":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_COLOR":
      return {
        ...state,
        colors: state.colors.length === 0 
          ? [{ 
              color: action.payload.color, 
              quantity: action.payload.quantity 
            }]
          : state.colors.map((option, index) =>
            index === action.payload.index
              ? { 
                  color: action.payload.color,
                  quantity: !!action.payload.quantity
                    ? action.payload.quantity
                    : option.quantity
                }
              : option
          ),
      };
    case "UPDATE_COLOR_QUANTITY":
      return {
        ...state,
        colors: state.colors.map((option, index) =>
          index === action.payload.index
            ? { ...option, quantity: action.payload.quantity }
            : option
        ),
      };
    case "UPDATE_ORDER_FORM":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_ORDER_FORM_FIELD":
      return {
        ...state,
        [action.payload.fieldName]: action.payload.value,
      };
    default:
      return state;
  }
};

export default formFieldReducer;
