import Order from '#models/order'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Product from '#models/product';
import Address from '#models/address';
import { convertLegacyOrder } from '#database/parse/legacyOrderConverter';
import legacyOrders from '../data/legacyOrders.json' with { type: 'json' }

function parseDateTime(dt: string) {
  // Trim microseconds to milliseconds for Luxon
  // Example: "2025-03-18 15:48:31.000000" -> "2025-03-18 15:48:31.000"
  const fixed = dt.replace(/(\.\d{3})\d{3}$/, '$1');
  return DateTime.fromFormat(fixed, 'yyyy-MM-dd HH:mm:ss.SSS');
}

export default class extends BaseSeeder {
  static environment: string[] = ['development', 'production']
    
  async run() {
    // const parsedOrders = [];
    const products = await Product.all();
    for (const legacyOrder of legacyOrders.sort((a, b) => a.id > b.id ? 1 : -1)) {
      const order = convertLegacyOrder(legacyOrder, products);
      let orderData = {
        userId: order.userId,
        billingAddress: JSON.stringify(order.billingAddress),
        pricedCart: JSON.stringify(order.pricedCart),
        selectedShippingOption: JSON.stringify(order.selectedShippingOption),
        shippingAddress: JSON.stringify(order.shippingAddress),
        totalPrice: order.totalPrice,
        externalOrderId: order.externalOrderId,
        externalOrder: order.externalOrder && JSON.stringify(order.externalOrder) || undefined,
        createdAt: parseDateTime(order.createdAt),
        updatedAt: parseDateTime(order.updatedAt),
        status: order.status,
      };
      await Order.updateOrCreate(
        { id: order.id },
        orderData
      )
      await Address.create({
        type: 'billing',
        userId: order.userId,
        firstName: order.billingAddress.firstName,
        lastName: order.billingAddress.lastName,
        company: order.billingAddress.company,
        address1: order.billingAddress.address1,
        address2: order.billingAddress.address2,
        city: order.billingAddress.city,
        state: order.billingAddress.state,
        postcode: order.billingAddress.postcode,
        country: order.billingAddress.country,
        phone: order.billingAddress.phone
      });
      await Address.create({
        type: 'shipping',
        userId: order.userId,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        address1: order.shippingAddress.address1,
        address2: order.shippingAddress.address2,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postcode: order.shippingAddress.postcode,
        country: order.shippingAddress.country
      });
      // parsedOrders.push({
      //   ...order.id,
      //   ...orderData
      // });
    }
    //console.log('Parsed Orders:', parsedOrders);
  }
}
