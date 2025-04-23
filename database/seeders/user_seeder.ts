import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  static environment: string[] = ['development']
  
  async run() {
    await User.create({
      email: "nmyers322@gmail.com",
      password: "password",
      firstName: "Nate",
      lastName: "Myers",
      phone: "1234567890",
    })
  }
}