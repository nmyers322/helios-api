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
import ProductsController from '../app/controllers/products_controller.ts'
import SessionsController from '../app/controllers/sessions_controller.ts'
import UsersController from '#controllers/users_controller'
import VariationsController from '#controllers/variations_controller'
import OauthsController from '#controllers/oauths_controller'
import AddressesController from '#controllers/addresses_controller'

router.post('/api/session', [SessionsController, 'store'])
router.delete('/api/session', [SessionsController, 'destroy'])
    .use(middleware.auth({ guards: ['api'] }))

router.post('/api/account', [UsersController, 'create'])
router.get('/api/account', [UsersController, 'getMyAccount'])
    .use(middleware.auth({ guards: ['api'] }))
router.put('/api/account', [UsersController, 'update'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/account/addresses', [AddressesController, 'getAll'])
    .use(middleware.auth({ guards: ['api'] }))
router.put('/api/account/addresses', [AddressesController, 'createOrUpdate'])
    .use(middleware.auth({ guards: ['api'] }))
// router.delete('/api/account/addresses', [AddressesController, 'delete'])
//     .use(middleware.auth({ guards: ['api'] }))

router.get('/api/products', [ProductsController, 'getAll'])

router.get('/api/variations/:productId', [VariationsController, 'getByProductId'])

router.get('/login/google', ({ ally }) => {
    return ally.use('google').redirect()
})
router.get('/login-success-google', [OauthsController, 'googleLogin'])

router.on('/*').renderInertia('home')



