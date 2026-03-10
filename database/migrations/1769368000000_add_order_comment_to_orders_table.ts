import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('order_comment').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('order_comment')
    })
  }
}
