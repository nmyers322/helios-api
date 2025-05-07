import type { HttpContext } from '@adonisjs/core/http'
import ShipStationService from '#services/ShipStationService'

export const HELIOS_POSTCODE = "76825";

export default class ShippingOptionsController {
    async getShippingOptions({ request, response }: HttpContext) {
        const { shippingAddress, order } = request.only(['shippingAddress', 'order'])
        console.log('Shipping Address:', shippingAddress)
        console.log('Order:', order)
        if (!shippingAddress || !order) {
            return response.status(400).json({ error: 'Invalid request body' })
        }

        const shipStationService = new ShipStationService();
        const shippingOptions = await shipStationService.getRatesFromShipStationAPI(
            HELIOS_POSTCODE,
            shippingAddress.state,
            shippingAddress.country,
            shippingAddress.postcode,
            shippingAddress.city,
            {
                "value": 100,
                "unit": "ounces"
            },
            {
                "height": 10,
                "length": 10,
                "width": 10,
                "units": "inches"
            },
            "delivery",
            true
        );
        if (!shippingOptions) {
            return response.status(500).json({ error: 'Failed to fetch shipping options' })
        }
        
        console.log('Shipping Options:', shippingOptions)
        return response.status(200).json({ shippingOptions });
    }
}