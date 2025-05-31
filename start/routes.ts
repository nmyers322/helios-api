/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ProductsController from '#controllers/products_controller'
import SessionsController from '#controllers/sessions_controller'
import UsersController from '#controllers/users_controller'
import VariationsController from '#controllers/variations_controller'
import OauthsController from '#controllers/oauths_controller'
import AddressesController from '#controllers/addresses_controller'
import ShippingOptionsController from '#controllers/shipping_options_controller'
import PaypalsController from '#controllers/paypals_controller'
import OrdersController from '#controllers/orders_controller'
import StripesController from '#controllers/stripes_controller'
import Order from '#models/order'
import ContactController from '#controllers/contact_controller'

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

router.post('/api/account/reset-password', [UsersController, 'requestResetPassword'])
router.put('/api/account/reset-password', [UsersController, 'resetPassword'])

router.get('/api/orders/:id', [OrdersController, 'getById'])
    .use(middleware.auth({ guards: ['api'] }))
router.get('/api/orders', [OrdersController, 'getAll'])
    .use(middleware.auth({ guards: ['api'] }))
router.post('/api/orders', [OrdersController, 'initializeOrder'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/admin/orders', [OrdersController, 'getAllAdmin'])
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.admin())
router.put('/api/admin/orders/:id', [OrdersController, 'updateOrder'])
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.admin())

router.post('/api/contact', [ContactController, 'sendMessage'])

router.post('/api/paypal/order', [PaypalsController, 'initializeOrder'])
    .use(middleware.auth({ guards: ['api'] }))
router.post('/api/paypal/capture', [PaypalsController, 'captureOrder'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/products', [ProductsController, 'getAll'])

router.post('/api/shipping-options', [ShippingOptionsController, 'getShippingOptions'])
    .use(middleware.auth({ guards: ['api'] }))

router.post('/api/stripe/order', [StripesController, 'initializeOrder'])
    .use(middleware.auth({ guards: ['api'] }))

router.get('/api/variations/:productId', [VariationsController, 'getByProductId'])

router.get('/checkout/stripe-success', [StripesController, 'success'])

router.get('/login/google', ({ ally }) => {
    return ally.use('google').redirect()
})
router.get('/login-success-google', [OauthsController, 'googleLogin'])

router.get('/emailtemplates/order-created/:orderId', async ({ request, response }) => {
    const OrderCreated = (await import('#services/emailbody/OrderCreated')).default
    const order = await Order.findOrFail(request.param('orderId'))
    if (!order) {
        return response.status(404).send('Order not found')
    }
    const emailBody = await OrderCreated.getEmailBody(order)
    response.send(emailBody)
})

router.on('/*').renderInertia('home')



