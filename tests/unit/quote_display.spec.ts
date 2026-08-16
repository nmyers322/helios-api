import { test } from '@japa/runner'
import CartService from '#services/CartService'
import {
  getAllColors,
  getWeighedColorItems,
} from '../../inertia/app/src/modules/weighedColors.js'
import {
  getColorLineTotal,
  getColorWeightShare,
  getCompletedOrderDisplay,
  getEmailColorDisplay,
  getQuoteDisplayLines,
  getQuoteGrandTotal,
  getWeightDisplay,
} from '../../inertia/app/src/modules/quoteDisplay.js'
import { getOrdersOverviewViewState } from '../../inertia/app/src/modules/ordersOverview.js'

const COLOR_SKU = 'helios-12inch-color'
const WEIGHT_SKU = 'helios-12inch-weight'

const black500Cart = [
  {
    sku: COLOR_SKU,
    quantity: 500,
    price: 2.1,
    total: 1050,
    variation: [
      { attribute: 'color', value: 'Black' },
      { attribute: 'baseFee', value: 'black' },
    ],
  },
  {
    sku: WEIGHT_SKU,
    quantity: 500,
    price: 0.53,
    total: 265,
    variation: [{ attribute: 'weight', value: '160g' }],
  },
]

const twoColorCart = [
  {
    sku: COLOR_SKU,
    quantity: 300,
    price: 2.1,
    total: 630,
    variation: [
      { attribute: 'color', value: 'Black' },
      { attribute: 'baseFee', value: 'black' },
    ],
  },
  {
    sku: COLOR_SKU,
    quantity: 200,
    price: 2.78,
    total: 556,
    variation: [
      { attribute: 'color', value: 'Blood Orange' },
      { attribute: 'baseFee', value: 'color' },
    ],
  },
  {
    sku: WEIGHT_SKU,
    quantity: 500,
    price: 0.53,
    total: 265,
    variation: [{ attribute: 'weight', value: '160g' }],
  },
]

const doubleLpCart = [
  {
    sku: COLOR_SKU,
    quantity: 1000,
    price: 2.1,
    total: 2100,
    variation: [
      { attribute: 'color', value: 'Black' },
      { attribute: 'baseFee', value: 'black' },
    ],
  },
  {
    sku: WEIGHT_SKU,
    quantity: 1000,
    price: 0.53,
    total: 530,
    variation: [{ attribute: 'weight', value: '160g' }],
  },
]

test.group('getWeighedColorItems', () => {
  test('folds weight unit price into each color line for a single color', ({ assert }) => {
    const weighed = getWeighedColorItems(black500Cart)
    assert.lengthOf(weighed, 1)
    assert.equal(weighed[0].price, 2.63)
    assert.equal(weighed[0].total, 1315)

    const unweighedColorTotal = 1050
    const weightTotal = 265
    assert.equal(weighed[0].total, unweighedColorTotal + weightTotal)
  })

  test('allocates weight across multiple colors and matches the full weight SKU', ({ assert }) => {
    const weighed = getWeighedColorItems(twoColorCart)
    assert.lengthOf(weighed, 2)
    assert.equal(weighed[0].total, 789)
    assert.equal(weighed[1].total, 662)
    const weighedSum = weighed.reduce((sum, item) => sum + item.total, 0)
    const unweighedSum = 630 + 556
    assert.equal(weighedSum, unweighedSum + 265)
  })

  test('CartService.getWeighedColorItems matches the shared helper', ({ assert }) => {
    assert.deepEqual(
      CartService.getWeighedColorItems(twoColorCart).map((item) => ({
        price: item.price,
        total: item.total,
        quantity: item.quantity,
      })),
      getWeighedColorItems(twoColorCart).map((item) => ({
        price: item.price,
        total: item.total,
        quantity: item.quantity,
      }))
    )
  })

  test('double LP cart quantities already include both discs', ({ assert }) => {
    const weighed = getWeighedColorItems(doubleLpCart)
    assert.equal(weighed[0].price, 2.63)
    assert.equal(weighed[0].total, 2630)
  })
})

test.group('getAllColors / completed order display', () => {
  test('returns folded color totals without changing stored weight SKU', ({ assert }) => {
    const order = { pricedCart: twoColorCart }
    const colors = getAllColors(order)
    assert.equal(colors[0].total, 789)
    assert.equal(colors[1].total, 662)
    assert.equal(order.pricedCart.find((item) => item.sku === WEIGHT_SKU)?.total, 265)
    assert.equal(order.pricedCart.find((item) => item.sku === COLOR_SKU)?.total, 630)
  })

  test('completed order weight display has a label and no amount', ({ assert }) => {
    const display = getCompletedOrderDisplay({ pricedCart: black500Cart })
    assert.equal(display.weight.label, '160g')
    assert.isNull(display.weight.amount)
    assert.equal(display.colors[0].total, 1315)
  })
})

test.group('quote display helpers', () => {
  test('weight display is label-only', ({ assert }) => {
    const display = getWeightDisplay('Standard (160g)')
    assert.equal(display.label, 'Standard (160g)')
    assert.isNull(display.amount)
  })

  test('color line includes that color share of weight and not a second copy of weight', ({ assert }) => {
    const colorTotal = 1050
    const weightTotal = 265
    const share = getColorWeightShare(weightTotal, 500, 500)
    assert.equal(share, 265)
    assert.equal(getColorLineTotal(colorTotal, weightTotal, 500, 500), 1315)
    assert.notEqual(getColorLineTotal(colorTotal, weightTotal, 500, 500), colorTotal)
    assert.notEqual(getColorLineTotal(colorTotal, weightTotal, 500, 500), colorTotal + weightTotal * 2)
  })

  test('customer-facing quote lines fold weight into colors and keep the grand total single-counted', ({ assert }) => {
    const albumType = 708.75
    const shipping = 100
    const display = getQuoteDisplayLines({
      weightLabel: 'Standard (160g)',
      weightTotal: 265,
      totalQuantity: 500,
      colors: [{ label: '500 Black Records', colorTotal: 1050, quantity: 500 }],
      otherPricedRows: [{ key: 'albumType', amount: albumType }],
      shippingAmount: shipping,
    })

    assert.isNull(display.weight.amount)
    assert.equal(display.weight.label, 'Standard (160g)')
    assert.equal(display.colorLines[0].amount, 1315)

    const unfoldedGrandTotal = getQuoteGrandTotal({
      itemTotals: [albumType, 265],
      colorTotals: [1050],
      shipping,
    })
    assert.equal(display.grandTotal, unfoldedGrandTotal)
    assert.equal(display.visiblePressingTotal, display.grandTotal)
    assert.notEqual(display.grandTotal, 1315 + 265 + albumType + shipping)
  })

  test('multi-color quote display allocates weight by quantity', ({ assert }) => {
    const display = getQuoteDisplayLines({
      weightLabel: 'Standard (160g)',
      weightTotal: 265,
      totalQuantity: 500,
      colors: [
        { label: '300 Black Records', colorTotal: 630, quantity: 300 },
        { label: '200 Blood Orange Records', colorTotal: 556, quantity: 200 },
      ],
      otherPricedRows: [],
      shippingAmount: 0,
    })
    assert.equal(display.colorLines[0].amount, 789)
    assert.equal(display.colorLines[1].amount, 662)
    assert.equal(display.grandTotal, 630 + 556 + 265)
    assert.equal(display.visiblePressingTotal, display.grandTotal)
  })

  test('double LP quote uses unfolded totals and still folds weight once', ({ assert }) => {
    const display = getQuoteDisplayLines({
      weightLabel: 'Standard (160g)',
      weightTotal: 530,
      totalQuantity: 500,
      colors: [{ label: '500 Black Double Records', colorTotal: 2100, quantity: 500 }],
      otherPricedRows: [],
      shippingAmount: 0,
    })
    assert.equal(display.colorLines[0].amount, 2630)
    assert.equal(display.grandTotal, 2630)
    assert.isNull(display.weight.amount)
  })
})

test.group('email color display', () => {
  test('email color unit price includes weight and weight remains label-only', ({ assert }) => {
    const colors = getEmailColorDisplay(black500Cart)
    assert.equal(colors[0].unitPrice, 2.63)
    assert.equal(colors[0].total, 1315)
    const weight = getWeightDisplay('Standard (160g)')
    assert.isNull(weight.amount)
  })
})

test.group('admin orders overview view state', () => {
  test('shows loading when fetching an empty list', ({ assert }) => {
    assert.equal(
      getOrdersOverviewViewState({ fetching: true, orders: {}, statuses: ['CREATED'] }),
      'loading'
    )
  })

  test('shows empty after load with no matching orders', ({ assert }) => {
    assert.equal(
      getOrdersOverviewViewState({
        fetching: false,
        orders: { 1: { status: 'COMPLETED' } },
        statuses: ['CREATED'],
      }),
      'empty'
    )
  })

  test('shows error when error text is set', ({ assert }) => {
    assert.equal(
      getOrdersOverviewViewState({ fetching: false, orders: {}, errorText: 'Error fetching orders' }),
      'error'
    )
  })

  test('shows ready when matching orders exist', ({ assert }) => {
    assert.equal(
      getOrdersOverviewViewState({
        fetching: false,
        orders: { 1: { status: 'CREATED' } },
        statuses: ['CREATED'],
      }),
      'ready'
    )
  })
})
