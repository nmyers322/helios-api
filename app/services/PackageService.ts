import DiscountService from '#services/DiscountService'
import PressingPackage from '#models/pressing_package'
import { cartMatchesPackageFormConfig } from '../../inertia/app/src/modules/packageDeals.js'

export default class PackageService {
  static async applyToPricedCart({
    packageId,
    pricedCart,
    catalogSubtotal,
    shippingPrice,
  }: {
    packageId?: number | string | null
    pricedCart: any[]
    catalogSubtotal: number
    shippingPrice: number
  }) {
    if (packageId == null || packageId === '') {
      return {
        packageId: null,
        catalogSubtotal: DiscountService.roundMoney(catalogSubtotal),
        discountAmount: 0,
        totalPrice: DiscountService.roundMoney(catalogSubtotal + shippingPrice),
      }
    }

    const id = Number(packageId)
    if (!Number.isInteger(id) || id <= 0) {
      return { error: 'Invalid package', status: 422 }
    }

    const pressingPackage = await PressingPackage.find(id)
    if (!pressingPackage || !pressingPackage.isActive) {
      return { error: 'Package is not available', status: 422 }
    }

    if (!cartMatchesPackageFormConfig(pricedCart, pressingPackage.formConfig)) {
      return { error: 'Order does not match the selected package', status: 422 }
    }

    const applied = DiscountService.applyAdvertisedPriceDiscount({
      catalogSubtotal,
      shippingPrice,
      advertisedPrice: Number(pressingPackage.advertisedPrice),
    })

    return {
      packageId: pressingPackage.id,
      catalogSubtotal: applied.catalogSubtotal,
      discountAmount: applied.discountAmount,
      totalPrice: applied.totalPrice,
    }
  }
}
