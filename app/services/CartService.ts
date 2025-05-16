import Product from '#models/product'
import Variation from '#models/variation'
import { parse } from 'path';

export default class CartService {

    public static async getPricedCart(cart: any) {
        const products = await Product.all();
        const variations = await Variation.all();
        const pricedCart = cart.map((item: any) => {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                return item;
            }
            if (product?.price && parseFloat(product.price) !== 0) {
                item.price = parseFloat(product.price);
                item.total = parseFloat(product.price) * item.quantity;
            } else {
                const itemVariationIdentifiers = item.variation?.map((v: any) => v.value);
                if (itemVariationIdentifiers) {
                    const productVariations = variations.filter(v => v.productId === item.id);
                    const matchedVariation = productVariations.find((v: any) => v.name?.replaceAll(" ", "").split(",")
                                    .every((v: any) => itemVariationIdentifiers.includes(v)));
                    if (matchedVariation?.price && parseFloat(matchedVariation.price) !== 0) {
                        item.total = parseFloat(matchedVariation.price) * item.quantity;
                    }
                }
            }
            item.sku = product?.sku;
            item.name = product?.name;
            return item;
        });

        return pricedCart;
    }

    public static async getSubTotalPrice(pricedCart: any) {
        const totalPrice = pricedCart.reduce((total: number, item: any) => {
            return total + (item.total || 0);
        }, 0);
        return totalPrice;
    }
}