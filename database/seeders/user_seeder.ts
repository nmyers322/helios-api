import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Address from '#models/address';

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
    });
    await Address.updateOrCreate({
      id: 1
    },
    {
      type: 'billing',
      userId: 1,
      firstName: "Nate",
      lastName: "Myers",
      company: "Eternal Warfare",
      address1: "1234 Eternal Warfare St.",
      address2: null,
      city: "Portland",
      state: "OR",
      postcode: "97211",
      country: "US",
      phone: "15035551234"
    });
    await Address.updateOrCreate({
      id: 2
    },
    {
      type: 'shipping',
      userId: 1,
      firstName: "Nate",
      lastName: "Myers",
      address1: "1234 Eternal Warfare St.",
      address2: null,
      city: "Portland",
      state: "OR",
      postcode: "97211",
      country: "US",
    })
  }
}