import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export type OrderStatus =
  | "CART"
  | "CREATED"
  | "PAID"
  | "SHIPPED"
  | "CANCELLED"
  | "REFUNDED"
  | "COMPLETED"
  | "DELETED";

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User>
  
  @column()
  public userId!: number

  @column()
  public externalOrderId!: string

  @column()
  public externalOrder!: string

  @column()
  public status!: OrderStatus

  @column()
  public pricedCart!: string

  @column()
  public shippingAddress!: string

  @column()
  public billingAddress!: string

  @column()
  public selectedShippingOption!: string

  @column()
  public totalPrice!: string

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}