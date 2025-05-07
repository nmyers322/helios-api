import type { HttpContext } from '@adonisjs/core/http'

export default class ShippingOptionsController {
    async getShippingOptions({ request, response }: HttpContext) {
        const { shippingAddress, order } = request.only(['shippingAddress', 'order'])
        console.log('Shipping Address:', shippingAddress)
        console.log('Order:', order)
        if (!shippingAddress || !order) {
            return response.status(400).json({ error: 'Invalid request body' })
        }

        // Mocked shipping options
        const shippingOptions = [
            {
                id: 1,
                name: 'Standard Shipping',
                price: 5.99,
                estimatedDelivery: '5-7 business days',
            },
            {
                id: 2,
                name: 'Express Shipping',
                price: 15.99,
                estimatedDelivery: '2-3 business days',
            },
            {
                id: 3,
                name: 'Overnight Shipping',
                price: 29.99,
                estimatedDelivery: '1 business day',
            },
        ]
        console.log('Shipping Options:', shippingOptions)
        return response.status(200).json({ shippingOptions });
    }
}