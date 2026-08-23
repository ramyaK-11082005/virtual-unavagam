import Order from '../models/Order.js';
import Food from '../models/Food.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    if (!deliveryAddress) {
      res.status(400);
      throw new Error('Delivery address is required');
    }

    // Verify items exist and fetch their real prices at this time
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const foodItem = await Food.findById(item.food);
      if (!foodItem) {
        res.status(404);
        throw new Error(`Food item ${item.food} not found`);
      }
      
      const price = foodItem.price;
      const quantity = item.quantity;
      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        food: foodItem._id,
        name: foodItem.name,
        price,
        quantity,
      });
    }

    // Calculate totals: subtotal, delivery (e.g. ₹40), tax (e.g. 9% / ₹72), discount (e.g. ₹50 if order > ₹500, or simple promo logic)
    const deliveryFee = 40;
    const tax = Math.round(subtotal * 0.09); // 9% tax
    const discount = subtotal > 500 ? 50 : 0;
    const totalAmount = subtotal + deliveryFee + tax - discount;

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if the order belongs to the requester (or if user is admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    next(error);
  }
};
