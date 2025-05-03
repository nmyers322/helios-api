import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const products = [
  {
      "id": 525,
      "name": "12 Inch Innersleeve",
      "sku": "helios-12inch-innersleeve",
      "price": "0.21"
  },
  {
      "id": 342,
      "name": "12 Inch Test Press Setup Fee Double LP",
      "sku": "helios-12inch-test-press-setup-fee-double-lp",
      "price": "105"
  },
  {
      "id": 286,
      "name": "Order Type",
      "sku": "helios-order-type",
      "price": "0"
  },
  {
      "id": 285,
      "name": "Total Quantity",
      "sku": "helios-total-quantity",
      "price": "0"
  },
  {
      "id": 284,
      "name": "Catalog Number",
      "sku": "helios-catalog-number",
      "price": "0"
  },
  {
      "id": 283,
      "name": "Album Title",
      "sku": "helios-album-title",
      "price": "0"
  },
  {
      "id": 282,
      "name": "Band Name",
      "sku": "helios-band-name",
      "price": "0"
  },
  {
      "id": 280,
      "name": "12 Inch Test Press Setup Fee Single LP",
      "sku": "helios-12inch-test-press-setup-fee-single-lp",
      "price": "110.25"
  },
  {
      "id": 102,
      "name": "12 Inch Assembly Option",
      "sku": "helios-12inch-assembly-option",
      "price": "0"
  },
  {
      "id": 89,
      "name": "12 Inch Center Labels",
      "sku": "helios-12inch-center-labels",
      "price": "168"
  },
  {
      "id": 87,
      "name": "12 Inch Color Setup Fee",
      "sku": "helios-12inch-color-setup-fee",
      "price": "105"
  },
  {
      "id": 86,
      "name": "12 Inch Weight",
      "sku": "helios-12inch-weight",
      "price": "0.53"
  },
  {
      "id": 83,
      "name": "12 Inch Color",
      "sku": "helios-12inch-color",
      "price": "2.1"
  },
  {
      "id": 82,
      "name": "12 Inch Test Press",
      "sku": "helios-12inch-test-press",
      "price": "5.25"
  },
  {
      "id": 81,
      "name": "Polybag",
      "sku": "helios-12inch-polybag",
      "price": "0"
  },
  {
      "id": 80,
      "name": "12 Inch Insert",
      "sku": "helios-12inch-insert",
      "price": "0"
  },
  {
      "id": 79,
      "name": "12 Inch Outer Packaging",
      "sku": "helios-12inch-outer-packaging",
      "price": "0"
  },
  {
      "id": 28,
      "name": "12 Inch Base Fee",
      "sku": "helios-12inch-base-fee",
      "price": "708.75"
  }
];

export default class extends BaseSeeder {
  static environment: string[] = ['development', 'production']
    
  async run() {
    products.forEach(async (product) => {
      await Product.updateOrCreate(
        {
          id: product.id
        },
        {
          name: product.name,
          sku: product.sku,
          price: product.price
        }
      )
    });
  }
}
