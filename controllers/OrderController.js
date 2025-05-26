const Order = require('../models/orderSchema');

exports.createOrder = async (req, res) => {

    try {
        const userId = req.user.id;

        const { items, subtotal, tax, shipping, total, paymentMethod } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must include at least one item.' });
        }

        if (subtotal == null || tax == null || shipping == null || total == null) {
            return res.status(400).json({ message: 'Subtotal, tax, shipping, and total are required.' });
        }

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required.' });
        }

        const mappedItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtCheckout: item.price, // <-- fix here
        }));

        const newOrder = new Order({
            userId,
            items: mappedItems,
            subtotal,
            tax,
            shipping,
            total,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'processing'
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: savedOrder
        });
    } catch (error) {
        console.error('❌ Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
};
