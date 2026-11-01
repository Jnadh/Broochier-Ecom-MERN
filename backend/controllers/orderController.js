const Order = require("../model/order");

const sendEmail = require("../utils/sendEmail");

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;
    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({ message: "Invalid order data" });
    } else {
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentId,
      });
      await order.save();
      const message = `Dear ${req.user.name},\n\nYour order has been created successfully. Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\n\nThank you for shopping with us!`;

      try {
        await sendEmail(req.user.email, "Order Created", message);
      } catch (emailError) {
        console.error("Order email notification failed:", emailError);
      }
      res.status(201).json({ message: "Order created successfully", order });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders for a user
const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.product",
      "name price",
    );
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// get all orders for admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      await order.save();
      res.status(200).json({ message: "Order status updated successfully", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

module.exports = { createOrder, myOrders, getOrders, updateOrderStatus }
