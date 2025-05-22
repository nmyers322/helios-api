import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import legacyUsers from '../data/legacyUsers.json' with { type: 'json' }

function ensureRole(role: string) {
  return role === 'admin' ? 'admin' : 'customer';
}

export default class extends BaseSeeder {
  static environment: string[] = ['development']
  
  async run() {
    legacyUsers.forEach(async (user) => {
      await User.updateOrCreate({
        id: parseInt(user.id)
      },
      {
        email: user.email,
        role: ensureRole(user.role),
        firstName: user.firstName,
        lastName: user.lastName
      });
    });
  }
}