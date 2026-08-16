export default class DiscountService {
  static roundMoney(value: number) {
    return Math.round((Number(value) || 0) * 100) / 100
  }

  static advertisedPriceDiscount(catalogSubtotal: number, advertisedPrice: number) {
    const catalog = this.roundMoney(catalogSubtotal)
    const advertised = this.roundMoney(advertisedPrice)
    if (!(advertised > 0)) {
      return 0
    }
    return Math.max(0, this.roundMoney(catalog - advertised))
  }

  static validateAdvertisedPrice(advertisedPrice: number, catalogSubtotal: number) {
    const advertised = Number(advertisedPrice)
    const catalog = Number(catalogSubtotal)
    if (!(advertised > 0)) {
      return { valid: false, error: 'Advertised price must be greater than 0' }
    }
    if (!(catalog > advertised)) {
      return { valid: false, error: 'Advertised price must be less than the catalog subtotal' }
    }
    return { valid: true }
  }

  static applyAdvertisedPriceDiscount({
    catalogSubtotal = 0,
    shippingPrice = 0,
    advertisedPrice = 0,
  }: {
    catalogSubtotal?: number
    shippingPrice?: number
    advertisedPrice?: number
  } = {}) {
    const catalog = this.roundMoney(catalogSubtotal)
    const shipping = this.roundMoney(shippingPrice)
    const discountAmount = this.advertisedPriceDiscount(catalog, advertisedPrice)
    const pressingTotal = this.roundMoney(catalog - discountAmount)
    return {
      catalogSubtotal: catalog,
      discountAmount,
      pressingTotal,
      shippingPrice: shipping,
      totalPrice: this.roundMoney(pressingTotal + shipping),
    }
  }
}
