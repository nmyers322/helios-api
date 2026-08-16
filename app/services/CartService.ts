import Product from '#models/product'
import Variation from '#models/variation'

export default class CartService {

    public static async getPricedCart(cart: any) {
        const roundPrice = (price: string, quantity: number) =>
            Math.round(parseFloat(price) * quantity * 100) / 100;
        const products = await Product.all();
        const variations = await Variation.all();
        const pricedCart = cart.map((item: any) => {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                return item;
            }
            if (product?.price && parseFloat(product.price) !== 0) {
                item.price = parseFloat(product.price);
                item.total = roundPrice(product.price, item.quantity);
            } else {
                const itemVariationIdentifiers = item.variation?.map((v: any) => v.value);
                if (itemVariationIdentifiers) {
                    const productVariations = variations.filter(v => v.productId === item.id);
                    const matchedVariation = productVariations.find((v: any) => v.name?.replaceAll(" ", "").split(",")
                                    .every((v: any) => itemVariationIdentifiers.includes(v)));
                    if (matchedVariation?.price && parseFloat(matchedVariation.price) !== 0) {
                        item.total = roundPrice(matchedVariation.price, item.quantity);
                        item.price = parseFloat(matchedVariation.price);
                    }
                }
            }
            item.sku = product?.sku;
            item.name = product?.name;
            return item;
        });
        console.log('pricedCart', JSON.stringify(pricedCart))
        return pricedCart;
    }

    public static async getSubTotalPrice(pricedCart: any) {
        const subTotalPrice = pricedCart.reduce((total: number, item: any) => {
            return total + (item.total || 0);
        }, 0);
        console.log('subTotalPrice', subTotalPrice);
        return subTotalPrice;
    }

    public static async getShippingPrice(selectedShippingOption: any) {
        const shippingPrice = selectedShippingOption?.totalCost || 0;
        console.log('shippingPrice', shippingPrice);
        return shippingPrice;
    }

    public static async getTotalPrice(subTotalPrice: any, selectedShippingOption: any) {
        let totalPrice = parseFloat((subTotalPrice + selectedShippingOption?.totalCost).toFixed(2));
        console.log('totalPrice', totalPrice);
        return totalPrice;
    }

    public static getAttributeValue(pricedCart: any, attribute: string) {
        return pricedCart.find((item: any) => item.variation?.some((v: any) => v.attribute === attribute))?.variation?.find((v: any) => v.attribute === attribute)?.value;
    }

    public static getItemBySku(pricedCart: any, sku: string) {
        const item = pricedCart.find((item: any) => item.sku === sku);
        if (!item) {
            return null;
        }
        return item;
    }

    public static getAlbumType(pricedCart: any) {
        let twelveInchType = pricedCart.find((i: any) => i.sku === "helios-12inch-base-fee");
        if (twelveInchType?.quantity === 1) {
            return "12 inch - Single LP";
        } else if (twelveInchType?.quantity === 2) {
            return "12 inch - Double LP";
        }
        return "";
    }

    public static getRecordSetupFee(pricedCart: any) {
        let setupFee = this.getItemBySku(pricedCart, "helios-12inch-base-fee")?.total;
        if (setupFee) {
            setupFee = Math.round(setupFee * 100) / 100;
        }
        console.log('setupFee', setupFee);
        return setupFee || 0;
    }

    public static getTestPresses(pricedCart: any) {
        let albumType = this.getAlbumType(pricedCart);
        let quantity, total;
        if (albumType === "12 inch - Single LP") {
            quantity = this.getItemBySku(pricedCart, "helios-12inch-test-press")?.quantity;
            total = this.getItemBySku(pricedCart, "helios-12inch-test-press")?.total;
            total += this.getItemBySku(pricedCart, "helios-12inch-test-press-setup-fee-single-lp")?.total || 0;
        } else if (albumType === "12 inch - Double LP") {
            quantity = this.getItemBySku(pricedCart, "helios-12inch-test-press")?.quantity;
            total = this.getItemBySku(pricedCart, "helios-12inch-test-press")?.total;
            total += this.getItemBySku(pricedCart, "helios-12inch-test-press-setup-fee-double-lp")?.total || 0;
        }
        return {
            quantity: quantity || 0,
            total: total || 0
        };
    }

    public static getWeighedColorItems(pricedCart: any) {
        const weight = pricedCart.find((item: any) => item.sku === "helios-12inch-weight");
        const colorItems = pricedCart.filter((item: any) => item.sku === "helios-12inch-color");
        const weightUnitPrice = Math.round((weight?.price || 0) * 100) / 100
        return colorItems.map((item: any) => {
            return {
                ...item,
                price: (item.price || 0) + weightUnitPrice,
                total: (item.total || 0) + Math.round(weightUnitPrice * (item.quantity || 0) * 100) / 100,
            }
        });
    }

    public static getCenterLabelLabel(pricedCart: any) {
        const centerLabelOptions = [
            { value: "bw", label: "Black and White Only" },
            { value: "color", label: "Full Color" },
            { value: "customerSupplied", label: "Customer Supplied" },
        ];
        const centerLabelOption = this.getAttributeValue(pricedCart, "centerLabel");
        if (!centerLabelOption) {
            return null;
        }
        const label = centerLabelOptions.find((option: any) => option.value === centerLabelOption);
        return {
            label: label ? label.label : null,
            total: this.getItemBySku(pricedCart, "helios-12inch-center-labels")?.total || 0
        }
    }

    public static getOuterPackaging(pricedCart: any) {
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
        const outerPackagingType = this.getAttributeValue(pricedCart, "outerPackagingType");
        const outerPackagingPrint = this.getAttributeValue(pricedCart, "outerPackagingPrint");
        const outerPackagingFinish = this.getAttributeValue(pricedCart, "outerPackagingFinish");
        const total = this.getItemBySku(pricedCart, "helios-12inch-outer-packaging")?.total;
        let label = "";
        if (outerPackagingType) {
            label += ((output: string | undefined) => output ? output : "")(outerPackagingTypeOptions.find((option: any) => option.value === outerPackagingType)?.label);
        }
        if (outerPackagingPrint && outerPackagingType !== "none" && outerPackagingType !== "customerSupplied") {
            if (label) {
                label += " - ";
            }
            label += ((output: string | undefined) => output ? output : "")(outerPackagingPrintOptions.find((option: any) => option.value === outerPackagingPrint)?.label);
        }
        if (outerPackagingFinish && outerPackagingType !== "none" && outerPackagingType !== "customerSupplied") {
            if (label) {
                label += " - ";
            }
            label += ((output: string | undefined) => output ? output : "")(outerPackagingFinishOptions.find((option: any) => option.value === outerPackagingFinish)?.label);
        }
        return {
            type: outerPackagingType,
            print: outerPackagingPrint,
            finish: outerPackagingFinish,
            total: total ? total : 0,
            label: label
        }
    }

    public static getInnersleeveLabel(pricedCart: any) {
        const innersleeveOptions = [
            { value: "whitePaperSleeve", label: "White Paper Sleeve" },
            { value: "blackPolylinedSleeve", label: "Black Polylined Sleeve" },
            { value: "none", label: "None" },
        ];
        const innersleeveValue = this.getAttributeValue(pricedCart, "innersleeve");
        if (!innersleeveValue) return null;
        const label = innersleeveOptions.find(opt => opt.value === innersleeveValue)?.label || innersleeveValue;
        const total = this.getItemBySku(pricedCart, "helios-12inch-innersleeve")?.total || 0;
        return { label, total };
    }

    public static getAssemblyOptionLabel(pricedCart: any) {
        const assemblyOptionOptions = [
            { value: "insertRecordInJacket", label: "Insert Record In Jacket" },
            { value: "placeRecordBehindJacket", label: "Place Record Behind Jacket" },
        ];
        const assemblyValue = this.getAttributeValue(pricedCart, "assemblyOption");
        if (!assemblyValue) return null;
        const label = assemblyOptionOptions.find(opt => opt.value === assemblyValue)?.label || assemblyValue;
        const total = this.getItemBySku(pricedCart, "helios-12inch-assembly-option")?.total || 0;
        return { label, total };
    }

    public static getInsertLabel(pricedCart: any) {
        const insertTypeOptions = [
            { value: "one", label: "One Side" },
            { value: "two", label: "Two Sides" },
            { value: "customerSupplied", label: "Customer Supplied" },
            { value: "none", label: "None" },
        ];
        const insertType = this.getAttributeValue(pricedCart, "insertType");
        if (!insertType) return null;
        const label = insertTypeOptions.find(opt => opt.value === insertType)?.label || insertType;
        const total = this.getItemBySku(pricedCart, "helios-12inch-insert")?.total || 0;
        return { label, total };
    }

    public static getPolybagLabel(pricedCart: any) {
        const polybagOptions = [
            { value: "polybag", label: "Polybag" },
            { value: "resealablePolybag", label: "Resealable Polybag" },
            { value: "none", label: "None" },
        ];
        const polybagValue = this.getAttributeValue(pricedCart, "polybag");
        if (!polybagValue) return null;
        const label = polybagOptions.find(opt => opt.value === polybagValue)?.label || polybagValue;
        const total = this.getItemBySku(pricedCart, "helios-12inch-polybag")?.total || 0;
        return { label, total };
    }

    public static getWeight(pricedCart: any) {
        const weightOptions = [
            { value: "160g", label: "Standard (160g)" },
            { value: "180g", label: "Heavy (180g)" },
        ];
        const weight = this.getAttributeValue(pricedCart, "weight");
        if (!weight) return null;
        return {
            label: weightOptions.find(opt => opt.value === weight)?.label || weight,
            total: this.getItemBySku(pricedCart, "helios-12inch-weight")?.total || 0
        };
    }
    
}
