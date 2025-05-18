import Order from '#models/order';
import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/OrderService';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil' as any,
});

export default class StripesController {
    async initializeOrder({ auth, request, response }: HttpContext) {
        const {
            billingAddress,
            selectedShippingOption,
            shippingAddress,
            pricedCart,
            totalPrice
        } = await OrderService.getAndLogOrderInitializationParams(request);

        const buildOrderName = (cart: any) => {
            const bandName = cart.find((i: any) => i.sku === 'helios-band-name')?.variation?.find((v: any) => v.attribute === 'bandName')?.value;
            const albumTitle = cart.find((i: any) => i.sku === 'helios-album-title')?.variation?.find((v: any) => v.attribute === 'albumTitle')?.value;
            const catalogNumber = cart.find((i: any) => i.sku === 'helios-catalog-number')?.variation?.find((v: any) => v.attribute === 'catalogNumber')?.value;
            const totalQuantity = cart.find((i: any) => i.sku === 'helios-total-quantity')?.quantity.toString();
            const orderName = `Band Name: ${bandName}, Album Title: ${albumTitle}, Catalog Number: ${catalogNumber}, Total Quantity: ${totalQuantity}`;
            return orderName;
        }

        try {
            const stripeSession = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: buildOrderName(pricedCart)
                        },
                        unit_amount: Math.round(totalPrice * 100), // Amount in cents
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                ui_mode: 'custom',
                return_url: process.env.VITE_REACT_APP_DOMAIN + '/checkout/stripe-success?session_id={CHECKOUT_SESSION_ID}'
            });

            console.log('stripeSession', stripeSession);
            let order;
            if (stripeSession.status === "open") {
                order = await Order.create({
                    billingAddress: JSON.stringify(billingAddress),
                    pricedCart: JSON.stringify(pricedCart),
                    selectedShippingOption: JSON.stringify(selectedShippingOption),
                    shippingAddress: JSON.stringify(shippingAddress),
                    totalPrice: totalPrice.toFixed(2),
                    externalOrderId: stripeSession.id,
                    externalOrder: JSON.stringify(stripeSession),
                    status: stripeSession.status,
                    userId: auth?.user?.id
                });
            }

            return response.status(201).json({ 
                checkoutSessionClientSecret: stripeSession.client_secret, 
                order: order
            });
        } catch (error) {
            console.error('Error creating Stripe session:', error);
            return response.status(500).json({ error: 'Failed to create order' });
        }
    }

    async success({ request, response }: HttpContext) {
        const sessionId = request.input('session_id');
        console.log('Stripe success called with sessionId:', sessionId);
        
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            console.log('Stripe session retrieved:', session);

            if (session.payment_status === 'paid') {
                let order = await Order.findBy('externalOrderId', session.id);
                if (order) {
                    order.status = session.payment_status;
                    order.externalOrder = JSON.stringify(session);
                    await order.save();
                    return response.redirect('/checkout/order-received/' + order.id);
                } else {
                    console.log('Order not found');
                    // Handle the case where the order is not found
                    // You might want to create a new order or return an error response
                    return response.redirect('/checkout/stripe-error');
                }
            } else {
                // Redirect to a custom stripe error page
                return response.redirect('/checkout/stripe-error');
            }
        } catch (error) {
            console.error('Error retrieving Stripe session:', error);
            return response.redirect('/checkout/stripe-error');
        }
    }
}