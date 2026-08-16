import DiscountService from '#services/DiscountService'
import PressingPackage from '#models/pressing_package'

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
] as const

const noneOrSupplied = (value: unknown) => value === 'none' || value === 'customerSupplied'

const optionValue = (field: any) => {
  if (field == null || field === '') {
    return null
  }
  if (typeof field === 'object') {
    return field.value ?? null
  }
  return field
}

const sortColors = (colors: Array<{ name: any; quantity: number }>) =>
  [...colors].sort((left, right) => {
    const nameCompare = String(left.name).localeCompare(String(right.name))
    if (nameCompare !== 0) {
      return nameCompare
    }
    return Number(left.quantity) - Number(right.quantity)
  })

const variationValue = (item: any, attribute: string) =>
  item?.variation?.find((entry: any) => entry.attribute === attribute)?.value ?? null

const itemBySku = (cart: any[], sku: string) => (cart || []).find((item) => item.sku === sku) || null

const snapshotsEqual = (left: Record<string, unknown>, right: Record<string, unknown>) => {
  const keys = Object.keys(left).filter((key) => key !== 'albumTypeFactor')
  return keys.every((key) => JSON.stringify(left[key]) === JSON.stringify(right[key]))
}

export default class PackageService {
  static validatePackageSlug(slug: unknown) {
    return typeof slug === 'string' && SLUG_PATTERN.test(slug.trim())
  }

  static extractFormConfig(orderForm: Record<string, unknown> = {}) {
    const formConfig: Record<string, unknown> = {}
    PACKAGE_FORM_FIELDS.forEach((field) => {
      formConfig[field] = orderForm[field]
    })
    formConfig.colorsVerified = true
    return formConfig
  }

  static getLockedSnapshotFromFormConfig(formConfig: Record<string, any> = {}) {
    const albumType = optionValue(formConfig.albumType)
    const factor = albumType === 'double' ? 2 : 1
    const outerType = optionValue(formConfig.outerPackagingType)
    const insertType = optionValue(formConfig.insertType)
    const colors = (formConfig.colors || []).map((color: any) => ({
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

  static getLockedSnapshotFromCart(pricedCart: any[] = []) {
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
      outerPackagingPrint: noneOrSupplied(outerType)
        ? null
        : variationValue(itemBySku(pricedCart, OUTER_PACKAGING_SKU), 'outerPackagingPrint'),
      outerPackagingFinish: noneOrSupplied(outerType)
        ? null
        : variationValue(itemBySku(pricedCart, OUTER_PACKAGING_SKU), 'outerPackagingFinish'),
      insertType,
      insertPrint: noneOrSupplied(insertType)
        ? null
        : variationValue(itemBySku(pricedCart, INSERT_SKU), 'insertPrint'),
      insertFinish: noneOrSupplied(insertType)
        ? null
        : variationValue(itemBySku(pricedCart, INSERT_SKU), 'insertFinish'),
      polybag: variationValue(itemBySku(pricedCart, POLYBAG_SKU), 'polybag'),
      assemblyOption: outerType === 'none'
        ? null
        : variationValue(itemBySku(pricedCart, ASSEMBLY_SKU), 'assemblyOption'),
      albumTypeFactor: factor,
    }
  }

  static cartMatchesPackageFormConfig(pricedCart: any[], formConfig: Record<string, any>) {
    return snapshotsEqual(
      this.getLockedSnapshotFromFormConfig(formConfig),
      this.getLockedSnapshotFromCart(pricedCart)
    )
  }

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

    if (!this.cartMatchesPackageFormConfig(pricedCart, pressingPackage.formConfig)) {
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
