import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
      table.string('external_order_id').nullable()
      table.text('external_order').nullable()
      table.string('status').notNullable()
      table.text('priced_cart').notNullable()
      table.text('shipping_address').notNullable()
      table.text('billing_address').notNullable()
      table.text('selected_shipping_option').notNullable()
      table.string('total_price').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}