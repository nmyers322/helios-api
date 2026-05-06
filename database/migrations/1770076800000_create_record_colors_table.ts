import { BaseSchema } from '@adonisjs/lucid/schema'

const DEFAULT_COLORS = [
  { name: 'Black', hexColor: '#000000' },
  { name: 'Blood Orange Translucent', hexColor: '#913E30' },
  { name: 'Blood Orange', hexColor: '#901717' },
  { name: 'Clear', hexColor: '#9F9C84' },
  { name: 'Cloud Translucent', hexColor: '#8E9AA8' },
  { name: 'Dark Purple', hexColor: '#24253F' },
  { name: 'Forest Green', hexColor: '#255048' },
  { name: 'Granny Smith Translucent', hexColor: '#21710F' },
  { name: 'Honey Translucent', hexColor: '#AB6C25' },
  { name: 'Lime Translucent', hexColor: '#487A59' },
  { name: 'Metallic Blue Translucent', hexColor: '#124D50' },
  { name: 'Metallic Bronze', hexColor: '#4F492F' },
  { name: 'Metallic Silver', hexColor: '#3E443F' },
  { name: 'Navy Blue Translucent', hexColor: '#304D96' },
  { name: 'Navy Blue', hexColor: '#224088' },
  { name: 'Orange', hexColor: '#B0361B' },
  { name: 'Pink Translucent', hexColor: '#B86E6C' },
  { name: 'Pink', hexColor: '#FF7695' },
  { name: 'Radioactive Translucent', hexColor: '#91D083' },
  { name: 'Red', hexColor: '#96212F' },
  { name: 'Sangria', hexColor: '#6E2746' },
  { name: 'Sea Blue Translucent', hexColor: '#5A5C8E' },
  { name: 'Sky Blue', hexColor: '#657CAF' },
  { name: 'Translucent Red', hexColor: '#AF3130' },
  { name: 'Turquoise Translucent', hexColor: '#287791' },
  { name: 'Turquoise', hexColor: '#559BCF' },
  { name: 'Violet Translucent', hexColor: '#903467' },
  { name: 'Violet', hexColor: '#411E28' },
  { name: 'White', hexColor: '#EBE7D7' },
  { name: 'Yellow Translucent', hexColor: '#BCB335' },
  { name: 'Yellow', hexColor: '#DDD221' },
]

export default class extends BaseSchema {
  protected tableName = 'record_colors'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 120).notNullable().unique()
      table.string('hex_color', 7).notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.integer('sort_order').notNullable().defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    await this.defer(async (db) => {
      await db.table(this.tableName).insert(
        DEFAULT_COLORS.map((color, index) => ({
          name: color.name,
          hex_color: color.hexColor,
          is_active: true,
          sort_order: index,
        }))
      )
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
