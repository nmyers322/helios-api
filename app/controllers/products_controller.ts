import Product from '#models/product'

export default class SessionController {
  async getAll() {
    const products = await Product.all();
    return products;
  }
}
