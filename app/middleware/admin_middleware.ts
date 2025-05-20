import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AdminMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const authUser = ctx.auth.user
    if (!authUser) {
      return ctx.response.unauthorized({ error: 'Admins only' })
    }
    // Fetch the full user from the database
    const user = await User.find(authUser.id)
    if (!user || user.role !== 'admin') {
      return ctx.response.unauthorized({ error: 'Admins only' })
    }
    await next()
  }
}