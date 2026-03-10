import Order from '#models/order'
import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/OrderService';
import EmailService from '#services/EmailService';
import User from '#models/user';
import OrderCreated from '#services/emailbody/OrderCreated';

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

    async getAllAdmin({ response }: HttpContext) {
        const orders = await Order.query()
            .preload('user')
            .orderBy('createdAt', 'desc')
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
        const {
            billingAddress,
            selectedShippingOption,
            shippingAddress,
            pricedCart,
            totalPrice,
            orderComment
        } = await OrderService.getAndLogOrderInitializationParams(request);
        if (orderComment && orderComment.length > 500) {
            return response.status(422).json({ error: 'Order comment must be 500 characters or less' })
        }
        try {
            let user = await User.query().where('id', auth.user!.id).first()
            if (!user) {
                return response.status(404).json({ error: 'User not found' })
            }
            let order = await Order.create({
                billingAddress: JSON.stringify(billingAddress),
                pricedCart: JSON.stringify(pricedCart),
                selectedShippingOption: JSON.stringify(selectedShippingOption),
                shippingAddress: JSON.stringify(shippingAddress),
                totalPrice: totalPrice.toFixed(2),
                orderComment: orderComment,
                externalOrderId: "bank_transfer",
                externalOrder: undefined,
                status: "CREATED",
                userId: auth?.user?.id
            });
            EmailService.sendEmail(user.email,
                'Order Confirmation: #' + order.id,
                await OrderCreated.getEmailBody(order));
            return response.status(201).json({ order });
        } catch (error) {
            console.error('Error creating order:', error);
            return response.status(500).json({ error: 'Failed to create order' });
        }
    }

    async updateOrder({ params, request, response }: HttpContext) {
        const orderId = params.id
        const order = await Order.findOrFail(orderId)
        if (!order) {
            return response.status(404).json({ error: 'Order not found' })
        }
        const { status } = request.all()
        order.status = status
        await order.save()
        return response.status(200).json({ order })
    }
}
