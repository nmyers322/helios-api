import Variation from '#models/variation'
import type { HttpContext } from '@adonisjs/core/http'

export default class VariationsController {
    async getByProductId({ params }: HttpContext) {
        const { productId } = params
        const variations = await Variation.query().where('product_id', productId).limit(1000)
        return variations;
    }
}