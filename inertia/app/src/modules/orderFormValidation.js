import { albumTypeOptions } from "../components/form/orderform/AlbumType";
import { weightOptions } from "../components/form/orderform/Weight";
import { centerLabelOptions } from "../components/form/orderform/CenterLabel";
import { outerPackagingTypeName, outerPackagingTypeOptions } from "../components/form/orderform/OuterPackagingType";
import { outerPackagingFinishOptions } from "../components/form/orderform/OuterPackagingFinish";
import { outerPackagingPrintOptions } from "../components/form/orderform/OuterPackagingPrint";
import { insertTypeOptions } from "../components/form/orderform/InsertType";
import { insertFinishOptions } from "../components/form/orderform/InsertFinish";
import { insertPrintOptions } from "../components/form/orderform/InsertPrint";
import { assemblyOptionOptions } from "../components/form/orderform/AssemblyOption";
import { PolybagOptions } from "../components/form/orderform/Polybag";
import { maximumQuantity, minimumQuantity, quantityFactor } from "../components/form/orderform/TotalQuantity";
import { getAvailableColors } from "./colors";
import { maximumTestPresses, minimumTestPresses } from "../components/form/orderform/TestPresses";
import { ALL_FIELDS_REQUIRED, ValidationResponse, validateNumberInput, validateOption, validateTextInput } from "./validation";
import { isDoubleLP } from "../reducers/orderFormReducer";
import { innersleeveOptions } from "../components/form/orderform/Innersleeve";
import { isPackageLocked } from "./packageDeals";


export const validateOrderFormObject = (orderForm) => {
  if (!orderForm) {
    return ValidationResponse.invalid("Fatal error: order form object is missing");
  }
  return ValidationResponse.valid();
};

export const validateOrderFormTextInput = (orderForm, field) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid ? validateTextInput(orderForm[field]) : response;
};

export const validateOrderFormOption = (orderForm, field, options) => {
  let response = validateOrderFormObject(orderForm);
  if (!response.isValid) return response;
  response = validateTextInput(orderForm[field]);
  return response.isValid ? validateOption(orderForm[field], options) : response;
};

export const validateOrderComment = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  if (!response.isValid) return response;
  if (!orderForm.orderComment) {
    return ValidationResponse.valid();
  }
  return ValidationResponse.testValidity(
    orderForm.orderComment.length <= 500,
    "Order comment must be 500 characters or less"
  );
};

export const validateAlbumTitle = (orderForm) => {
  return validateOrderFormTextInput(orderForm, "albumTitle");
}

export const validateBandName = (orderForm) => {
  return validateOrderFormTextInput(orderForm, "bandName");
}

export const validateCatalogNumber = (orderForm) => {
  return validateOrderFormTextInput(orderForm, "catalogNumber");
}

export const validateAlbumType = (orderForm) => {
  return validateOrderFormOption(orderForm, "albumType", albumTypeOptions);
}

export const validateWeight = (orderForm) => {
  return validateOrderFormOption(orderForm, "weight", weightOptions);
}

export const validateTotalQuantity = (orderForm) => {
  let response = validateNumberInput(orderForm.totalQuantity);
  if (!response.isValid) return response;
  response = ValidationResponse.testValidity(
    orderForm.totalQuantity >= minimumQuantity && 
    orderForm.totalQuantity <= maximumQuantity, 
    `Total quantity must be between ${minimumQuantity} and ${maximumQuantity}`);
  return response.isValid 
    ? ValidationResponse.testValidity(
      orderForm.totalQuantity % quantityFactor === 0, 
      `Total quantity must be a multiple of ${quantityFactor}`) 
    : response;
}

export const validateTestPresses = (orderForm) => {
  let response = validateNumberInput(orderForm.testPresses);
  return response.isValid
    ? ValidationResponse.testValidity(
      orderForm.testPresses >= minimumTestPresses && 
      orderForm.testPresses <= maximumTestPresses,
      `Test presses must be between ${minimumTestPresses} and ${maximumTestPresses}`)
    : response;
}

export const validateColor = (color) => {
  let response = validateColorOption(color);
  if (!response.isValid) return response;
  return validateColorQuantity(color);
}

export const validateColorOption = (color) =>
  validateOption(color.color, getAvailableColors());


export const validateColorQuantity = (color) => {
  let response = validateNumberInput(color.quantity);
  if (!response.isValid) return response;
  response = ValidationResponse.testValidity(
    color.quantity >= minimumQuantity &&
    color.quantity <= maximumQuantity,
    `Quantity of each color must be between ${minimumQuantity} and ${maximumQuantity}`);
  return response.isValid
    ? ValidationResponse.testValidity(
      color.quantity % quantityFactor === 0,
      `Quantity of each color must be a multiple of ${quantityFactor}`)
    : response;
}

export const validateAllColors = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  if (!response.isValid) return response;
  response = ValidationResponse.testValidity(
    orderForm.colors && orderForm.colors.length > 0,
    "At least one color must be selected");
  if (!response.isValid) return response;
  for (const color of orderForm.colors) {
    response = validateColor(color);
    if (!response.isValid) return response;
  }
  return ValidationResponse.testValidity(
    orderForm.colors.reduce((sum, color) => sum + color.quantity, 0) === orderForm.totalQuantity,
    `The sum of the quantities of each color must match the total quantity (${orderForm.totalQuantity})`);
}

export const validateAllColorsVerified = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? ValidationResponse.testValidity(
        orderForm.colorsVerified, 
        "You must select color options before continuing") 
    : response;
}

export const validateCenterLabel = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "centerLabel", centerLabelOptions) 
    : response;
}

export const validateInnersleeve = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid
    ? validateOrderFormOption(orderForm, "innersleeve", innersleeveOptions)
    : response;
}

export const validateOuterPackagingType = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  if (!response.isValid) return response;
  response = validateOrderFormOption(orderForm, "outerPackagingType", outerPackagingTypeOptions);
  if (!response.isValid) return response;
  if (isDoubleLP(orderForm) && orderForm.outerPackagingType.value === "standardJacket") {
    return ValidationResponse.invalid("Standard jacket is not available for double LPs");
  }
  return ValidationResponse.valid();
}

export const validateOuterPackagingPrint = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "outerPackagingPrint", outerPackagingPrintOptions) 
    : response;
}

export const validateOuterPackagingFinish = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "outerPackagingFinish", outerPackagingFinishOptions) 
    : response;
}

export const validateInsertType = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "insertType", insertTypeOptions) 
    : response;
}

export const validateInsertFinish = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "insertFinish", insertFinishOptions) 
    : response;
}

export const validateInsertPrint = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "insertPrint", insertPrintOptions) 
    : response;
}

export const validateAssemblyOption = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  if (!response.isValid) return response;
  if (orderForm[outerPackagingTypeName]?.value === "none") {
    return ValidationResponse.valid();
  }
  return validateOrderFormOption(orderForm, "assemblyOption", assemblyOptionOptions);
}

export const validatePolybag = (orderForm) => {
  let response = validateOrderFormObject(orderForm);
  return response.isValid 
    ? validateOrderFormOption(orderForm, "polybag", PolybagOptions) 
    : response;
}

export const validateAlbumDetailsCard = (orderForm) => {
  if (
    !validateBandName(orderForm).isValid ||
    !validateAlbumTitle(orderForm).isValid ||
    !validateCatalogNumber(orderForm).isValid ||
    !validateAlbumType(orderForm).isValid 
  ) {
    return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
  }
  return ValidationResponse.valid();
};

export const validateRecordDetailsCard = (orderForm) => {
  if (
    !validateWeight(orderForm).isValid || 
    !validateTotalQuantity(orderForm).isValid || 
    !validateTestPresses(orderForm).isValid
  ) {
    return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
  }
  return ValidationResponse.valid();
};

export const validateColorOptionsCard = (orderForm) => {
  const validationResponse = validateAllColors(orderForm);
  if (!validationResponse.isValid) {
    return ValidationResponse.invalid(validationResponse.errorMsg);
  }
  if (orderForm.totalQuantity !== orderForm.colors.reduce((sum, color) => sum + color.quantity, 0)) {
    return ValidationResponse.invalid("The total quantity must match the sum of the quantities of each color");
  }
  if (orderForm.totalQuantity < minimumQuantity || orderForm.totalQuantity > maximumQuantity) {
    return ValidationResponse.invalid(`Total quantity must be between ${minimumQuantity} and ${maximumQuantity}`);
  }
  return ValidationResponse.valid();
};

export const validateCenterLabelOptionsCard = (orderForm) => {
  if (!validateCenterLabel(orderForm).isValid) {
    return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
  }
  return ValidationResponse.valid();;
};

export const validateInnersleeveOptionsCard = (orderForm) => {
  if (!validateInnersleeve(orderForm).isValid) {
    return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
  }
  return ValidationResponse.valid();
};

export const validateOuterPackagingOptionsCard = (orderForm) => {
  if (validateOuterPackagingType(orderForm).isValid &&
    (orderForm.outerPackagingType.value === "none" || 
      orderForm.outerPackagingType.value === "customerSupplied" ||
      (validateOuterPackagingPrint(orderForm).isValid && 
        validateOuterPackagingFinish(orderForm).isValid))
  ) {
    return ValidationResponse.valid();
  }
  return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
};

export const validateInsertOptionsCard = (orderForm) => {
  if (validateInsertType(orderForm).isValid &&
    (orderForm.insertType.value === "none" || 
      orderForm.insertType.value === "customerSupplied" ||
      (validateInsertPrint(orderForm).isValid && 
        validateInsertFinish(orderForm).isValid))
  ) {
    return ValidationResponse.valid();
  }
  return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
};

export const validateAssemblyOptionsCard = (orderForm) => {
  if (
    !validateAssemblyOption(orderForm).isValid || 
    !validatePolybag(orderForm).isValid
  ) {
    return ValidationResponse.invalid(ALL_FIELDS_REQUIRED);
  }
  return ValidationResponse.valid();
};

export const validatePreviousStep = (orderForm, step) => {
  if (isPackageLocked(orderForm) && validateAlbumDetailsCard(orderForm).isValid) {
    return ValidationResponse.valid();
  }
  if (step === "album-details") {
    return ValidationResponse.valid();
  } else if (step === "record-details") {
    if (!validateAlbumDetailsCard(orderForm).isValid) {
      return ValidationResponse.invalid();
    }
  } else if (step === "color-options") {
    if (
      !validatePreviousStep(orderForm, "record-details").isValid ||
      !validateRecordDetailsCard(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "center-label-options") {
    if (
      !validatePreviousStep(orderForm, "color-options").isValid ||
      !validateColorOptionsCard(orderForm).isValid ||
      !validateAllColorsVerified(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "innersleeve-options") {
    if (
      !validatePreviousStep(orderForm, "center-label-options").isValid ||
      !validateCenterLabelOptionsCard(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "outer-packaging-options") {
    if (
      !validatePreviousStep(orderForm, "innersleeve-options").isValid ||
      !validateInnersleeve(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "insert-options") {
    if (
      !validatePreviousStep(orderForm, "outer-packaging-options").isValid ||
      !validateOuterPackagingOptionsCard(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "assembly-options") {
    if (
      !validatePreviousStep(orderForm, "insert-options").isValid ||
      !validateInsertOptionsCard(orderForm).isValid
    ) {
      return ValidationResponse.invalid();
    }
  } else if (step === "summary") {
    if (
      !validatePreviousStep(orderForm, "assembly-options").isValid ||
      !validateAssemblyOptionsCard(orderForm).isValid
    ) {
      return ValidationResponse.invalid("One of the previous steps is invalid. Please go back and check your inputs.");
    }
  }
  return ValidationResponse.valid();
};

export const validateCompleteOrderForm = (orderForm) => {
  if (!validateOrderComment(orderForm).isValid) {
    return ValidationResponse.invalid("Order comment must be 500 characters or less");
  }
  return validatePreviousStep(orderForm, "summary");
}

export const isOrderInProgress = (orderForm) => {
  return validateAlbumDetailsCard(orderForm).isValid;
}

export const getCurrentOrderStep = (orderForm) => {
  if (!isOrderInProgress(orderForm)) {
    return "album-details";
  } else if (!validateRecordDetailsCard(orderForm).isValid) {
    return "record-details";
  } else if (!validateColorOptionsCard(orderForm).isValid) {
    return "color-options";
  } else if (!validateCenterLabelOptionsCard(orderForm).isValid) {
    return "center-label-options";
  } else if (!validateInnersleeveOptionsCard(orderForm).isValid) {
    return "innersleeve-options";
  } else if (!validateOuterPackagingOptionsCard(orderForm).isValid) {
    return "outer-packaging-options";
  } else if (!validateInsertOptionsCard(orderForm).isValid) {
    return "insert-options";
  } else if (!validateAssemblyOptionsCard(orderForm).isValid) {
    return "assembly-options";
  } else {
    return "summary";
  }
}