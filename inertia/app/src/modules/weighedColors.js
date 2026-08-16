export const COLOR_SKU = 'helios-12inch-color'
export const WEIGHT_SKU = 'helios-12inch-weight'

export const getWeighedColorItems = (pricedCart = []) => {
  const weight = pricedCart.find((item) => item.sku === WEIGHT_SKU)
  const colorItems = pricedCart.filter((item) => item.sku === COLOR_SKU)
  const weightUnitPrice = Math.round((weight?.price || 0) * 100) / 100
  return colorItems.map((item) => ({
    ...item,
    price: (item.price || 0) + weightUnitPrice,
    total: (item.total || 0) + Math.round(weightUnitPrice * (item.quantity || 0) * 100) / 100,
  }))
}

export const getAllColors = (order) =>
  getWeighedColorItems(order?.pricedCart || []).map((item) => ({
    baseFeeType: item.variation?.find((v) => v.attribute === 'baseFee')?.value,
    name: item.variation?.find((v) => v.attribute === 'color')?.value,
    quantity: item.quantity,
    total: item.total,
  }))
