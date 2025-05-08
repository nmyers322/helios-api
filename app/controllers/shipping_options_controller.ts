import type { HttpContext } from '@adonisjs/core/http'
import ShipStationService from '#services/ShipStationService'
import BoxCalculatorService from '#services/BoxCalculatorService';

export const HELIOS_COMPANY_NAME = "Helios Press";
export const HELIOS_ADDRESS = "208 West Grove";
export const HELIOS_CITY = "Brady";
export const HELIOS_STATE = "TX";
export const HELIOS_POSTCODE = "76825";
export const HELIOS_COUNTRY = "US";
export const HELIOS_PHONE = "5105022963";
export const HANDLING_FEE = 0.05; // 5% handling fee

export default class ShippingOptionsController {
    async getShippingOptions({ request, response }: HttpContext) {
        const { shippingAddress, totalQuantity, albumType, packagingType } = request.only(['shippingAddress', 'totalQuantity', 'albumType', 'packagingType']);
        const recordSize = '12inch';

        console.log('Shipping Address:', shippingAddress)
        console.log('Order Params:', totalQuantity, albumType, packagingType)

        const shippingAddressInvalid = !shippingAddress || 
            !shippingAddress.state || 
            !shippingAddress.country || 
            !shippingAddress.postcode || 
            !shippingAddress.city;

        const orderInvalid = typeof totalQuantity !== "number" || 
            totalQuantity <= 0 ||
            totalQuantity > 1000 ||
            !['12inch'].includes(recordSize) ||
            !['single', 'double'].includes(albumType) || 
            !['standardJacket', 'gatefoldJacket', 'wideSpineJacket', 'customerSupplied', 'none'].includes(packagingType);

        if (shippingAddressInvalid || orderInvalid) {
            return response.status(400).json({ error: 'Invalid request body' })
        }

        const boxCalculator = new BoxCalculatorService(packagingType, recordSize, albumType, totalQuantity);
        if (boxCalculator.error) {
            return response.status(400).json({ error: boxCalculator.error.message })
        }

        const shipStationService = new ShipStationService();
        const shippingOptions = await shipStationService.getRatesFromShipStationAPI(
            HELIOS_POSTCODE,
            shippingAddress.state,
            shippingAddress.country,
            shippingAddress.postcode,
            shippingAddress.city,
            {
                "value": boxCalculator.ouncesPerBox,
                "unit": "ounces"
            },
            {
                "height": boxCalculator.boxDimensions.height,
                "length": boxCalculator.boxDimensions.length,
                "width": boxCalculator.boxDimensions.width,
                "units": "inches"
            },
            "delivery",
            true
        );
        if (!shippingOptions || !Array.isArray(shippingOptions)) {
            return response.status(500).json({ error: 'Failed to fetch shipping options' })
        }
        
        const finalShippingOptions = shippingOptions.map((option) => {
            const invalidPrice = typeof option.shipmentCost !== "number" || typeof option.shipmentCost !== "number" || option.shipmentCost <= 0;
            const invalidService = !option.serviceCode || !option.serviceName;
            if (invalidPrice || invalidService) {
                return null;
            }
            return option;
        })
        .filter((option) => option !== null)
        .map((option) => {
            let costPerBox = option.shipmentCost + option.otherCost;
            costPerBox = parseFloat(costPerBox.toFixed(2));
            let costOfAllBoxes = costPerBox * boxCalculator.numberOfBoxes;
            option.totalCost = parseFloat((costOfAllBoxes + (costOfAllBoxes * HANDLING_FEE)).toFixed(2));
            delete option.shipmentCost;
            delete option.otherCost;
            return option;
        })
        .sort((a, b) => a.totalCost - b.totalCost);
        console.log('Final Shipping Options:', finalShippingOptions);
        return response.status(200).json({ shippingOptions: finalShippingOptions });
    }
}