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

router.post('/api/session', [SessionController, 'store'])
router.delete('/api/session', [SessionController, 'destroy'])
    .use(middleware.auth({ guards: ['api'] }))

router.on('/').renderInertia('home')



