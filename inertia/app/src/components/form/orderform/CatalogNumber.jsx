import React from "react";
import LabeledInput from "../main/LabeledInput";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderFormField } from "../../../actions/orderFormActions";
import { validateCatalogNumber } from "../../../modules/orderFormValidation";

export const catalogNumberName = "catalogNumber";
export const catalogNumberLabel = "Catalog Number";

const CatalogNumber = () => {
  const orderForm = useSelector((state) => state.orderForm);
  const dispatch = useDispatch();
  return (
    <LabeledInput
      ignorePackageLock={true}
      validationResponse={validateCatalogNumber(orderForm)}
      name={catalogNumberName}
      onChange={(e) =>
        dispatch(updateOrderFormField(catalogNumberName, e.target.value))
      }
      text={catalogNumberLabel}
      type="text"
      value={orderForm.catalogNumber}
    />
  );
}

export default CatalogNumber;