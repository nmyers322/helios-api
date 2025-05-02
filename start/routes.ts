/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import SessionController from '#controllers/SessionController'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.ts'
import AccountController from '../app/controllers/AccountController.js'

router.post('/api/session', [SessionController, 'store'])
router.delete('/api/session', [SessionController, 'destroy'])
    .use(middleware.auth({ guards: ['api'] }))
router.post('/api/account', [AccountController, 'create'])

router.on('/*').renderInertia('home')



