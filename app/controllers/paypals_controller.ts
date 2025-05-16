import Order from '#models/order';
import CartService from '#services/CartService';
import type { HttpContext } from '@adonisjs/core/http';
import { CheckoutPaymentIntent, Client, Environment, LogLevel, OrdersController } from '@paypal/paypal-server-sdk';

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.VITE_REACT_APP_PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET
    },
    timeout: 5000,
    environment: Environment.Sandbox, // or Environment.Production
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
        const {billingAddress, cart, selectedShippingOption, shippingAddress} = request.all();
        console.log('Paypal initializeOrder called')
        console.log('billingAddress', billingAddress)
        console.log('cart', JSON.stringify(cart))
        const pricedCart = await CartService.getPricedCart(cart);
        console.log('pricedCart', JSON.stringify(pricedCart));
        const subTotalPrice = await CartService.getSubTotalPrice(pricedCart);
        console.log('subTotalPrice', subTotalPrice);
        console.log('selectedShippingOption', selectedShippingOption)
        const totalPrice = subTotalPrice + selectedShippingOption.totalCost;
        console.log('totalPrice', totalPrice);
        console.log('shippingAddress', shippingAddress)
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
        const collect = {
            id: orderId,
            prefer: "return=minimal"
        };
        try {
            const { body, ...httpResponse } = await ordersController.captureOrder(collect);
            const paypalOrder = JSON.parse(body);
            console.log('paypalOrder', paypalOrder);
            let order = await Order.findBy('externalOrderId', orderId);
            if (order) {
                order.status = paypalOrder.status;
                order.externalOrder = JSON.stringify(paypalOrder);
                let newShippingAddress = this.convertShippingAddress(paypalOrder.purchase_units[0].shipping);
                // Todo: Check if shipping address is correct. If not, update the customer's address in the database.
                order.shippingAddress = JSON.stringify(newShippingAddress);
                await order.save();
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