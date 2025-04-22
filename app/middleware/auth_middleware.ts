import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      
      ctx.inertia.share({
        data: {user: ctx.auth.user},
      });

      await next();
    } catch (error) {
      // Handle unauthenticated requests
      if (ctx.request.ajax() || ctx.request.accepts(['json', 'html']) === 'json') {
        return ctx.response.unauthorized({ error: 'Unauthorized' });
      }

      return ctx.response.redirect(this.redirectTo);
    }
  }
}