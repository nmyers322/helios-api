import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class SessionsController {
  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password']);
    const user = await User.findBy('email', email);
    if (user?.password === null) {
      return response.status(401).send({
        errors: [
          {
            message: "Invalid credentials",
          }
        ]
      });
    }
    const authorizedUser = await User.verifyCredentials(email, password);
    return await auth.use('api').createToken(authorizedUser);
  }

  async destroy({ auth }: HttpContext) {
    await auth.use('api').invalidateToken();
  }
}