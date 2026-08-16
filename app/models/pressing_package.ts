import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PressingPackage extends BaseModel {
  public static table = 'packages'

  @column({ isPrimary: true })
  public id!: number

  @column()
  public name!: string

  @column()
  public slug!: string

  @column()
  public description?: string | null

  @column({ columnName: 'cta_label' })
  public ctaLabel?: string | null

  @column({ columnName: 'advertised_price' })
  public advertisedPrice!: string

  @column({ columnName: 'is_active' })
  public isActive!: boolean

  @column({ columnName: 'sort_order' })
  public sortOrder!: number

  @column({
    columnName: 'form_config',
    prepare: (value: unknown) => JSON.stringify(value ?? {}),
    consume: (value: unknown) => {
      if (value == null) {
        return {}
      }
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return {}
        }
      }
      return value
    },
  })
  public formConfig!: Record<string, unknown>

  @column.dateTime({ autoCreate: true, columnName: 'created_at' })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, columnName: 'updated_at' })
  public updatedAt!: DateTime
}
