import fs from 'fs';
import legacyOrders from './legacyOrders.json' assert { type: "json" };

/**
 * Convert a legacy WooCommerce order (as in legacyOrder.json)
 * to the new order format (as in order.json).
 * @param {Object} legacy Legacy order object
 * @returns {Object} New order object
 */
function convertLegacyOrder(legacy) {
    // Helper to extract meta value by key
    const getMeta = (metaArr, key) => {
        const found = metaArr.find(m => m.key === key);
        return found ? found.value : undefined;
    };

    // Extract extra data from meta_data
    const bandName = getMeta(legacy.meta_data || [], 'band-name') || '';
    const albumTitle = getMeta(legacy.meta_data || [], 'album-title') || '';
    const catalogNumber = getMeta(legacy.meta_data || [], 'catalog-number') || '';

    const extraAttrMap = [
        { attr: 'band-name', productName: 'Band Name', convertedValue: "bandName" },
        { attr: 'album-title', productName: 'Album Title', convertedValue: "albumTitle" },
        { attr: 'catalog-number', productName: 'Catalog Number', convertedValue: "catalogNumber" },
    ];
    
    const pricedCart = (legacy.line_items || []).map(item => {
        const base = {
            id: item.product_id,
            name: item.name,
            quantity: item.quantity,
        };
    
        if (item.sku) base.sku = item.sku;
        if (item.price) base.price = Number(item.price);
        if (item.total) base.total = Number(item.total);
    
        // Start with any existing variations
        let variation = [];
        if (item.meta_data && item.meta_data.length > 0) {
            variation = item.meta_data.map(meta => ({
                attribute: meta.key,
                value: meta.value
            }));
        }
    
        // Add extra attributes only to the relevant product
        extraAttrMap.forEach(({ attr, productName, convertedValue }) => {
            if (item.name === productName) {
                const value = getMeta(legacy.meta_data || [], attr);
                if (
                    value !== undefined &&
                    !variation.some(v => v.attribute === attr)
                ) {
                    variation.push({ attribute: convertedValue, value });
                }
            }
        });
    
        // If meta_data is empty but variation_id is set, add as variation
        if (variation.length === 0 && item.variation_id && item.variation_id !== 0) {
            variation.push({ attribute: "variation_id", value: item.variation_id });
        }
    
        if (variation.length > 0) base.variation = variation;
    
        return base;
    });

    // Compose shipping address
    const shipping = legacy.shipping || {};
    const shippingAddress = {
        address1: shipping.address_1 || "",
        address2: shipping.address_2 || "",
        city: shipping.city || "",
        country: shipping.country || "",
        firstName: shipping.first_name || "",
        lastName: shipping.last_name || "",
        postcode: shipping.postcode || "",
        state: shipping.state || ""
    };

    // Compose billing address
    const billing = legacy.billing || {};
    const billingAddress = {
        address1: billing.address_1 || "",
        address2: billing.address_2 || "",
        city: billing.city || "",
        company: billing.company || "",
        country: billing.country || "",
        firstName: billing.first_name || "",
        lastName: billing.last_name || "",
        phone: billing.phone || "",
        postcode: billing.postcode || "",
        state: billing.state || ""
    };

    // Compose shipping option
    const shippingLine = (legacy.shipping_lines && legacy.shipping_lines[0]) || {};
    const selectedShippingOption = {
        serviceCode: shippingLine.method_id || "",
        serviceName: shippingLine.name || "",
        shipmentCost: Number(shippingLine.total || 0),
        otherCost: 0,
        totalCost: Number(shippingLine.total || 0)
    };

    // Compose new order object
    return {
        id: legacy.id,
        userId: legacy.customer_id,
        externalOrderId: legacy.payment_method.replace("bacs", "bank_transfer-wc").replace("ppcp-gateway", "paypal-wc") || "",
        externalOrder: "",
        status: legacy.status ? legacy.status.toUpperCase() : "",
        pricedCart,
        shippingAddress,
        billingAddress,
        selectedShippingOption,
        totalPrice: legacy.total || "0",
        createdAt: legacy.date_created?.date || "",
        updatedAt: legacy.date_modified?.date || "",
    };
}

let newOrders = [];
legacyOrders.forEach(legacy => {
    const converted = convertLegacyOrder(legacy);
    newOrders.push(converted);
});

fs.writeFileSync('convertedOrders.json', JSON.stringify(newOrders, null, 2));
console.log("Converted orders saved to convertedOrders.json");