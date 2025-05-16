import Order from '#models/order'
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
}
