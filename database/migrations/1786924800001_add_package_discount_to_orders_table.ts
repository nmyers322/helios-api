import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('package_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('packages')
        .onDelete('SET NULL')
      table.decimal('discount_amount', 12, 2).nullable()
      table.decimal('catalog_subtotal', 12, 2).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('package_id')
      table.dropColumn('discount_amount')
      table.dropColumn('catalog_subtotal')
    })
  }
}
