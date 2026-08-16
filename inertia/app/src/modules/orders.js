import { albumTypeName } from "../components/form/orderform/AlbumType";
import { getSkuFromName } from "./products";
import { getAllColors } from "./weighedColors.js";

export { getAllColors };

export const getCartItem = (name, order) => {
    return order?.pricedCart
        ?.find(item => item.sku === getSkuFromName(name));
}

export const getCartItemMetaData = (item, key) => {
    return item?.variation?.find(v => v.attribute === key)?.value;
}

export const getLineItem = (name, order, color) => {
    if (color) {
        return order?.line_items?.find(item => item.sku === getSkuFromName(name) && item.meta_data?.map(data => data.value) === color);
    }
    return order?.line_items?.find(item => item.sku === getSkuFromName(name));
}

export const getLineItemMetaData = (item, key) => {
    return item?.meta_data?.find(data => data.display_key === key)?.value;
}

export const getOrderMetaData = (name, order) =>
    order?.pricedCart
        ?.find(item => item.variation?.map(v => v.attribute)?.includes(name))
        ?.variation.find(v => v.attribute === name)
        ?.value;

export const getOrderNumber = () => 
    window.location.pathname.split("/")[3];

export const isDoubleLP = order => 
    getOrderMetaData(albumTypeName, order) === "double";