require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Order = require("./model/order");
const Product = require("./model/product");
const User = require("./model/User");

const demoUsers = [
  {
    name: "Broochier Admin",
    email: "admin@broochier.test",
    password: "Admin123!",
    role: "admin",
  },
  {
    name: "Demo Customer",
    email: "customer@broochier.test",
    password: "Customer123!",
    role: "user",
  },
];

const demoProducts = [
  {
    _id: "672000000000000000000001",
    name: "Classic Cotton T-Shirt",
    description: "A comfortable everyday cotton t-shirt.",
    price: 24.99,
    category: "Clothing",
    stock: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    numReviews: 12,
  },
  {
    _id: "672000000000000000000002",
    name: "Canvas Weekend Bag",
    description: "A durable canvas bag for short trips and daily use.",
    price: 49.99,
    category: "Accessories",
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    numReviews: 8,
  },
  {
    _id: "672000000000000000000003",
    name: "Ceramic Coffee Mug",
    description: "A glazed ceramic mug for your morning coffee or tea.",
    price: 14.5,
    category: "Home",
    stock: 42,
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    numReviews: 21,
  },
];

const demoOrders = [
  {
    paymentId: "seed-order-001",
    status: "delivered",
    address: {
      fullName: "Demo Customer",
      street: "123 Sample Street",
      city: "Austin",
      state: "Texas",
      zipCode: "78701",
      country: "United States",
    },
    items: [
      { productIndex: 0, qty: 2 },
      { productIndex: 2, qty: 1 },
    ],
  },
  {
    paymentId: "seed-order-002",
    status: "pending",
    address: {
      fullName: "Demo Customer",
      street: "123 Sample Street",
      city: "Austin",
      state: "Texas",
      zipCode: "78701",
      country: "United States",
    },
    items: [{ productIndex: 1, qty: 1 }],
  },
];

async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI is not set. Add it to backend/.env before seeding.",
    );
  }

  await mongoose.connect(process.env.MONGO_URI);

  const users = {};
  for (const demoUser of demoUsers) {
    const password = await bcrypt.hash(demoUser.password, 10);
    users[demoUser.role] = await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        $set: {
          name: demoUser.name,
          password,
          role: demoUser.role,
          verified: true,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  const products = [];
  for (const demoProduct of demoProducts) {
    const { _id, ...productData } = demoProduct;
    products.push(
      await Product.findOneAndUpdate(
        { _id },
        { $set: productData },
        { upsert: true, new: true, runValidators: true },
      ),
    );
  }

  for (const demoOrder of demoOrders) {
    const items = demoOrder.items.map(({ productIndex, qty }) => ({
      product: products[productIndex]._id,
      qty,
      price: products[productIndex].price,
    }));
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );

    await Order.findOneAndUpdate(
      { paymentId: demoOrder.paymentId },
      {
        $set: {
          user: users.user._id,
          items,
          totalAmount,
          address: demoOrder.address,
          status: demoOrder.status,
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  console.log(
    `Seeded ${demoUsers.length} demo users, ${demoProducts.length} products, and ${demoOrders.length} orders.`,
  );
  console.log("Demo admin login: admin@broochier.test / Admin123!");
  console.log("Demo customer login: customer@broochier.test / Customer123!");
}

seedDatabase()
  .catch((error) => {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
