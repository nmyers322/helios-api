import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import legacyUsers from '../data/legacyUsers.json' with { type: 'json' }
import BadRequestException from '#exceptions/bad_request_exception';

function ensureRole(role: string) {
  return role === 'admin' ? 'admin' : 'customer';
}

export default class extends BaseSeeder {
  static environment: string[] = ['development', 'production']
  
  async run() {
    legacyUsers.forEach(async (user) => {
      let userId = parseInt(user.id);
      await User.updateOrCreate({
        id: userId
      },
      {
        email: user.email,
        role: ensureRole(user.role),
        firstName: user.firstName,
        lastName: user.lastName
      });
      if (user.email === "nmyers322@gmail.com") {
        const user = await User.find(userId)
            if (!user) {
              throw new BadRequestException('User not found')
            }
            user.password = "password"
            await user.save()
      }
    });
  }
}