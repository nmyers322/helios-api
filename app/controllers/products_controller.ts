import Product from '#models/product'

export default class ProductsController {
  async getAll() {
    const products = await Product.all();
    return products;
  }
}
