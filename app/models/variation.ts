import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import Product from '#models/product'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Variation extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public productId!: number

  @belongsTo(() => Product)
  public product!: BelongsTo<typeof Product>

  @column()
  public name!: string

  @column()
  public price!: string

  @column()
  public sku!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}