import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RecordColor extends BaseModel {
  public static table = 'record_colors'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public name!: string

  @column({ columnName: 'hex_color' })
  public hexColor!: string

  @column({ columnName: 'is_active' })
  public isActive!: boolean

  @column({ columnName: 'sort_order' })
  public sortOrder!: number

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public updatedAt!: DateTime
}
