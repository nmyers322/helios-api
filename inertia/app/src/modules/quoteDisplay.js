import { getAllColors, getWeighedColorItems } from './weighedColors.js'

export const getSelectedOptionLabel = (orderForm, name) => {
  if (!orderForm || orderForm[name] == null || orderForm[name] === '') {
    return ''
  }
  return orderForm[name].label ? orderForm[name].label : orderForm[name]
}

export const getColorLabel = (orderForm, color) => {
  const recordsLabel = orderForm?.albumType?.value === 'double' ? 'Double Records' : 'Records'
  if (!color?.color) {
    return `(Undecided) ${color?.quantity || 0} ${recordsLabel}`
  }
  return `${color.quantity} ${color.color.label} ${recordsLabel}`
}

export const UNFOLDED_PRICED_ITEM_NAMES = [
  'albumType',
  'weight',
  'testPresses',
  'colorSetupFeeTotal',
  'centerLabel',
  'innersleeve',
  'outerPackaging',
  'insert',
  'polybag',
]

export const getColorWeightShare = (weightTotal, colorQuantity, totalQuantity) => {
  if (!weightTotal || !colorQuantity || !totalQuantity) {
    return 0
  }
  return Math.round(((weightTotal * colorQuantity) / totalQuantity) * 100) / 100
}

export const getColorLineTotal = (colorTotal, weightTotal, colorQuantity, totalQuantity) =>
  Math.round(((colorTotal || 0) + getColorWeightShare(weightTotal, colorQuantity, totalQuantity)) * 100) / 100

export const getWeightDisplay = (label = '') => ({
  label: label || '',
  amount: null,
})

export const getQuoteGrandTotal = ({ itemTotals = [], colorTotals = [], shipping = 0 } = {}) => {
  const items = itemTotals.reduce((sum, value) => sum + (value || 0), 0)
  const colors = colorTotals.reduce((sum, value) => sum + (value || 0), 0)
  return Math.round((items + colors + (shipping || 0)) * 100) / 100
}

export const getQuoteDisplayLines = ({
  weightLabel = '',
  weightTotal = 0,
  totalQuantity = 0,
  colors = [],
  otherPricedRows = [],
  shippingAmount = 0,
} = {}) => {
  const colorLines = colors.map((color) => ({
    label: color.label,
    quantity: color.quantity,
    amount: getColorLineTotal(color.colorTotal, weightTotal, color.quantity, totalQuantity),
  }))
  const weight = getWeightDisplay(weightLabel)
  const grandTotal = getQuoteGrandTotal({
    itemTotals: [...otherPricedRows.map((row) => row.amount || 0), weightTotal || 0],
    colorTotals: colors.map((color) => color.colorTotal || 0),
    shipping: shippingAmount,
  })
  const visiblePressingTotal = Math.round(
    (
      colorLines.reduce((sum, line) => sum + (line.amount || 0), 0)
      + otherPricedRows.reduce((sum, row) => sum + (row.amount || 0), 0)
      + (shippingAmount || 0)
    ) * 100
  ) / 100

  return {
    weight,
    colorLines,
    otherPricedRows,
    shippingAmount: shippingAmount || 0,
    grandTotal,
    visiblePressingTotal,
  }
}

export const getCompletedOrderDisplay = (order) => ({
  weight: getWeightDisplay(
    order?.pricedCart
      ?.find((item) => item.sku === 'helios-12inch-weight')
      ?.variation?.find((entry) => entry.attribute === 'weight')
      ?.value || ''
  ),
  colors: getAllColors(order),
})

export const getEmailColorDisplay = (pricedCart) =>
  getWeighedColorItems(pricedCart).map((item) => ({
    name: item.variation?.find((entry) => entry.attribute === 'color')?.value || 'Unknown',
    quantity: item.quantity,
    unitPrice: item.price,
    total: item.total,
  }))

export { getAllColors, getWeighedColorItems }
