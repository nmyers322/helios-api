import Address from '#models/address'
import Order from '#models/order'
import User from '#models/user'
import OrderCreated from '#services/emailbody/OrderCreated'
import EmailService from '#services/EmailService'
import OrderService from '#services/OrderService'

import type { HttpContext } from '@adonisjs/core/http'
import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk'

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.VITE_REACT_APP_PAYPAL_CLIENT_ID!,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET!
    },
    timeout: 5000,
    environment: process.env.NODE_ENV === "production" ? Environment.Production : Environment.Sandbox, // or Environment.Production
    logging: {
        logLevel: LogLevel.Info,
        logRequest: {
            logBody: true
        },
        logResponse: {
            logHeaders: true
        }
    }
});

const ordersController = new OrdersController(client);

export default class PaypalsController {
    async initializeOrder({ auth, request, response }: HttpContext) {
        const {
            billingAddress,
            selectedShippingOption,
            shippingAddress,
            pricedCart,
            totalPrice,
            orderComment
        } = await OrderService.getAndLogOrderInitializationParams(request);
        if (orderComment && orderComment.length > 500) {
            return response.status(422).json({ error: 'Order comment must be 500 characters or less' })
        }

        const collect = {
            body: {
                intent: CheckoutPaymentIntent.Capture,
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: 'USD',
                            value: totalPrice.toFixed(2),
                        }
                    }
                ]
            },
            prefer: 'return=minimal'
        };

        try {
            const { body, ...httpResponse } = await ordersController.createOrder(collect);
            if (typeof body !== 'string') {
                console.error('Error: body is not a string', body);
                throw new Error('Invalid response from PayPal');
            }
            let paypalOrder = JSON.parse(body);
            console.log('paypalOrder', paypalOrder);
            let order;
            if (paypalOrder.status === "CREATED") {
                order = await Order.create({
                    billingAddress: JSON.stringify(billingAddress),
                    pricedCart: JSON.stringify(pricedCart),
                    selectedShippingOption: JSON.stringify(selectedShippingOption),
                    shippingAddress: JSON.stringify(shippingAddress),
                    totalPrice: totalPrice.toFixed(2),
                    orderComment: orderComment,
                    externalOrderId: paypalOrder.id,
                    externalOrder: JSON.stringify(paypalOrder),
                    status: paypalOrder.status,
                    userId: auth?.user?.id
                });
            }
            return {
                jsonResponse: paypalOrder,
                httpStatusCode: httpResponse.statusCode,
                order: order
            };
        } catch (error) {
            console.error('Error creating order:', error);
            return response.status(500).json({ error: 'Failed to create order' });
        }
    }

    async captureOrder({ auth, request, response }: HttpContext) {
        const { orderId } = request.all();
        console.log('Paypal captureOrder called')
        console.log('orderId', orderId)
        let user = await User.query().where('id', auth.user!.id).first()
        if (!user) {
            return response.status(404).json({ error: 'User not found' })
        }
        const collect = {
            id: orderId,
            prefer: "return=minimal"
        };
        try {
            const { body, ...httpResponse } = await ordersController.captureOrder(collect);
            if (typeof body !== 'string') {
                console.error('Error: body is not a string', body);
                throw new Error('Invalid response from PayPal');
            }
            const paypalOrder = JSON.parse(body);
            if (paypalOrder.status !== 'COMPLETED') {
                console.error('Error: Order not completed', paypalOrder);
                throw new Error('Order not completed');
            }
            console.log('paypalOrder', paypalOrder);
            let order = await Order.findBy('externalOrderId', orderId);
            if (order) {
                order.status = "PAID";
                order.externalOrder = JSON.stringify(paypalOrder);
                let newShippingAddress = this.convertShippingAddress(paypalOrder.purchase_units[0].shipping);
                let customerShippingAddress = await Address.query().where('userId', auth.user!.id).where('type', 'shipping').first();
                if (customerShippingAddress) {
                    let fieldsToUpdate = ['firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'postcode', 'country'] as const;
                    let shouldUpdate = false;
                    for (let field of fieldsToUpdate) {
                        if ((customerShippingAddress as any)[field] !== newShippingAddress[field]) {
                            (customerShippingAddress as any)[field] = newShippingAddress[field];
                            shouldUpdate = true;
                        }
                    }
                    if (shouldUpdate) {
                        await customerShippingAddress.save();
                    }
                }
                order.shippingAddress = JSON.stringify(newShippingAddress);
                await order.save();
                EmailService.sendEmail(user.email,
                                'Order Confirmation: #' + order.id,
                                await OrderCreated.getEmailBody(order));
            } else {
                console.log('Order not found');
                // Handle the case where the order is not found
                // You might want to create a new order or return an error response
            }
            // Todo: Check if the order is already completed. If it is, return a message indicating that.
            // Todo: Next, ensure amount paid is correct. If it isn't let's silently alert admin through email.
            return {
                jsonResponse: paypalOrder,
                httpStatusCode: httpResponse.statusCode,
                order: order
            };
        } catch (error) {
            console.error('Error capturing order:', error);
            return response.status(500).json({ error: 'Failed to capture order' });
        }
    }

    private convertShippingAddress(shipping: any) {
        let name = shipping.name?.full_name?.split(' ') || [];
        let firstName = name.length > 0 ? name[0] : '';
        let lastName = name.length > 1 ? name[1] : '';
        let address1 = shipping.address?.address_line_1 || '';
        let address2 = shipping.address?.address_line_2 || '';
        let city = shipping.address?.admin_area_2 || '';
        let state = shipping.address?.admin_area_1 || '';
        let postcode = shipping.address?.postal_code || '';
        let country = shipping.address?.country_code || '';
        return {
            firstName: firstName,
            lastName: lastName,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country
        }
    }
}