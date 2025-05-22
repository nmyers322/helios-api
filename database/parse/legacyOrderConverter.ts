// import fs from 'fs';
// import legacyOrders from './legacyOrders.json' assert { type: "json" };

import { OrderStatus } from "#models/order";
import Product from "#models/product";

// Example interfaces (customize as needed)
interface MetaData {
  key: string;
  value: any;
}

interface LineItem {
  product_id: number;
  name: string;
  quantity: number | string;
  sku?: string;
  price?: number | string;
  total?: number | string;
  meta_data?: MetaData[];
  variation_id?: number;
  [key: string]: any; // Allow string-based property access
}

interface LegacyOrder {
  id: number;
  customer_id: number;
  payment_method: string;
  status: "on-hold" | "checkout-draft" | "processing" | "pending" | string;
  line_items: LineItem[];
  meta_data?: MetaData[];
  shipping?: any;
  billing?: any;
  shipping_lines?: any[];
  total?: string | number;
  date_created?: { date: string };
  date_modified?: { date: string };
}

interface VariationAttribute {
    attribute: string;
    value: string;
}

interface PricedCartItem {
  id: number;
  name: string;
  quantity: number;
  sku?: string;
  price?: number;
  total?: number;
  variation?: VariationAttribute[];
  [key: string]: any; // Allow string-based property access
}

interface ConvertedOrder {
  id: number;
  userId: number;
  externalOrderId: string;
  externalOrder: string;
  status: OrderStatus;
  pricedCart: PricedCartItem[];
  shippingAddress: any;
  billingAddress: any;
  selectedShippingOption: any;
  totalPrice: string;
  createdAt: string;
  updatedAt: string;
}

function deriveExternalOrderId(legacyOrder: LegacyOrder): string {
  return legacyOrder.payment_method.replace("bacs", "bank_transfer-wc").replace("ppcp-gateway", "paypal-wc") || "";
}

function getMeta(metaArr: MetaData[] = [], key: string): any {
  const found = metaArr.find((m) => m.key === key);
  return found ? found.value : undefined;
}

function numberizeQuantity(quantity: number | string): number {
  if (typeof quantity === 'string') {
    if (quantity === "none") {
        return 0;
    } else if (quantity.startsWith("n")) {
        return 1;
    }
    return 0;
  } else {
    return Number(quantity);
  }
}

function standardizeStatus(status: string): "CREATED" | "CART" {
  const statusMap: { [key: string]: "CREATED" | "CART" } = {
    "on-hold": "CREATED",
    "checkout-draft": "CART",
    "processing": "CREATED",
    "pending": "CREATED",
  };
  return statusMap[status] ?? "CREATED";
}

const extraAttrMap: { attr: string; productName: string; convertedValue: string }[] = [
    { attr: 'band-name', productName: 'Band Name', convertedValue: "bandName" },
    { attr: 'album-title', productName: 'Album Title', convertedValue: "albumTitle" },
    { attr: 'catalog-number', productName: 'Catalog Number', convertedValue: "catalogNumber" },
];

const propsDirectFromLegacy = ["id", "sku", "total"];

const validAttributes = [
    "orderType", 
    "bandName", 
    "albumTitle", 
    "catalogNumber", 
    "weight", 
    "albumType", 
    "color", 
    "baseFee", 
    "selectedQuantity", 
    "centerLabel", 
    "innersleeve", 
    "outerPackagingType", 
    "outerPackagingPrint",
    "outerPackagingFinish", 
    "outerPackagingAmount", 
    "insertType", 
    "insertPrint", 
    "insertFinish", 
    "quantity", 
    "polybag", 
    "assemblyOption"
]

const stripNameAttributes = (name: string): string => {
    const nameParts = name.split(" - ");
    if (nameParts.length > 1) {
        return nameParts[0];
    }
    return name;
}

/**
 * Convert a legacy WooCommerce order
 * to the new order format 
 */
export const convertLegacyOrder = (legacyOrder: LegacyOrder, products: Product[]): ConvertedOrder => {

  const pricedCart: PricedCartItem[] = (legacyOrder.line_items || []).map((item): PricedCartItem => {
    
    const product = products.find((p) => p.id === item.product_id);

    const pricedCartItem: PricedCartItem = {
      id: item.product_id,
      name: stripNameAttributes(item.name),
      quantity: numberizeQuantity(item.quantity)
    };

    propsDirectFromLegacy.forEach((prop: string) => {
        if (item[prop]) {
            pricedCartItem[prop] = item[prop];
        } else if (product && (product as any)[prop]) {
            pricedCartItem[prop] = (product as any)[prop];
        }
    });

    pricedCartItem.total = Number(item.total) || 0;
    pricedCartItem.price = Math.round(pricedCartItem.total / pricedCartItem.quantity * 100) / 100;
    if (typeof pricedCartItem.price !== "number") {
        delete pricedCartItem.price;
    }

    let variation: VariationAttribute[] = [];
    let lowercaseAttributes: string[] = validAttributes.map((attr) => attr.toLowerCase());
    if (item.meta_data && item.meta_data.length > 0) {
      variation = item.meta_data.map((meta) => {
        if (lowercaseAttributes.includes(meta.key)) {
          return {
            attribute: validAttributes[lowercaseAttributes.findIndex(attr => attr === meta.key)],
            value: meta.value
          };
        } else {
            return {
                attribute: meta.key,
                value: meta.value
            };
        }
      });
    }

    extraAttrMap.forEach(({ attr, productName, convertedValue }) => {
      if (item.name === productName) {
        const value = getMeta(legacyOrder.meta_data || [], attr);
        if (
          value !== undefined &&
          !variation.some((v) => v.attribute === attr)
        ) {
          variation.push({ attribute: convertedValue, value });
        }
      }
    });

    if (variation.length > 0) pricedCartItem.variation = variation;

    return pricedCartItem;
  });

  // Compose shipping address
  const shipping = legacyOrder.shipping || {};
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
  const billing = legacyOrder.billing || {};
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
  const shippingLine = (legacyOrder.shipping_lines && legacyOrder.shipping_lines[0]) || {};
  const selectedShippingOption = {
    serviceCode: shippingLine.method_id || "",
    serviceName: shippingLine.name || "",
    shipmentCost: Number(shippingLine.total || 0),
    otherCost: 0,
    totalCost: Number(shippingLine.total || 0)
  };

  // Compose new order object
  return {
    id: legacyOrder.id,
    userId: legacyOrder.customer_id,
    externalOrderId: deriveExternalOrderId(legacyOrder),
    externalOrder: "{\"type\": \"woocommerce\"}",
    status: standardizeStatus(legacyOrder.status),
    pricedCart,
    shippingAddress,
    billingAddress,
    selectedShippingOption,
    totalPrice: typeof legacyOrder.total === "number" && legacyOrder.total.toFixed(2) || typeof legacyOrder.total === "string" && legacyOrder.total || "0.00",
    createdAt: legacyOrder.date_created?.date || "",
    updatedAt: legacyOrder.date_modified?.date || "",
  };
}

// let newOrders = [];
// legacyOrders.forEach(legacy => {
//     const converted = convertLegacyOrder(legacy);
//     newOrders.push(converted);
// });

// fs.writeFileSync('convertedOrders.json', JSON.stringify(newOrders, null, 2));
// console.log("Converted orders saved to convertedOrders.json");