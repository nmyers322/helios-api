import Product from '#models/product'
import Variation from '#models/variation'
import { parse } from 'path';

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
}