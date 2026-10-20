# Broochier — Full-Stack E-Commerce

Broochier is my full-stack e-commerce project, built with React, Express, and MongoDB. It brings together a customer storefront and an admin area for managing products and orders.

The project is branded as Broochier across the storefront, backend messages, and demo accounts.

## What the app can do

### Shopping

- Browse featured products and the full product catalog.
- Search products by name and view product details, price, and stock.
- Add products to a Redux-managed shopping cart, change quantities, and remove items.
- Submit a shipping address and proceed through the Razorpay payment flow.
- Create orders associated with a signed-in customer.

### Accounts

- Register and sign in with an email and password.
- Hash account passwords with bcrypt and issue JWTs for authenticated requests.
- Keep the signed-in user in the frontend auth context between page refreshes.
- View an account profile and order history.

### Admin

An admin account can access the admin dashboard and its protected endpoints to:

- View order, product, user, and revenue totals.
- Add, edit, and delete products.
- View orders and update order statuses.
- Browse the user directory.

## Tech stack

- **Frontend:** React 19, Create React App, React Router, Redux Toolkit
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens and bcryptjs
- **Payments:** Razorpay
- **Product images:** Multer uploads with Cloudinary
- **Email:** Nodemailer with Gmail SMTP settings

## Project structure

```text
.
├── backend/
│   ├── config/         # MongoDB and Cloudinary configuration
│   ├── controllers/    # Authentication, product, order, and payment logic
│   ├── middleware/     # JWT authentication and admin access checks
│   ├── model/          # Mongoose user, product, and order schemas
│   ├── routes/         # Express API routes
│   ├── utils/          # Shared utilities, including email delivery
│   ├── seed.js         # Creates demo users, products, and orders
│   └── index.js        # Express app entry point
└── frontend/
    ├── public/          # Static assets and browser metadata
    └── src/
        ├── admin/       # Dashboard and admin management pages
        ├── components/  # Shared navigation, footer, and product card
        ├── context/     # Authentication context
        ├── pages/       # Store, account, cart, and checkout screens
        ├── redux/       # Cart state
        └── styles/      # Shared and page-specific styles
```

## Run locally

### Requirements

- Node.js and npm
- A running MongoDB instance, local or hosted
- Optional third-party accounts/credentials for email, Cloudinary uploads, and Razorpay payments

### 1. Install dependencies

From the project root:

```bash
npm run install-all
```

### 2. Configure the backend

Create `backend/.env` and set the values for your environment:

```dotenv
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/Broochier
JWT_SECRET=replace_with_a_long_random_secret
FRONTEND_URL=http://localhost:3000

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

Keep real credentials in your local `.env`; do not commit them. `MONGO_URI` and `JWT_SECRET` are needed for the backend. Email credentials are used by registration and order email flows. Cloudinary credentials are needed to upload product images. Razorpay test credentials are needed to run the payment flow.

### 3. Add demo data (optional)

With MongoDB running and `backend/.env` configured, run from the project root:

```bash
npm run seed
```

The seed script creates or updates demo users, three sample products, and two sample orders. It is safe to rerun for these demo records.

**Demo admin**

- Email: `admin@broochier.test`
- Password: `Admin123!`

**Demo customer**

- Email: `customer@broochier.test`
- Password: `Customer123!`

### 4. Start the app

Run from the project root:

```bash
npm run dev
```

This starts the Express backend and React frontend together:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

The frontend development server proxies `/api` requests to the backend.

## Useful commands

Run these from the project root unless noted otherwise:

| Command                        | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| `npm run install-all`          | Install root, backend, and frontend dependencies |
| `npm run dev`                  | Start frontend and backend for local development |
| `npm run build`                | Build the frontend for production                |
| `npm run seed`                 | Populate MongoDB with demo data                  |
| `npm --prefix backend run dev` | Start only the backend with Nodemon              |
| `npm --prefix frontend start`  | Start only the frontend                          |
| `npm --prefix frontend test`   | Run the Create React App test runner             |

## API overview

The backend exposes these main API groups under `/api`:

| Path         | Purpose                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `/auth`      | Register, log in, and list users (admin-only for the user list)                                     |
| `/products`  | List and view products; create, update, or delete products (admin-only writes)                      |
| `/orders`    | Create customer orders, view customer orders, list all orders (admin-only), and update order status |
| `/payment`   | Create a Razorpay order and verify payment signatures                                               |
| `/analytics` | Return admin dashboard totals                                                                       |

Protected endpoints expect a JWT in the request header:

```http
Authorization: Bearer <token>
```

## Notes

- The cart is stored in browser local storage through the Redux cart slice.
- The backend serves the built frontend when `NODE_ENV=production`; configure the production environment variables and build the frontend before deploying.
- Email, Cloudinary, and payment integrations depend on valid credentials from their providers. Use test credentials for development.
- The frontend includes a payment fallback prompt when Razorpay order creation fails; this is intended for testing and is not a substitute for a production payment integration.
