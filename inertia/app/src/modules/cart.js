import { albumTitleName } from "../components/form/orderform/AlbumTitle";
import { albumTypeName, albumTypeOptionDouble } from "../components/form/orderform/AlbumType";
import { assemblyOptionName } from "../components/form/orderform/AssemblyOption";
import { bandNameName } from "../components/form/orderform/BandName";
import { catalogNumberName } from "../components/form/orderform/CatalogNumber";
import { centerLabelName } from "../components/form/orderform/CenterLabel";
import { innersleeveName } from "../components/form/orderform/Innersleeve";
import { insertFinishName } from "../components/form/orderform/InsertFinish";
import { insertPrintName } from "../components/form/orderform/InsertPrint";
import { insertTypeName } from "../components/form/orderform/InsertType";
import { outerPackagingFinishName } from "../components/form/orderform/OuterPackagingFinish";
import { outerPackagingPrintName } from "../components/form/orderform/OuterPackagingPrint";
import { outerPackagingTypeName } from "../components/form/orderform/OuterPackagingType";
import { polybagName } from "../components/form/orderform/Polybag";
import { testPressesName } from "../components/form/orderform/TestPresses";
import { totalQuantityName } from "../components/form/orderform/TotalQuantity";
import { weightName } from "../components/form/orderform/Weight";
import { isDoubleLP } from "../reducers/orderFormReducer";
import { heliosLogger } from "./logging";
import { validateCompleteOrderForm } from "./orderFormValidation";
import { calculateCenterLabelsQuantity, calculateInsertQuantity, calculateOuterPackagingQuantity, getColorOrBlackValue, getColorValue, getIdFromName, getProductFromId, getSkuFromName, getValue } from "./products";
import { sanitizeUserInput } from "./serialization";
import { ValidationResponse } from "./validation";
import { addToCartBatch, deleteAllCartItems } from "./wordpressApi";

export const addOrderFormToCart = async (orderForm, products) => {
    return;
}

export const buildCartFromOrderForm = async (orderForm, products) => {
    if (!validateCompleteOrderForm(orderForm).isValid) {
        return;
    }

    const items = [];
    const addItemToCart = (productId, quantity, variations, userInput) => {
        const variationsEqual = (a, b) => {
            if (!a && !b) return true;
            if (!a || !b) return false;
            if (a.length !== b.length) return false;
            return a.every((v, i) => v.attribute === b[i].attribute && v.value === b[i].value);
        }
        let product = getProductFromId(productId, products);
        let item = {
            id: productId,
            name: product?.name,
            sku: product?.sku,
            quantity: quantity
        };
        if (variations && variations.length > 0) {
            item.variation = variations;
        };
        if (userInput) {
            item.heliosUserInput = sanitizeUserInput(userInput);
        }
        let existingItem = items.find(i =>
            i.sku === item.sku && variationsEqual(i.variation, item.variation));
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            items.push(item);
        }
    };
    const getFormValue = (name) => getValue(name, orderForm);
    const buildVariation = (attribute) => ({
        attribute,
        value: getFormValue(attribute)
    });
    const buildVariationWithQuantity = (quantity) => ({
        attribute: "quantity",
        value: quantity
    });
    const buildVariationWithNoneValue = (attribute) => ({
        attribute,
        value: "none"
    });
    const getProductId = (name) => getIdFromName(name, products);
    const totalQuantity = orderForm[totalQuantityName];
    const albumTypeFactor = isDoubleLP(orderForm) ? 2 : 1;

    // Order Type - Hardcoded to 12-inch, will need to change if you add more order types
    addItemToCart(getProductId("orderType"), 1, [{ attribute: "orderType", value: "12-inch" }]);

    // Band Name
    addItemToCart(getProductId(bandNameName), 1, [buildVariation(bandNameName)], orderForm[bandNameName]);

    // Album Title
    addItemToCart(getProductId(albumTitleName), 1, [buildVariation(albumTitleName)], orderForm[albumTitleName]);

    // Catalog Number
    addItemToCart(getProductId(catalogNumberName), 1, [buildVariation(catalogNumberName)], orderForm[catalogNumberName]);

    // Album type
    addItemToCart(getProductId(albumTypeName), getFormValue(albumTypeName) === albumTypeOptionDouble ? 2 : 1);

    // Weight
    const weightProductId = getProductId(weightName);
    addItemToCart(weightProductId, totalQuantity * albumTypeFactor, [buildVariation(weightName)]);

    // Total Quantity
    addItemToCart(getProductId(totalQuantityName), getFormValue(totalQuantityName));

    // Test presses
    if (isDoubleLP(orderForm)) {
        addItemToCart(getProductId("testPressSetupFeeDoubleLP"), 1);
    } else {
        addItemToCart(getProductId("testPressSetupFeeSingleLP"), 1);
    }
    addItemToCart(getProductId(testPressesName), orderForm[testPressesName], [buildVariation(albumTypeName)]);

    // Colors
    orderForm.colors.forEach(color => {
        const colorProductId = getProductId("color");
        const colorOrBlackValue = getColorOrBlackValue(color);
        const colorVariations = [
            {
                attribute: "color",
                value: getColorValue(color)
            },
            {
                attribute: "baseFee",
                value: colorOrBlackValue
            },
            {
                attribute: "selectedQuantity",
                value: color.quantity
            }
        ];
        addItemToCart(colorProductId, color.quantity * albumTypeFactor, colorVariations);

        // Color setup fee
        if (colorOrBlackValue !== "black") {
            addItemToCart(getProductId("colorSetupFee"), albumTypeFactor);
        }
    });

    // Center labels
    const centerLabelQuantity = calculateCenterLabelsQuantity(getFormValue(centerLabelName), totalQuantity);
    const centerLabelProductId = getProductId(centerLabelName);
    const centerLabelVariations = [buildVariation(centerLabelName)];
    if (centerLabelQuantity > 0) {
        centerLabelVariations.push(buildVariationWithQuantity("n" + centerLabelQuantity));
    }
    addItemToCart(centerLabelProductId, 1 * albumTypeFactor, centerLabelVariations);

    // Innersleeve
    const innersleeveProductId = getProductId(innersleeveName);
    const innersleeveVariations = [buildVariation(innersleeveName)];
    addItemToCart(innersleeveProductId, totalQuantity * albumTypeFactor, innersleeveVariations);

    // Outer packaging
    const outerPackagingProductId = getProductId("outerPackaging");
    const outerPackagingQuantity = calculateOuterPackagingQuantity(getFormValue(outerPackagingTypeName), getFormValue(outerPackagingFinishName), totalQuantity);
    let outerPackagingVariations = [buildVariation(outerPackagingTypeName)];
    if (getFormValue(outerPackagingTypeName) !== "none" && getFormValue(outerPackagingTypeName) !== "customerSupplied") {
        outerPackagingVariations.push(buildVariation(outerPackagingPrintName));
        outerPackagingVariations.push(buildVariation(outerPackagingFinishName));
        if (outerPackagingQuantity > 0) {
            outerPackagingVariations.push({ attribute: "outerPackagingAmount", value: "n" + outerPackagingQuantity });
        }
    } else {
        outerPackagingVariations.push(buildVariationWithNoneValue(outerPackagingPrintName));
        outerPackagingVariations.push(buildVariationWithNoneValue(outerPackagingFinishName));
        outerPackagingVariations.push({ attribute: "outerPackagingAmount", value: "none" });
    }
    addItemToCart(outerPackagingProductId, 1, outerPackagingVariations);

    // Inserts
    const insertProductId = getProductId("insert");
    const insertVariations = [buildVariation(insertTypeName)];
    if (getFormValue(insertTypeName) !== "none" && getFormValue(insertTypeName) !== "customerSupplied") {
        insertVariations.push(buildVariation(insertPrintName));
        insertVariations.push(buildVariation(insertFinishName));
        const insertQuantity = calculateInsertQuantity(getFormValue(insertTypeName), totalQuantity);
        if (insertQuantity > 0) {
            insertVariations.push(buildVariationWithQuantity("n" + insertQuantity));
        }
    } else {
        insertVariations.push(buildVariationWithNoneValue(insertPrintName));
        insertVariations.push(buildVariationWithNoneValue(insertFinishName));
        insertVariations.push(buildVariationWithQuantity("none"));
    }
    addItemToCart(insertProductId, 1, insertVariations);

    // Polybags
    const polybagProductId = getProductId(polybagName);
    addItemToCart(polybagProductId, totalQuantity, [buildVariation(polybagName)]);

    // Assembly options
    if (getFormValue(outerPackagingTypeName) !== "none") {
        const assemblyOptionProductId = getProductId(assemblyOptionName);
        addItemToCart(assemblyOptionProductId, 1, [buildVariation(assemblyOptionName)]);
    }
    
    heliosLogger("Adding order form to cart", items);

    return items;
};

export const cartIsEmpty = (cart) =>
    !cart || !cart.items || cart.items.length === 0;

export const emptyCart = async (cart) => {
    if (cartIsEmpty(cart)) {
        return;
    }
    return deleteAllCartItems();
}

export const getCartItem = (cart, name) => {
    if (cartIsEmpty(cart)) {
        return null;
    }
    let sku = getSkuFromName(name);
    if (!sku) {
        return null;
    }
    return cart.items.find(item => item.sku === sku);
}

export const getCartItems = (cart, name) => {
    if (cartIsEmpty(cart)) {
        return null;
    }
    let sku = getSkuFromName(name);
    if (!sku) {
        return null;
    }
    return cart.items.filter(item => item.sku === sku);
}

export const getCartItemVariation = (cart, name, variation, item) => {
    if (cartIsEmpty(cart)) {
        return null;
    }
    if (!item) {
        item = getCartItem(cart, name);
    }
    if (!item) {
        return null;
    }
    return item.variation?.find(v => v.attribute === variation)?.value;
}

export const isCartDoubleLP = (cart) => {
    let item = getCartItem(cart, "albumType");
    if (!item) {
        return false;
    }
    return item.quantity === 2;
}

export const orderFormSameAsCart = (orderForm, cart) => {
    // To-do: Implement this function
    return false;
}

export const validateCart = async (cart) => {
    if (!cart || !cart.items || cart.items.length === 0) {
        return ValidationResponse.invalid("Cart is empty");
    }
    // Find helios-12inch-base-fee, it can have one or two
    const baseFee = cart.items.filter(item => item.productSku === "helios-12inch-base-fee")
    if (baseFee.length !== 1 || baseFee[0].quantity < 1 || baseFee[0].quantity > 2) {
        return ValidationResponse.invalid("Must have 1 or 2 12-inch base fees");
    }
    // helios-12inch-weight: We accept one weight per order (160g or 180g)
    const weight = cart.items.filter(item => item.productSku === "helios-12inch-weight")
    if (weight.length !== 1) {
        return ValidationResponse.invalid("Must have 1 12-inch weight");
    }
    // There's more validation but I'm out of time. To-do: Add more validation
    return ValidationResponse.invalid("Cart validation method is incomplete");
}

export const getAttributeValue = (pricedCart, attribute) => {
    return pricedCart
        ?.find((item) => item.variation
            ?.some((v) => v.attribute === attribute))
        ?.variation
        ?.find((v) => v.attribute === attribute)
        ?.value;
}

export const getItemBySku = (pricedCart, sku) => {
    return pricedCart?.find(item => item.sku === sku) || null;
};

export const getAlbumType = (pricedCart) => {
    let twelveInchType = pricedCart.find(i => i.sku === "helios-12inch-base-fee");
    if (twelveInchType?.quantity === 1) {
        return "12 inch - Single LP";
    } else if (twelveInchType?.quantity === 2) {
        return "12 inch - Double LP";
    }
    return "";
};

export const getRecordSetupFee = (pricedCart) => {
    let setupFee = getItemBySku(pricedCart, "helios-12inch-base-fee")?.total;
    if (setupFee) {
        setupFee = Math.round(setupFee * 100) / 100;
    }
    return setupFee || 0;
};

export const getTestPresses = (pricedCart) => {
    let albumType = getAlbumType(pricedCart);
    let quantity, total;
    if (albumType === "12 inch - Single LP") {
        quantity = getItemBySku(pricedCart, "helios-12inch-test-press")?.quantity;
        total = getItemBySku(pricedCart, "helios-12inch-test-press")?.total || 0;
        total += getItemBySku(pricedCart, "helios-12inch-test-press-setup-fee-single-lp")?.total || 0;
    } else if (albumType === "12 inch - Double LP") {
        quantity = getItemBySku(pricedCart, "helios-12inch-test-press")?.quantity;
        total = getItemBySku(pricedCart, "helios-12inch-test-press")?.total || 0;
        total += getItemBySku(pricedCart, "helios-12inch-test-press-setup-fee-double-lp")?.total || 0;
    }
    return {
        quantity: quantity || 0,
        total: total || 0
    };
};

export { getWeighedColorItems } from './weighedColors.js';

export const getCenterLabelLabel = (pricedCart) => {
    const centerLabelOptions = [
        { value: "bw", label: "Black and White Only" },
        { value: "color", label: "Full Color" },
        { value: "customerSupplied", label: "Customer Supplied" },
    ];
    const centerLabelOption = getAttributeValue(pricedCart, "centerLabel");
    if (!centerLabelOption) return null;
    const label = centerLabelOptions.find(option => option.value === centerLabelOption);
    return {
        label: label ? label.label : null,
        total: getItemBySku(pricedCart, "helios-12inch-center-labels")?.total || 0
    };
};

export const getOuterPackaging = (pricedCart) => {
    const outerPackagingFinishOptions = [
        { value: "standardGloss", label: "Standard Gloss" },
        { value: "matteVarnish", label: "Matte Varnish" },
        { value: "highGlossUVVarnish", label: "High Gloss UV Varnish" },
        { value: "reversePrint", label: "Reverse Print" },
    ];
    const outerPackagingPrintOptions = [
        { value: "bw", label: "Black and White Only" },
        { value: "color", label: "Full Color" },
    ];
    const outerPackagingTypeOptions = [
        { value: "standardJacket", label: "Standard Jacket" },
        { value: "wideSpineJacket", label: "Wide Spine Jacket" },
        { value: "gatefoldJacket", label: "Gatefold Jacket" },
        { value: "customerSupplied", label: "Customer Supplied" },
        { value: "none", label: "None" },
    ];
    const outerPackagingType = getAttributeValue(pricedCart, "outerPackagingType");
    const outerPackagingPrint = getAttributeValue(pricedCart, "outerPackagingPrint");
    const outerPackagingFinish = getAttributeValue(pricedCart, "outerPackagingFinish");
    const total = getItemBySku(pricedCart, "helios-12inch-outer-packaging")?.total;
    let label = "";
    if (outerPackagingType) {
        label += (outerPackagingTypeOptions.find(option => option.value === outerPackagingType)?.label || "");
    }
    if (outerPackagingPrint && outerPackagingType !== "none" && outerPackagingType !== "customerSupplied") {
        if (label) label += " - ";
        label += (outerPackagingPrintOptions.find(option => option.value === outerPackagingPrint)?.label || "");
    }
    if (outerPackagingFinish && outerPackagingType !== "none" && outerPackagingType !== "customerSupplied") {
        if (label) label += " - ";
        label += (outerPackagingFinishOptions.find(option => option.value === outerPackagingFinish)?.label || "");
    }
    return {
        type: outerPackagingType,
        print: outerPackagingPrint,
        finish: outerPackagingFinish,
        total: total ? total : 0,
        label: label
    };
};

export const getInnersleeveLabel = (pricedCart) => {
    const innersleeveOptions = [
        { value: "whitePaperSleeve", label: "White Paper Sleeve" },
        { value: "blackPolylinedSleeve", label: "Black Polylined Sleeve" },
        { value: "none", label: "None" },
    ];
    const innersleeveValue = getAttributeValue(pricedCart, "innersleeve");
    if (!innersleeveValue) return null;
    const label = innersleeveOptions.find(opt => opt.value === innersleeveValue)?.label || innersleeveValue;
    const total = getItemBySku(pricedCart, "helios-12inch-innersleeve")?.total || 0;
    return { label, total };
};

export const getAssemblyOptionLabel = (pricedCart) => {
    const assemblyOptionOptions = [
        { value: "insertRecordInJacket", label: "Insert Record In Jacket" },
        { value: "placeRecordBehindJacket", label: "Place Record Behind Jacket" },
    ];
    const assemblyValue = getAttributeValue(pricedCart, "assemblyOption");
    if (!assemblyValue) return null;
    const label = assemblyOptionOptions.find(opt => opt.value === assemblyValue)?.label || assemblyValue;
    const total = getItemBySku(pricedCart, "helios-12inch-assembly-option")?.total || 0;
    return { label, total };
};

export const getInsertLabel = (pricedCart) => {
    const insertTypeOptions = [
        { value: "one", label: "One Side" },
        { value: "two", label: "Two Sides" },
        { value: "customerSupplied", label: "Customer Supplied" },
        { value: "none", label: "None" },
    ];
    const insertType = getAttributeValue(pricedCart, "insertType");
    if (!insertType) return null;
    const label = insertTypeOptions.find(opt => opt.value === insertType)?.label || insertType;
    const total = getItemBySku(pricedCart, "helios-12inch-insert")?.total || 0;
    return { label, total };
};

export const getPolybagLabel = (pricedCart) => {
    const polybagOptions = [
        { value: "polybag", label: "Polybag" },
        { value: "resealablePolybag", label: "Resealable Polybag" },
        { value: "none", label: "None" },
    ];
    const polybagValue = getAttributeValue(pricedCart, "polybag");
    if (!polybagValue) return null;
    const label = polybagOptions.find(opt => opt.value === polybagValue)?.label || polybagValue;
    const total = getItemBySku(pricedCart, "helios-12inch-polybag")?.total || 0;
    return { label, total };
};

export const getWeight = (pricedCart) => {
    const weightOptions = [
        { value: "160g", label: "Standard (160g)" },
        { value: "180g", label: "Heavy (180g)" },
    ];
    const weight = getAttributeValue(pricedCart, "weight");
    if (!weight) return null;
    return {
        label: weightOptions.find(opt => opt.value === weight)?.label || weight,
        total: getItemBySku(pricedCart, "helios-12inch-weight")?.total || 0
    };
};