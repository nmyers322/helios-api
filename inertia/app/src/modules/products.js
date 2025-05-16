import { albumTypeName } from "../components/form/orderform/AlbumType";
import { insertFinishName } from "../components/form/orderform/InsertFinish";
import { insertPrintName } from "../components/form/orderform/InsertPrint";
import { outerPackagingFinishName } from "../components/form/orderform/OuterPackagingFinish";
import { outerPackagingPrintName } from "../components/form/orderform/OuterPackagingPrint";
import { outerPackagingTypeName } from "../components/form/orderform/OuterPackagingType";
import { isDoubleLP } from "../reducers/orderFormReducer";
import { isLocal } from "./environment";
import { heliosLogger } from "./logging";

export const CENTER_LABEL_QUANTUM = 1000;
export const INSERT_QUANTUM = 100;
export const OUTER_PACKAGING_QUANTUM = 500;
export const REVERSE_PRINT_MINIMUM_QUANTITY = 1000;

export const calculateCenterLabelsQuantity = (centerLabelsValue, totalQuantity) => {
    if (!centerLabelsValue || !totalQuantity) {
        return null;
    }
    if (centerLabelsValue === "customerSupplied") {
        return 0;
    }
    return Math.ceil(totalQuantity / CENTER_LABEL_QUANTUM) * CENTER_LABEL_QUANTUM;
}

export const calculateInsertQuantity = (insertTypeValue, totalQuantity) => {
    if (!insertTypeValue || !totalQuantity) {
        return null;
    }
    if (insertTypeValue === "customerSupplied" || insertTypeValue === "none") {
        return 0;
    }
    return Math.ceil(totalQuantity / INSERT_QUANTUM) * INSERT_QUANTUM;
}

export const calculateOuterPackagingQuantity = (outerPackagingTypeValue, outerPackagingFinishValue, totalQuantity) => {
    if (!outerPackagingTypeValue || !totalQuantity) {
        return null;
    }
    if (outerPackagingTypeValue === "customerSupplied" || outerPackagingTypeValue === "none") {
        return 0;
    }
    if (outerPackagingFinishValue === "reversePrint") {
        return REVERSE_PRINT_MINIMUM_QUANTITY;
    }
    // Outer packaging is calculated per 500 units
    return Math.ceil(totalQuantity / OUTER_PACKAGING_QUANTUM) * OUTER_PACKAGING_QUANTUM;
}

export const formatPrice = (price) => {
    if (!price) {
        return "";
    }
    return "$" + parseFloat(price).toFixed(2);
}

export const getPrice = (name, orderForm, products, variations, color) => {
    if (!name || !orderForm || !products || !variations) {
        heliosLogger("Missing required param (name, orderForm, products, variations)");
        return null;
    }
    const sku = getSkuFromName(name);
    if (!sku) {
        heliosLogger(`SKU not found for name: ${name}`);
        return null;
    }
    const product = products.find(product => product.sku === sku);
    if (!product) {
        heliosLogger(`Product not found for sku: ${sku}`);
        return null;
    }
    let inputValue = null;
    let price = null;
    let totalQuantity;
    let albumTypeFactor = isDoubleLP(orderForm) ? 2 : 1;
    switch (name) {
        case "albumType":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            if (!inputValue) {
                return null;
            }
            price = parseFloat(product.price);
            return !price ? null : price * albumTypeFactor;
        case "weight":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!inputValue || !totalQuantity) {
                return null;
            }
            price = getPriceFromProductVariation(product, inputValue, variations);
            return !price ? null : price * totalQuantity * albumTypeFactor;
        case "testPresses":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            if (!inputValue || !getValue(albumTypeName, orderForm)) {
                return null;
            }
            price = getPriceFromProductVariation(product, getValue(albumTypeName, orderForm), variations);
            let testPressSetupFee = products.find(product => 
                product.sku === namesToSku[isDoubleLP(orderForm) ? "testPressSetupFeeDoubleLP" : "testPressSetupFeeSingleLP"]);
            if (!testPressSetupFee) {
                heliosLogger("Test press setup fee product not found");
                return null;
            }
            return !price ? null : (price * inputValue) + parseFloat(testPressSetupFee.price);
        case "color":
            if (!orderForm.colors || orderForm.colors.length < 1) {
                return null;
            }
            price = getPriceFromProductVariation(product, getColorOrBlackValue(color), variations);
            return !price ? null : price * color.quantity * albumTypeFactor;
        case "colorSetupFee":
            if (!orderForm.colors || orderForm.colors.length < 1) {
                return null;
            }
            if (getColorOrBlackValue(color) === "black") {
                return 0;
            }
            price = parseFloat(product.price);
            return !price ? null : price * albumTypeFactor;
        case "colorSetupFeeTotal":
            if (!orderForm.colors || orderForm.colors.length < 1) {
                return null;
            }
            price = parseFloat(product.price);
            return !price ? null : price * orderForm.colors.filter((color) => getColorOrBlackValue(color) !== "black").length * albumTypeFactor;
        case "centerLabel":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!inputValue || !totalQuantity) {
                return null;
            }
            let centerLabelsQuantity = calculateCenterLabelsQuantity(inputValue, totalQuantity);
            price = getPriceFromProductVariation(product, "n" + centerLabelsQuantity, variations);
            return !price ? null : price * albumTypeFactor;
        case "innersleeve":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!inputValue || !totalQuantity) {
                return null;
            }
            price = getPriceFromProductVariation(product, inputValue, variations);
            return !price ? null : price * totalQuantity * albumTypeFactor;
        case "outerPackaging":
            let outerPackagingTypeValue = getValue(outerPackagingTypeName, orderForm);
            let outerPackagingPrintValue = getValue(outerPackagingPrintName, orderForm);
            let outerPackagingFinishValue = getValue(outerPackagingFinishName, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!outerPackagingTypeValue || !outerPackagingPrintValue || !outerPackagingFinishValue || !totalQuantity) {
                return null;
            }
            let outerPackagingQuantity = calculateOuterPackagingQuantity(outerPackagingTypeValue, outerPackagingFinishValue, totalQuantity);
            let variationId = outerPackagingTypeValue + ", " + outerPackagingFinishValue + ", n" + outerPackagingQuantity;
            price = getPriceFromProductVariation(product, variationId, variations);
            return !price ? null : price;
        case "insert":
            if (!orderForm[insertPrintName] || !orderForm[insertFinishName]) {
                return null;
            }
            let insertPrintValue = orderForm[insertPrintName].value;
            let insertFinishValue = orderForm[insertFinishName].value;
            totalQuantity = orderForm["totalQuantity"];
            if (!insertPrintValue || !insertFinishValue || !totalQuantity) {
                return null;
            }
            let insertQuantity = calculateInsertQuantity(getValue(insertPrintName, orderForm), totalQuantity);
            price = getPriceFromProductVariation(product, "n" + insertQuantity, variations);
            return !price ? null : price;
        case "polybag":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!inputValue || !totalQuantity) {
                return null;
            }
            price = getPriceFromProductVariation(product, inputValue, variations);
            return !price ? null : price * totalQuantity;
        case "assemblyOption":
            if (!orderForm[name]) {
                return null;
            }
            inputValue = getValue(name, orderForm);
            totalQuantity = orderForm["totalQuantity"];
            if (!inputValue || !totalQuantity) {
                return null;
            }
            price = getPriceFromProductVariation(product, inputValue, variations);
            return !price ? null : price * totalQuantity;
        default:
            return price;
    }
}

export const getPriceFromProductVariation = (product, variationName, variations) => {
    if (isLocal()) {
        return 1;
    }
    if (!product || !variationName || !variations) {
        heliosLogger("Missing required param (product, variationName, variations)");
        return null;
    }
    if (!variations[product.id]) {
        heliosLogger(`Variations not found for product id: ${product.id}`);
        return null;
    }
    const variation = variations[product.id].find(v => v.name === variationName.toString());
    if (!variation) {
        heliosLogger(`Variation not found for name: ${variationName}`);
        return null;
    }
    return parseFloat(variation.price);
}

export const getColorOrBlackValue = (color) => {
    if (!color) {
        return null;
    }
    return getColorValue(color)?.toLowerCase() === "black" ? "black" : "color";
}

export const getColorValue = (color) => {
    if (!color) {
        return null;
    }
    return color?.color?.value;
}

export const getIdFromName = (name, products) => {
    if (!name) {
        return null;
    }
    let sku = getSkuFromName(name);
    return products.find(product => product.sku === sku)?.id;
}

export const getProductFromId = (id, products) => {
    if (!id) {
        return null;
    }
    let product = products.find(product => product.id === id);
    if (!product) {
        return null;
    }
    return product;
}

export const getSkuFromName = (name) => 
    namesToSku[name] ? namesToSku[name] : null;

export const getValue = (name, orderForm) => {
    if (!name || !orderForm) {
        return null;
    }
    switch (name) {
        case "albumTitle":
        case "bandName":
        case "catalogNumber":
        case "testPresses":
        case "totalQuantity":
            return orderForm[name];
        default:
            return orderForm[name]?.value;
    }
}

export const namesToSku = {
    "albumTitle": "helios-album-title",
    "albumType": "helios-12inch-base-fee",
    "assemblyOption": "helios-12inch-assembly-option",
    "bandName": "helios-band-name",
    "catalogNumber": "helios-catalog-number",
    "centerLabel": "helios-12inch-center-labels",
    "color": "helios-12inch-color",
    "colorSetupFee": "helios-12inch-color-setup-fee",
    "colorSetupFeeTotal": "helios-12inch-color-setup-fee",
    "innersleeve": "helios-12inch-innersleeve",
    "insert": "helios-12inch-insert",
    "orderType": "helios-order-type",
    "outerPackaging": "helios-12inch-outer-packaging",
    "polybag": "helios-12inch-polybag",
    "testPresses": "helios-12inch-test-press",
    "testPressSetupFeeDoubleLP": "helios-12inch-test-press-setup-fee-double-lp",
    "testPressSetupFeeSingleLP": "helios-12inch-test-press-setup-fee-single-lp",
    "totalQuantity": "helios-total-quantity",
    "weight": "helios-12inch-weight",
}