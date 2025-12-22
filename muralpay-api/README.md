# MuralPay API

Backend API server for the MuralPay demo application. Built with Express.js and TypeScript.

## Prerequisites

- Node.js 18+
- npm
- A Mural API key (get one from [Mural Dashboard](https://dashboard.muralpay.com))

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example environment file and update with your credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Mural credentials:

   ```
   MURAL_API_KEY=your_api_key_here
   MURAL_ORGANIZATION_ID=your_organization_id_here
   MURAL_ACCOUNT_ID=your_account_id_here
   ```

## Running the Server

### Development

```bash
npm run dev
```

The server will start on `http://localhost:8001` with hot-reload enabled.

### Production

```bash
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/products` | List all products |
| GET | `/products/:id` | Get product by ID |
| POST | `/orders` | Create a new order |
| GET | `/orders` | List all orders |
| GET | `/orders/:id` | Get order by ID |
| PATCH | `/orders/:id` | Update order status |
| POST | `/accounts` | Create a Mural account |
| POST | `/payouts` | Create and execute a payout |
| GET | `/payouts` | List all payouts |
| GET | `/payouts/:id` | Get payout by ID |
| POST | `/webhooks/mural` | Handle Mural webhooks |
| POST | `/webhooks/simulate-payment` | Simulate payment (demo) |

## Project Structure

```
src/
├── index.ts           # Express app entry point
├── clients/
│   └── MuralClient.ts # Mural API client wrapper
├── routes/
│   ├── accounts.ts    # Account endpoints
│   ├── orders.ts      # Order endpoints
│   ├── payouts.ts     # Payout endpoints
│   ├── products.ts    # Product endpoints
│   └── webhooks.ts    # Webhook handlers
├── types/
│   └── index.ts       # TypeScript interfaces
└── data/
    └── products.json  # Demo product data
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MURAL_API_KEY` | Your Mural API key |
| `MURAL_ORGANIZATION_ID` | Your Mural organization ID |
| `MURAL_ACCOUNT_ID` | Your Mural account ID |
| `PORT` | Server port (default: 8001) |
