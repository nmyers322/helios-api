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

router.post('/api/session', [SessionController, 'store'])
router.delete('/api/session', [SessionController, 'destroy'])
    .use(middleware.auth({ guards: ['api'] }))

router.post('/api/account', [UsersController, 'create'])
router.get('/api/account', [UsersController, 'getMyAccount'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/products', [ProductController, 'getAll'])

router.get('/api/variations/:productId', [VariationsController, 'getByProductId'])

router.on('/*').renderInertia('home')



