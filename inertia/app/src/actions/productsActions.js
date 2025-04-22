import { heliosLogger } from "../modules/logging";
import { fetchAllProducts, fetchProductVariations } from "../modules/wordpressApi";

export const PRODUCT_KEYS_TO_KEEP = ["id", "name", "price", "sku"];
export const VARIATION_KEYS_TO_KEEP = ["id", "name", "price", "sku"];

export const fetchingProductsOrVariations = (value) => ({
    type: "FETCHING_PRODUCTS_OR_VARIATIONS",
    payload: value,
});

export const fetchAllProductsAndAllVariations = async (dispatch) => {
    dispatch(fetchingProductsOrVariations(true));
    let caughtAnyErrors = false;
    try {
        const products = await fetchAllProducts();
        dispatch(setProducts(products));
        await Promise.all(products.map(async product => {
            try {
                const variations = await fetchProductVariations(product.id);
                dispatch(setProductVariations(product.id, variations));
            } catch (error) {
                caughtAnyErrors = true;
                heliosLogger(`Error fetching variations for product ${product.id}:`, error);
            }
        }));
    } catch (error) {
        caughtAnyErrors = true;
        heliosLogger('Error fetching products:', error);
    }
    if (caughtAnyErrors) {
        dispatch(invalidateProductCache());
    }
    dispatch(fetchingProductsOrVariations(false));
}

export const invalidateProductCache = () => ({
    type: "INVALIDATE_PRODUCT_CACHE",
});

export const setProducts = (products) => {
    return {
        type: "SET_PRODUCTS",
        payload: products.map(product =>
            Object.fromEntries(Object.entries(product)
                .filter(([key, value]) => PRODUCT_KEYS_TO_KEEP.includes(key))))
    };
};

export const setProduct = (productId, product) => ({
    type: "SET_PRODUCT",
    payload: {
        productId,
        product: Object.fromEntries(Object.entries(product)
            .filter(([key, value]) => PRODUCT_KEYS_TO_KEEP.includes(key))),
    }
});

export const setProductVariations = (productId, variations) => ({
    type: "SET_PRODUCT_VARIATIONS",
    payload: {
        productId,
        variations: variations.map(variation =>
            Object.fromEntries(Object.entries(variation)
                .filter(([key, value]) => VARIATION_KEYS_TO_KEEP.includes(key))))
    }
});

export const setVariations = (variationMap) => ({
    type: "SET_VARIATIONS",
    payload: Object.fromEntries(Object.entries(variationMap)
        .map(([productId, variations]) => [
            productId,
            variations.map(variation =>
                Object.fromEntries(Object.entries(variation)
                    .filter(([key, value]) => VARIATION_KEYS_TO_KEEP.includes(key))))
        ]))
});