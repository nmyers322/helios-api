import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: 'shipping' | 'billing'

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public userId: number

  @column()
  public firstName: string
  
  @column()
  public lastName: string

  @column()
  public company: string | null

  @column({ serializeAs: 'address_1' })
  public address1: string

  @column({ serializeAs: 'address_2' })
  public address2: string | null

  @column()
  public city: string

  @column()
  public state: string

  @column()
  public postcode: string

  @column()
  public country: string

  @column()
  public phone: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}