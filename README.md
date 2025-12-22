# SkiEazy - Mural Payment Integration Demo

A complete e-commerce demo application showcasing the Mural API for accepting USDC payments and automatically withdrawing to Colombian Pesos (COP).

## Workflow Overview

This implementation covers the complete payment and withdrawal workflow:

### 1. Product Checkout & Payment Collection

**Display Product Catalog**
- React frontend displays a product catalog with ski and snowboard equipment
- Products are fetched from the Express backend (`GET /products`)
- Customers can filter by product type (Skis, Snowboards, All)

**Shopping Cart & Checkout**
- Customers add items to cart with quantity controls
- Slide-out cart shows item summary and total in USDC
- Checkout creates an order in the backend (`POST /orders`)

**Payment via USDC on Polygon**
- Order creation returns a Mural wallet address for payment
- Customer sends USDC to the provided wallet address on Polygon network
- Payment page displays wallet address and monitors for payment confirmation

### 2. Payment Receipt & Verification

**Detect Payment Receipt**
- Mural sends webhook events to `POST /webhooks/mural`
- Backend listens for `mural_account_balance_activity` events with `DEPOSIT` type
- When payment is detected, order status updates to `paid`

**Display Payment Status**
- Frontend polls order status (`GET /orders/:id`)
- Payment confirmation shown to customer with order details
- Receipt page displays transaction summary

### 3. Automatic Fund Conversion & Withdrawal

**Auto-Initiate COP Payout**
- When payment webhook is received, backend automatically creates a payout request
- Payout is sent to a pre-configured Colombian bank account
- Uses Mural's `POST /payouts/payout-request` endpoint

**Merchant Withdrawal Status**
- Merchant dashboard shows all payout history (`GET /payouts`)
- Displays payout status: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`
- Shows amount, recipient, and timestamp for each withdrawal

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  React Frontend │────▶│  Express Backend │────▶│    Mural API    │
│  (Port 3000)    │     │  (Port 8001)     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  Mural Webhooks │
                        │  (Payment Events)│
                        └─────────────────┘
```

---

## Project Structure

```
muralPay/
├── muralpay-react/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductCatalog.js   # Product listing with filters
│   │   │   ├── Cart.js             # Shopping cart component
│   │   │   ├── Checkout.js         # Order creation
│   │   │   ├── PaymentPage.js      # Payment instructions & status
│   │   │   ├── PaymentReceipt.js   # Order confirmation
│   │   │   └── WithdrawalStatus.js # Merchant payout dashboard
│   │   ├── api.js                  # API client
│   │   └── App.js                  # Main app with routing
│   └── package.json
│
├── muralpay-api2/           # Express Backend
│   ├── src/
│   │   ├── clients/
│   │   │   └── MuralClient.ts      # Mural API wrapper
│   │   ├── routes/
│   │   │   ├── products.ts         # Product catalog
│   │   │   ├── orders.ts           # Order management
│   │   │   ├── payouts.ts          # Payout management
│   │   │   └── webhooks.ts         # Mural webhook handler
│   │   ├── data/
│   │   │   └── products.json       # Product data
│   │   └── index.ts                # Express server
│   └── package.json
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Mural API Key (from Mural Dashboard)
- Mural Organization ID
- Mural Account ID (with USDC wallet on Polygon)

### 1. Backend Setup

```bash
cd muralpay-api2

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# MURAL_API_KEY=your_api_key
# MURAL_ORGANIZATION_ID=your_org_id
# MURAL_ACCOUNT_ID=your_account_id

# Start the server
npm run dev
```

Backend runs on http://localhost:8001

### 2. Frontend Setup

```bash
cd muralpay-react

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend runs on http://localhost:3000

---

## API Endpoints

### Products
- `GET /products` - List all products

### Orders
- `POST /orders` - Create a new order
- `GET /orders/:id` - Get order status
- `GET /orders` - List all orders

### Payouts
- `GET /payouts` - List all payouts
- `GET /payouts/:id` - Get payout status
- `POST /payouts` - Create manual payout

### Webhooks
- `POST /webhooks/mural` - Receive Mural webhook events
- `POST /webhooks/simulate-payment` - Simulate payment (demo only)

---

## Mural API Integration

### Key Endpoints Used

| Feature | Mural Endpoint |
|---------|----------------|
| Get wallet address | `GET /accounts/{id}` |
| Create payout | `POST /payouts/payout-request` |
| List transactions | `GET /accounts/{id}/transactions` |
| Webhook events | `mural_account_balance_activity` |

### Webhook Events

The backend listens for these Mural webhook events:

1. **`mural_account_balance_activity`** - Triggered when funds are deposited
   - Used to detect customer payments
   - Automatically triggers COP payout

2. **`payout_request`** - Triggered when payout status changes
   - Used to update merchant on withdrawal status

---

## Demo Flow

1. **Browse Products** - View ski and snowboard catalog
2. **Add to Cart** - Select items and quantities
3. **Checkout** - Create order and get payment instructions
4. **Pay with USDC** - Send USDC to the provided Polygon wallet
5. **Payment Confirmed** - Webhook detects payment, updates order
6. **Auto Withdrawal** - System automatically initiates COP payout
7. **View Status** - Merchant sees withdrawal status in dashboard

---

## Configuration

### Environment Variables

**Backend (.env)**
```
MURAL_API_KEY=your_mural_api_key
MURAL_ORGANIZATION_ID=your_organization_id
MURAL_ACCOUNT_ID=your_account_id
PORT=8001
```

**Frontend (.env)**
```
REACT_APP_ORGANIZATION_ID=your_organization_id
REACT_APP_ACCOUNT_ID=your_account_id
```

---

## Technologies Used

- **Frontend**: React 19, Tailwind CSS
- **Backend**: Express.js, TypeScript
- **Payment**: Mural API, USDC on Polygon
- **Payout**: Colombian Pesos (COP) bank transfer

---

## License

MIT
