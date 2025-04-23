import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionController {
  async store({ request, auth }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    console.log("User auth request", email);
    const user = await User.verifyCredentials(email, password)
    console.log("User auth response", user);
    return await auth.use('api').createToken(user);
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('api').invalidateToken();
  }
}
