export const PACKAGE_FORM_FIELDS = [
  'albumType',
  'weight',
  'totalQuantity',
  'testPresses',
  'colors',
  'colorsVerified',
  'centerLabel',
  'innersleeve',
  'outerPackagingType',
  'outerPackagingPrint',
  'outerPackagingFinish',
  'insertType',
  'insertPrint',
  'insertFinish',
  'polybag',
  'assemblyOption',
]

const BASE_FEE_SKU = 'helios-12inch-base-fee'
const WEIGHT_SKU = 'helios-12inch-weight'
const TOTAL_QUANTITY_SKU = 'helios-total-quantity'
const COLOR_SKU = 'helios-12inch-color'
const TEST_PRESS_SKU = 'helios-12inch-test-press'
const CENTER_LABEL_SKU = 'helios-12inch-center-labels'
const INNERSLEEVE_SKU = 'helios-12inch-innersleeve'
const OUTER_PACKAGING_SKU = 'helios-12inch-outer-packaging'
const INSERT_SKU = 'helios-12inch-insert'
const POLYBAG_SKU = 'helios-12inch-polybag'
const ASSEMBLY_SKU = 'helios-12inch-assembly-option'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100

export const isPackageLocked = (orderForm) => Boolean(orderForm?.packageId)

export const optionValue = (field) => {
  if (field == null || field === '') {
    return null
  }
  if (typeof field === 'object') {
    return field.value ?? null
  }
  return field
}

export const advertisedPriceDiscount = (catalogSubtotal, advertisedPrice) => {
  const catalog = roundMoney(catalogSubtotal)
  const advertised = roundMoney(advertisedPrice)
  if (!(advertised > 0)) {
    return 0
  }
  return Math.max(0, roundMoney(catalog - advertised))
}

export const validateAdvertisedPrice = (advertisedPrice, catalogSubtotal) => {
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

export const applyAdvertisedPriceDiscount = ({
  catalogSubtotal = 0,
  shippingPrice = 0,
  advertisedPrice = 0,
} = {}) => {
  const catalog = roundMoney(catalogSubtotal)
  const shipping = roundMoney(shippingPrice)
  const discountAmount = advertisedPriceDiscount(catalog, advertisedPrice)
  const pressingTotal = roundMoney(catalog - discountAmount)
  return {
    catalogSubtotal: catalog,
    discountAmount,
    pressingTotal,
    shippingPrice: shipping,
    totalPrice: roundMoney(pressingTotal + shipping),
  }
}

export const validatePackageSlug = (slug) =>
  typeof slug === 'string' && SLUG_PATTERN.test(slug.trim())

export const getPackageCtaLabel = (pkg) => {
  if (!pkg) {
    return ''
  }
  if (pkg.ctaLabel) {
    return pkg.ctaLabel
  }
  const price = Number(pkg.advertisedPrice)
  const priceLabel = Number.isFinite(price) ? `$${price.toFixed(2)}` : ''
  return [pkg.name, priceLabel].filter(Boolean).join('  ')
}

export const extractFormConfig = (orderForm = {}) => {
  const formConfig = {}
  PACKAGE_FORM_FIELDS.forEach((field) => {
    formConfig[field] = orderForm[field]
  })
  formConfig.colorsVerified = true
  return formConfig
}

export const applyPackageToOrderForm = (pkg) => ({
  ...(pkg?.formConfig || {}),
  colorsVerified: true,
  packageId: pkg?.id ?? null,
  packageSlug: pkg?.slug ?? '',
  packageName: pkg?.name ?? '',
  advertisedPrice: pkg?.advertisedPrice ?? null,
})

const sortColors = (colors) =>
  [...colors].sort((left, right) => {
    const nameCompare = String(left.name).localeCompare(String(right.name))
    if (nameCompare !== 0) {
      return nameCompare
    }
    return Number(left.quantity) - Number(right.quantity)
  })

const noneOrSupplied = (value) => value === 'none' || value === 'customerSupplied'

export const getLockedSnapshotFromFormConfig = (formConfig = {}) => {
  const albumType = optionValue(formConfig.albumType)
  const factor = albumType === 'double' ? 2 : 1
  const outerType = optionValue(formConfig.outerPackagingType)
  const insertType = optionValue(formConfig.insertType)
  const colors = (formConfig.colors || []).map((color) => ({
    name: optionValue(color?.color) || optionValue(color),
    quantity: Number(color?.quantity) || 0,
  }))
  return {
    albumType,
    weight: optionValue(formConfig.weight),
    totalQuantity: Number(formConfig.totalQuantity) || 0,
    testPresses: Number(formConfig.testPresses) || 0,
    colors: sortColors(colors),
    centerLabel: optionValue(formConfig.centerLabel),
    innersleeve: optionValue(formConfig.innersleeve),
    outerPackagingType: outerType,
    outerPackagingPrint: noneOrSupplied(outerType) ? null : optionValue(formConfig.outerPackagingPrint),
    outerPackagingFinish: noneOrSupplied(outerType) ? null : optionValue(formConfig.outerPackagingFinish),
    insertType,
    insertPrint: noneOrSupplied(insertType) ? null : optionValue(formConfig.insertPrint),
    insertFinish: noneOrSupplied(insertType) ? null : optionValue(formConfig.insertFinish),
    polybag: optionValue(formConfig.polybag),
    assemblyOption: outerType === 'none' ? null : optionValue(formConfig.assemblyOption),
    albumTypeFactor: factor,
  }
}

const variationValue = (item, attribute) =>
  item?.variation?.find((entry) => entry.attribute === attribute)?.value ?? null

const itemBySku = (cart, sku) => (cart || []).find((item) => item.sku === sku) || null

export const getLockedSnapshotFromCart = (pricedCart = []) => {
  const baseFee = itemBySku(pricedCart, BASE_FEE_SKU)
  const albumType = baseFee?.quantity === 2 ? 'double' : 'single'
  const factor = albumType === 'double' ? 2 : 1
  const colors = (pricedCart || [])
    .filter((item) => item.sku === COLOR_SKU)
    .map((item) => ({
      name: variationValue(item, 'color'),
      quantity: factor ? Math.round((Number(item.quantity) || 0) / factor) : 0,
    }))
  const outerType = variationValue(itemBySku(pricedCart, OUTER_PACKAGING_SKU), 'outerPackagingType')
  const insertType = variationValue(itemBySku(pricedCart, INSERT_SKU), 'insertType')
  return {
    albumType,
    weight: variationValue(itemBySku(pricedCart, WEIGHT_SKU), 'weight'),
    totalQuantity: Number(itemBySku(pricedCart, TOTAL_QUANTITY_SKU)?.quantity) || 0,
    testPresses: Number(itemBySku(pricedCart, TEST_PRESS_SKU)?.quantity) || 0,
    colors: sortColors(colors),
    centerLabel: variationValue(itemBySku(pricedCart, CENTER_LABEL_SKU), 'centerLabel'),
    innersleeve: variationValue(itemBySku(pricedCart, INNERSLEEVE_SKU), 'innersleeve'),
    outerPackagingType: outerType,
    outerPackagingPrint: outerType === 'none' || outerType === 'customerSupplied'
      ? null
      : variationValue(itemBySku(pricedCart, OUTER_PACKAGING_SKU), 'outerPackagingPrint'),
    outerPackagingFinish: outerType === 'none' || outerType === 'customerSupplied'
      ? null
      : variationValue(itemBySku(pricedCart, OUTER_PACKAGING_SKU), 'outerPackagingFinish'),
    insertType,
    insertPrint: insertType === 'none' || insertType === 'customerSupplied'
      ? null
      : variationValue(itemBySku(pricedCart, INSERT_SKU), 'insertPrint'),
    insertFinish: insertType === 'none' || insertType === 'customerSupplied'
      ? null
      : variationValue(itemBySku(pricedCart, INSERT_SKU), 'insertFinish'),
    polybag: variationValue(itemBySku(pricedCart, POLYBAG_SKU), 'polybag'),
    assemblyOption: outerType === 'none'
      ? null
      : variationValue(itemBySku(pricedCart, ASSEMBLY_SKU), 'assemblyOption'),
    albumTypeFactor: factor,
  }
}

const snapshotsEqual = (left, right) => {
  const keys = Object.keys(left).filter((key) => key !== 'albumTypeFactor')
  return keys.every((key) => JSON.stringify(left[key]) === JSON.stringify(right[key]))
}

export const cartMatchesPackageFormConfig = (pricedCart, formConfig) => {
  const expected = getLockedSnapshotFromFormConfig(formConfig)
  const actual = getLockedSnapshotFromCart(pricedCart)
  return snapshotsEqual(expected, actual)
}

export const getPackageDiscountDisplay = ({
  catalogSubtotal = 0,
  advertisedPrice = 0,
  shippingAmount = 0,
} = {}) => {
  const applied = applyAdvertisedPriceDiscount({
    catalogSubtotal,
    advertisedPrice,
    shippingPrice: shippingAmount,
  })
  return {
    ...applied,
    showDiscount: applied.discountAmount > 0,
  }
}

export const CATALOG_PRICE_FIELDS = [
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

export const getCatalogSubtotalFromPrices = (orderForm, getItemPrice) => {
  const items = CATALOG_PRICE_FIELDS.map((name) => getItemPrice(name) || 0)
  const colors = (orderForm?.colors || []).map((color) => getItemPrice('color', color) || 0)
  return roundMoney([...items, ...colors].reduce((sum, value) => sum + value, 0))
}
