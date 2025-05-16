import { albumTitleName } from "../components/form/orderform/AlbumTitle";
import { albumTypeName } from "../components/form/orderform/AlbumType";
import { bandNameName } from "../components/form/orderform/BandName";
import { catalogNumberName } from "../components/form/orderform/CatalogNumber";
import { heliosLogger } from "./logging";
import { getSkuFromName } from "./products";

export const getAllColors = order =>
    order?.pricedCart?.filter(item =>
        item.sku === getSkuFromName("color"))
        .map(item => ({
            baseFeeType: getCartItemMetaData(item, "baseFee"),
            name: getCartItemMetaData(item, "color"),
            quantity: item.quantity,
            total: item.total,
        }));

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