import { test } from '@japa/runner'
import DiscountService from '#services/DiscountService'
import {
  advertisedPriceDiscount,
  applyAdvertisedPriceDiscount,
  applyPackageToOrderForm,
  cartMatchesPackageFormConfig,
  extractFormConfig,
  getCatalogSubtotalFromPrices,
  getLockedSnapshotFromCart,
  getLockedSnapshotFromFormConfig,
  getPackageCtaLabel,
  getPackageDiscountDisplay,
  validateAdvertisedPrice,
  validatePackageSlug,
} from '../../inertia/app/src/modules/packageDeals.js'

const formConfig = {
  albumType: { value: 'single', label: 'Single LP' },
  weight: { value: '160g', label: 'Standard (160g)' },
  totalQuantity: 500,
  testPresses: 5,
  colors: [{ color: { value: 'Black', label: 'Black' }, quantity: 500 }],
  colorsVerified: true,
  centerLabel: { value: 'bw', label: 'Black and White Only' },
  innersleeve: { value: 'whitePaperSleeve', label: 'White Paper Sleeve' },
  outerPackagingType: { value: 'standardJacket', label: 'Standard Jacket' },
  outerPackagingPrint: { value: 'color', label: 'Full Color' },
  outerPackagingFinish: { value: 'standardGloss', label: 'Standard Gloss' },
  insertType: { value: 'none', label: 'None' },
  insertPrint: null,
  insertFinish: null,
  polybag: { value: 'polybag', label: 'Polybag' },
  assemblyOption: { value: 'insertRecordInJacket', label: 'Insert Record In Jacket' },
}

const matchingCart = [
  { sku: 'helios-12inch-base-fee', quantity: 1 },
  { sku: 'helios-total-quantity', quantity: 500 },
  { sku: 'helios-12inch-test-press', quantity: 5 },
  {
    sku: 'helios-12inch-weight',
    quantity: 500,
    variation: [{ attribute: 'weight', value: '160g' }],
  },
  {
    sku: 'helios-12inch-color',
    quantity: 500,
    variation: [{ attribute: 'color', value: 'Black' }],
  },
  {
    sku: 'helios-12inch-center-labels',
    quantity: 1,
    variation: [{ attribute: 'centerLabel', value: 'bw' }],
  },
  {
    sku: 'helios-12inch-innersleeve',
    quantity: 500,
    variation: [{ attribute: 'innersleeve', value: 'whitePaperSleeve' }],
  },
  {
    sku: 'helios-12inch-outer-packaging',
    quantity: 1,
    variation: [
      { attribute: 'outerPackagingType', value: 'standardJacket' },
      { attribute: 'outerPackagingPrint', value: 'color' },
      { attribute: 'outerPackagingFinish', value: 'standardGloss' },
    ],
  },
  {
    sku: 'helios-12inch-insert',
    quantity: 1,
    variation: [{ attribute: 'insertType', value: 'none' }],
  },
  {
    sku: 'helios-12inch-polybag',
    quantity: 500,
    variation: [{ attribute: 'polybag', value: 'polybag' }],
  },
  {
    sku: 'helios-12inch-assembly-option',
    quantity: 1,
    variation: [{ attribute: 'assemblyOption', value: 'insertRecordInJacket' }],
  },
]

test.group('advertised price discount', () => {
  test('charges advertised price when it is lower than catalog', ({ assert }) => {
    const applied = applyAdvertisedPriceDiscount({
      catalogSubtotal: 2000,
      advertisedPrice: 1500,
      shippingPrice: 50,
    })
    assert.equal(applied.discountAmount, 500)
    assert.equal(applied.pressingTotal, 1500)
    assert.equal(applied.totalPrice, 1550)
  })

  test('charges catalog when advertised price is higher (no negative discount)', ({ assert }) => {
    const applied = applyAdvertisedPriceDiscount({
      catalogSubtotal: 1400,
      advertisedPrice: 1500,
      shippingPrice: 25,
    })
    assert.equal(applied.discountAmount, 0)
    assert.equal(applied.pressingTotal, 1400)
    assert.equal(applied.totalPrice, 1425)
  })

  test('charges catalog when advertised equals catalog', ({ assert }) => {
    assert.equal(advertisedPriceDiscount(1500, 1500), 0)
  })

  test('DiscountService matches the shared helper', ({ assert }) => {
    const input = { catalogSubtotal: 1876.41, advertisedPrice: 1499, shippingPrice: 42.1 }
    assert.deepEqual(
      DiscountService.applyAdvertisedPriceDiscount(input),
      applyAdvertisedPriceDiscount(input)
    )
  })

  test('rejects advertised prices that are not a real discount', ({ assert }) => {
    assert.isFalse(validateAdvertisedPrice(0, 2000).valid)
    assert.isFalse(validateAdvertisedPrice(-10, 2000).valid)
    assert.isFalse(validateAdvertisedPrice(2000, 2000).valid)
    assert.isFalse(validateAdvertisedPrice(2100, 2000).valid)
    assert.isTrue(validateAdvertisedPrice(1500, 2000).valid)
    assert.deepEqual(
      DiscountService.validateAdvertisedPrice(1500, 2000),
      validateAdvertisedPrice(1500, 2000)
    )
  })
})

test.group('package form config matching', () => {
  test('matches a cart that has the locked package specs', ({ assert }) => {
    assert.isTrue(cartMatchesPackageFormConfig(matchingCart, formConfig))
  })

  test('rejects a cart with a different color quantity', ({ assert }) => {
    const cart = matchingCart.map((item) =>
      item.sku === 'helios-12inch-color' ? { ...item, quantity: 400 } : item
    )
    assert.isFalse(cartMatchesPackageFormConfig(cart, formConfig))
  })

  test('divides double LP cart quantities back to album copies', ({ assert }) => {
    const doubleConfig = {
      ...formConfig,
      albumType: { value: 'double', label: 'Double LP' },
    }
    const doubleCart = matchingCart.map((item) => {
      if (item.sku === 'helios-12inch-base-fee') {
        return { ...item, quantity: 2 }
      }
      if (item.sku === 'helios-12inch-color' || item.sku === 'helios-12inch-weight') {
        return { ...item, quantity: item.quantity * 2 }
      }
      return item
    })
    assert.equal(getLockedSnapshotFromCart(doubleCart).totalQuantity, 500)
    assert.equal(getLockedSnapshotFromCart(doubleCart).colors[0].quantity, 500)
    assert.equal(getLockedSnapshotFromFormConfig(doubleConfig).albumType, 'double')
    assert.isTrue(cartMatchesPackageFormConfig(doubleCart, doubleConfig))
  })

  test('ignores unlocked album identity fields when matching', ({ assert }) => {
    const cartWithBand = matchingCart.concat([
      {
        sku: 'helios-band-name',
        quantity: 1,
        variation: [{ attribute: 'bandName', value: 'Example Band' }],
      },
    ])
    assert.isTrue(cartMatchesPackageFormConfig(cartWithBand, formConfig))
  })
})

test.group('package display helpers', () => {
  test('builds a CTA label from name and advertised price', ({ assert }) => {
    assert.equal(
      getPackageCtaLabel({ name: '500 Black 12"', advertisedPrice: 1499, ctaLabel: null }),
      '500 Black 12"  $1499.00'
    )
    assert.equal(
      getPackageCtaLabel({ name: '500 Black 12"', advertisedPrice: 1499, ctaLabel: 'Black 500 deal' }),
      'Black 500 deal'
    )
  })

  test('applies package fields onto a fresh order form', ({ assert }) => {
    const applied = applyPackageToOrderForm({
      id: 9,
      slug: '500-black',
      name: '500 Black 12"',
      advertisedPrice: 1499,
      formConfig,
    })
    assert.equal(applied.packageId, 9)
    assert.equal(applied.packageSlug, '500-black')
    assert.equal(applied.totalQuantity, 500)
    assert.isTrue(applied.colorsVerified)
    assert.equal(extractFormConfig(applied).weight.value, '160g')
  })

  test('quote discount display hides a zero discount', ({ assert }) => {
    const withDiscount = getPackageDiscountDisplay({
      catalogSubtotal: 2000,
      advertisedPrice: 1500,
      shippingAmount: 40,
    })
    assert.isTrue(withDiscount.showDiscount)
    assert.equal(withDiscount.totalPrice, 1540)
    const withoutDiscount = getPackageDiscountDisplay({
      catalogSubtotal: 1500,
      advertisedPrice: 0,
      shippingAmount: 40,
    })
    assert.isFalse(withoutDiscount.showDiscount)
    assert.equal(withoutDiscount.totalPrice, 1540)
  })

  test('accepts lowercase hyphenated slugs only', ({ assert }) => {
    assert.isTrue(validatePackageSlug('500-black'))
    assert.isFalse(validatePackageSlug('500 Black'))
    assert.isFalse(validatePackageSlug('-black'))
  })

  test('sums catalog prices from a price function', ({ assert }) => {
    const subtotal = getCatalogSubtotalFromPrices(
      { colors: [{ quantity: 500 }, { quantity: 200 }] },
      (name) => (name === 'color' ? 100 : 10)
    )
    assert.equal(subtotal, 290)
  })
})
