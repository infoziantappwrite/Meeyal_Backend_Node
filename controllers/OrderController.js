const Order = require('../models/orderSchema');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, subtotal, tax, shipping, finalTotal, paymentMethod, discountPercentage, discountAmount} = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must include at least one item.' });
        }

        if (subtotal == null || tax == null || shipping == null || finalTotal == null) {
            return res.status(400).json({ message: 'Subtotal, tax, shipping, and total are required.' });
        }

        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required.' });
        }

        const mappedItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtCheckout: item.price,
        }));

        const generateUniqueOrderId = () => {
            const timestamp = Date.now().toString();
            const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            return `ORDER-${timestamp}-${random}`;
        };

        const newOrder = new Order({
            userId,
            items: mappedItems,
            subtotal,
            tax,
            shipping,
            total: finalTotal,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'processing',
            discountPercentage,
            discountAmount,
            orderId: generateUniqueOrderId(), // <-- here
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

// Update order status if paymentStatus is 'pending'
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body; // e.g., 'shipped' or 'delivered'

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ message: `Cannot update orderStatus because paymentStatus is '${order.paymentStatus}'` });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all orders with paymentStatus 'pending' and return their orderStatus
exports.getPendingOrders = async (req, res) => {
  try {
    const pendingOrders = await Order.find({ paymentStatus: 'pending' }).select('orderId orderStatus paymentStatus');

    res.json({ orders: pendingOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
