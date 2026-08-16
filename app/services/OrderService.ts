import CartService from '#services/CartService'
import PackageService from '#services/PackageService'
import type { Request } from '@adonisjs/core/http'

export default class OrderService {
    public static async getAndLogOrderInitializationParams(request: Request) {
        const { billingAddress, cart, selectedShippingOption, shippingAddress, orderComment, packageId } = request.all()
        console.log('InitializeOrder called')
        console.log('billingAddress', billingAddress)
        console.log('cart', JSON.stringify(cart))
        console.log('selectedShippingOption', selectedShippingOption)
        console.log('shippingAddress', shippingAddress)
        console.log('packageId', packageId)
        const pricedCart = await CartService.getPricedCart(cart)
        const subTotalPrice = await CartService.getSubTotalPrice(pricedCart)
        const shippingPrice = await CartService.getShippingPrice(selectedShippingOption)
        const packageResult = await PackageService.applyToPricedCart({
            packageId,
            pricedCart,
            catalogSubtotal: subTotalPrice,
            shippingPrice,
        })
        if ('error' in packageResult && packageResult.error) {
            return {
                error: packageResult.error,
                status: packageResult.status || 422,
            }
        }
        const normalizedOrderComment = typeof orderComment === 'string' ? orderComment.trim() : undefined
        return {
            billingAddress,
            cart,
            selectedShippingOption,
            shippingAddress,
            pricedCart,
            subTotalPrice: packageResult.catalogSubtotal,
            totalPrice: packageResult.totalPrice,
            packageId: packageResult.packageId,
            discountAmount: packageResult.discountAmount,
            catalogSubtotal: packageResult.catalogSubtotal,
            orderComment: normalizedOrderComment
        }
    }

    public static toPersistedPackageFields(params: {
        packageId?: number | null
        discountAmount?: number
        catalogSubtotal?: number
    }) {
        return {
            packageId: params.packageId ?? null,
            discountAmount: params.discountAmount != null ? Number(params.discountAmount).toFixed(2) : null,
            catalogSubtotal: params.catalogSubtotal != null ? Number(params.catalogSubtotal).toFixed(2) : null,
        }
    }

    public static async sendCustomerOrderReceivedEmail() {
        return;
    }
}
