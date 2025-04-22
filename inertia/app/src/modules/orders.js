import { albumTitleName } from "../components/form/orderform/AlbumTitle";
import { albumTypeName } from "../components/form/orderform/AlbumType";
import { bandNameName } from "../components/form/orderform/BandName";
import { catalogNumberName } from "../components/form/orderform/CatalogNumber";
import { getSkuFromName } from "./products";

export const getAllColors = order =>
    order?.line_items?.filter(item => 
            item.sku === getSkuFromName("color"))
        .map(item => ({
            baseFeeType: item.meta_data?.find(data => data.key === "basefee")?.value,
            name: item.meta_data?.find(data => data.key === "color")?.value,
            quantity: item.quantity,
            total: item.total,
        }));

export const getLineItem = (name, order, color) => {
    if (color) {
        return order?.line_items?.find(item => item.sku === getSkuFromName(name) && item.meta_data?.map(data => data.value) === color);
    }
    return order?.line_items?.find(item => item.sku === getSkuFromName(name));
}

export const getLineItemMetaData = (item, key) => {
    return item?.meta_data?.find(data => data.display_key === key)?.value;
}

export const getOrderMetaData = (name, order) => {
    let metaProperties = {
        [albumTitleName]: "album-title",
        [bandNameName]: "band-name",
        [catalogNumberName]: "catalog-number"
    }
    if (metaProperties[name]) {
        return order?.meta_data?.find(data => data.key === metaProperties[name])?.value;
    }
    return null;
}

export const getOrderNumber = () => 
    window.location.pathname.split("/")[3];

export const isDoubleLP = order => 
    order?.line_items?.find(item => item.sku === getSkuFromName(albumTypeName))?.quantity === 2;