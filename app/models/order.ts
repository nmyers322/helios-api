/*        const {billingAddress, cart, selectedShippingOption, shippingAddress} = request.all();
        console.log('Paypal initializeOrder called')
        console.log('billingAddress', billingAddress)
        console.log('cart', JSON.stringify(cart))
        const pricedCart = await CartService.getPricedCart(cart);
        console.log('pricedCart', JSON.stringify(pricedCart));
        const subTotalPrice = await CartService.getSubTotalPrice(pricedCart);
        console.log('subTotalPrice', subTotalPrice);
        console.log('selectedShippingOption', selectedShippingOption)
        const totalPrice = subTotalPrice + selectedShippingOption.totalCost;
        console.log('totalPrice', totalPrice);
        console.log('shippingAddress', shippingAddress)*/
import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.ts'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
  
  @column()
  public userId: number

  @column()
  public externalOrderId: string

  @column()
  public externalOrder: string

  @column()
  public status: "CREATED" | "PAID" | "SHIPPED" | "CANCELLED" | "REFUNDED" | "COMPLETED"

  @column()
  public pricedCart: string

  @column()
  public shippingAddress: string

  @column()
  public billingAddress: string

  @column()
  public selectedShippingOption: string

  @column()
  public totalPrice: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}