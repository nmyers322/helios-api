import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  static environment: string[] = ['development']
  
  async run() {
    await User.updateOrCreate({
      id: 1
    },
    {
      email: "nmyers322@gmail.com",
      role: "admin",
      password: "password",
      firstName: "Nate",
      lastName: "Myers",
      phone: "1234567890",
    })
  }
}