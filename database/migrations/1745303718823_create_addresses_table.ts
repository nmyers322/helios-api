import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE') // Delete addresses when the user is deleted
      
      table.string('type').notNullable() // 'shipping' or 'billing'
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('company').nullable()
      table.string('address_1').notNullable()
      table.string('address_2').nullable()
      table.string('city').notNullable()
      table.string('state').notNullable()
      table.string('postcode').notNullable()
      table.string('country').notNullable()
      table.string('phone').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}