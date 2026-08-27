// Файл для интеграции платежной системы Stripe (пример)

const STRIPE_CONFIG = {
    publicKey: 'pk_test_YOUR_STRIPE_KEY',
    apiEndpoint: '/api/create-payment',
};

// Пример функции для обработки платежа со Stripe
async function processStripePayment(itemId) {
    const item = GAME_DATA.shopItems.find(i => i.id === itemId);
    
    try {
        // Создаём платёжный сессию на сервере
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                amount: Math.round(item.price * 100), // в центах
                currency: 'usd',
            })
        });

        const session = await response.json();
        
        // Перенаправляем на Stripe Checkout
        // const stripe = Stripe(STRIPE_CONFIG.publicKey);
        // await stripe.redirectToCheckout({ sessionId: session.id });
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Ошибка при обработке платежа');
    }
}

// Пример обработчика вебхука (на сервере Node.js)
/*
const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            // Добавляем кристаллы пользователю в БД
            console.log(`Payment completed for ${session.customer_email}`);
            // await updateUserGems(session.customer_email, gemsAmount);
        }
        
        res.json({received: true});
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});
*/

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { STRIPE_CONFIG, processStripePayment };
}
