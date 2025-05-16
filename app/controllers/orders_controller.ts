import Order from '#models/order'
import CartService from '#services/CartService'
import type { HttpContext } from '@adonisjs/core/http'

export default class OrdersController {
    async getAll({ auth, response }: HttpContext) {
        const user = auth.user
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }
        const userId = user.id
        const orders = await Order.query().where('userId', userId).orderBy('createdAt', 'desc')
        return response.status(200).json({orders})
    }

    async getById({ auth, params, response }: HttpContext) {
        const user = auth?.user
        if (!user) {
            return response.status(401).json({ error: 'Unauthorized' })
        }
        const userId = user.id
        const orderId = params.id
        const order = await Order.query().where('userId', userId).where('id', orderId).first()
        if (!order) {
            return response.status(404).json({ error: 'Order not found' })
        }
        return response.status(200).json({order})
    }

    async initializeOrder({ auth, request, response }: HttpContext) {
        const { billingAddress, cart, selectedShippingOption, shippingAddress } = request.all()
        console.log('InitializeOrder called')
        console.log('billingAddress', billingAddress)
        console.log('cart', JSON.stringify(cart))
        const pricedCart = await CartService.getPricedCart(cart)
        console.log('pricedCart', JSON.stringify(pricedCart))
        const subTotalPrice = await CartService.getSubTotalPrice(pricedCart)
        console.log('subTotalPrice', subTotalPrice)
        console.log('selectedShippingOption', selectedShippingOption)
        const totalPrice = subTotalPrice + selectedShippingOption.totalCost
        console.log('totalPrice', totalPrice)
        console.log('shippingAddress', shippingAddress)
        try {
            let order = await Order.create({
                billingAddress: JSON.stringify(billingAddress),
                pricedCart: JSON.stringify(pricedCart),
                selectedShippingOption: JSON.stringify(selectedShippingOption),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: totalPrice.toFixed(2),
                externalOrderId: "bank_transfer",
                externalOrder: undefined,
                status: "CREATED",
                userId: auth?.user?.id
            });

            return response.status(201).json({ order });
        } catch (error) {
            console.error('Error creating order:', error);
            return response.status(500).json({ error: 'Failed to create order' });
        }
    }
}
