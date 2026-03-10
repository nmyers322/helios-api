import CartService from '#services/CartService'
import type { Request } from '@adonisjs/core/http'

export default class OrderService {
    public static async getAndLogOrderInitializationParams(request: Request) {
        const { billingAddress, cart, selectedShippingOption, shippingAddress, orderComment } = request.all()
        console.log('InitializeOrder called')
        console.log('billingAddress', billingAddress)
        console.log('cart', JSON.stringify(cart))
        console.log('selectedShippingOption', selectedShippingOption)
        console.log('shippingAddress', shippingAddress)
        const pricedCart = await CartService.getPricedCart(cart)
        const subTotalPrice = await CartService.getSubTotalPrice(pricedCart)
        const totalPrice = await CartService.getTotalPrice(subTotalPrice, selectedShippingOption);
        const normalizedOrderComment = typeof orderComment === 'string' ? orderComment.trim() : undefined
        return {
            billingAddress,
            cart,
            selectedShippingOption,
            shippingAddress,
            pricedCart,
            subTotalPrice,
            totalPrice,
            orderComment: normalizedOrderComment
        }
    }

    public static async sendCustomerOrderReceivedEmail() {
        return;
    }
}
