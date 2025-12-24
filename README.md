# SkiEazy - Mural Payment Integration Demo

A merchant checkout application demonstrating the Mural API for accepting USDC payments on Polygon and converting to Colombian Pesos (COP) for bank withdrawal.


## Current Project Status

> **Note**: This project was developed within a 3-hour time constraint. Below is the current state and what remains incomplete.

### Completed Features

| Requirement | Status | Notes |
|-------------|--------|-------|
| Display product catalog | Complete | React frontend with ski/snowboard products, filtering by type |
| Select items and initiate checkout | Complete | Shopping cart with quantity controls, checkout flow |
| Accept USDC on Polygon | Partial | Transfer API integrated but authentication issues remain |
| Detect payment receipt | Not Complete | Webhook handler was built but removed during simplification |
| Display payment status | Partial | Receipt page exists but depends on successful transfer |
| Auto-convert to COP | Not Complete | Fiat payout types defined but not implemented |
| Merchant withdrawal dashboard | Not Complete | Not implemented |

### What Works

1. **Product Catalog** - Browse ski and snowboard equipment with category filters
2. **Shopping Cart** - Add/remove items, adjust quantities, view totals in USDC
3. **Checkout Flow** - Cart → Checkout page → Payment initiation
4. **Mural API Client** - Full TypeScript client with:
   - Account creation
   - Payout creation and execution
   - Proper header handling (`Authorization`, `on-behalf-of`, `transfer-api-key`)

### What's Not Working

1. **401 Unauthorized on Payout Creation** - Despite correct API key configuration, the Mural API returns 401 errors when creating payouts. This blocked the entire payment flow.

2. **COP Conversion** - The fiat payout types (COP bank details) were defined in the codebase but the automatic conversion flow was never completed due to the 401 blocker.

### Root Cause of Blockers

The primary blocker was **API authentication**. The Mural API requires:
- `Authorization: Bearer <API_KEY>` for all requests
- `transfer-api-key: <TRANSFER_API_KEY>` header for execute/cancel operations
- `on-behalf-of: <ORGANIZATION_ID>` header

Despite implementing all headers correctly (verified via console logs), the API consistently returned 401 Unauthorized. Possible causes:
- API key permissions not configured for payout operations
- Organization ID mismatch
- Sandbox environment restrictions
