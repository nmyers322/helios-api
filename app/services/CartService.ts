import Product from '#models/product'
import Variation from '#models/variation'

export default class CartService {

    public static async getPricedCart(cart: any) {
        const products = await Product.all();
        const variations = await Variation.all();
        const pricedCart = cart.map((item: any) => {
            const product = products.find(p => p.id === item.id);
            if (!product) {
                return item;
            }
            if (product?.price && product.price !== '0') {
                item.total = parseFloat(product.price) * item.quantity;
            } else {
                const variationIdentifiers = item.variation?.map((v: any) => v.value);
                console.log('Variation Identifiers:', variationIdentifiers);
                if (variationIdentifiers) {
                    const productVariations = variations.filter(v => v.productId === item.id);
                    const pricedVariation = productVariations.find((v: any) => v.name?.replaceAll(" ", "").split(",")
                                    .every((v: any) => variationIdentifiers.includes(v)));
                    if (pricedVariation?.price && pricedVariation.price !== '0') {
                        item.total = parseFloat(pricedVariation.price) * item.quantity;
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