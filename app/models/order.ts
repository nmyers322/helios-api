import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import PressingPackage from '#models/pressing_package'

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

  @belongsTo(() => PressingPackage, { foreignKey: 'packageId' })
  public pressingPackage!: BelongsTo<typeof PressingPackage>
  
  @column()
  public userId!: number

  @column({ columnName: 'package_id' })
  public packageId?: number | null

  @column({ columnName: 'discount_amount' })
  public discountAmount?: string | null

  @column({ columnName: 'catalog_subtotal' })
  public catalogSubtotal?: string | null

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

  @column({ columnName: 'order_comment' })
  public orderComment?: string | null

  @column({ columnName: 'admin_notes', serializeAs: null })
  public adminNotes?: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  public serializeForAdmin() {
    return {
      ...this.serialize(),
      adminNotes: this.adminNotes ?? null,
    }
  }
}