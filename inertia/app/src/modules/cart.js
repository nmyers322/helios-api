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
import { calculateCenterLabelsQuantity, calculateInsertQuantity, calculateOuterPackagingQuantity, getColorOrBlackValue, getColorValue, getIdFromName, getSkuFromName, getValue } from "./products";
import { sanitizeUserInput } from "./serialization";
import { ValidationResponse } from "./validation";
import { addToCartBatch, deleteAllCartItems } from "./wordpressApi";

export const addOrderFormToCart = async (orderForm, products) => {
    if (!validateCompleteOrderForm(orderForm).isValid) {
        return;
    }

    const items = [];
    const addItemToCart = (productId, quantity, variations, userInput) => {
        let item = {
            id: productId,
            quantity: quantity
        };
        if (variations && variations.length > 0) {
            item.variation = variations;
        };
        if (userInput) {
            item.heliosUserInput = sanitizeUserInput(userInput);
        }
        items.push(item);
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
    const centerLabelVariations = [
        buildVariation(centerLabelName),
        buildVariationWithQuantity("n" + centerLabelQuantity),
    ];
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
        outerPackagingVariations.push({ attribute: "outerPackagingAmount", value: "n" + outerPackagingQuantity });
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
        insertVariations.push(buildVariationWithQuantity("n" + insertQuantity));
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

    await addToCartBatch(items);
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