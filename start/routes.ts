/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.ts'
import ProductController from '../app/controllers/products_controller.ts'
import SessionController from '../app/controllers/session_controller.ts'
import UsersController from '#controllers/users_controller'
import VariationsController from '#controllers/variations_controller'
import User from '#models/user'

router.post('/api/session', [SessionController, 'store'])
router.delete('/api/session', [SessionController, 'destroy'])
    .use(middleware.auth({ guards: ['api'] }))

router.post('/api/account', [UsersController, 'create'])
router.get('/api/account', [UsersController, 'getMyAccount'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/products', [ProductController, 'getAll'])

router.get('/api/variations/:productId', [VariationsController, 'getByProductId'])

router.get('/login/google', ({ ally }) => {
    return ally.use('google').redirect()
})

router.get('/login-success-google', async ({ ally, auth }) => {
    const google = ally.use('google')

    if (google.accessDenied()) {
        return 'You have cancelled the login process'
    }

    /**
     * OAuth state verification failed. This happens when the
     * CSRF cookie gets expired.
     */
    if (google.stateMisMatch()) {
        return 'We are unable to verify the request. Please try again'
    }

    if (google.hasError()) {
        return google.getError()
    }

    const googleUser = await google.user()
    let user = await User.findBy('email', googleUser?.email);
    if (!user) {
        user = await User.create({
            email: googleUser?.email,
            firstName: googleUser?.name,
            lastName: googleUser?.name,
            password: undefined
        });
    }
    return await auth.use('api').createToken(user);
})

router.on('/*').renderInertia('home')



