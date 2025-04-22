import { DateTime } from 'luxon'
import {
  BaseModel,
  belongsTo,
  column
} from '@adonisjs/lucid/orm'
import User from './user.js'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public type: 'shipping' | 'billing'

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public firstName: string
  
  @column()
  public lastName: string

  @column()
  public company: string | null

  @column()
  public address1: string

  @column()
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