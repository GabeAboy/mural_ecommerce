// Account types
export interface CreateAccountParams {
  name: string;
  description?: string;
}

export interface TokenAmount {
  tokenAmount: number;
  tokenSymbol: string;
}

export interface Account {
  id: string;
  name: string;
  status: string;
  accountDetails: {
    balances: { tokenAmount: number; tokenSymbol: string }[];
    walletDetails: {
      walletAddress: string;
      blockchain: string;
    };
  };
}

// Payout types - Blockchain
export interface BlockchainPayoutDetails {
  type: "blockchain";
  walletDetails: {
    walletAddress: string;
    blockchain: "ETHEREUM" | "POLYGON" | "BASE" | "CELO";
  };
}

export interface PayoutRecipient {
  amount: TokenAmount;
  payoutDetails: BlockchainPayoutDetails;
  recipientInfo: { name: string };
}

export interface CreatePayoutRequest {
  sourceAccountId: string;
  memo?: string;
  payouts: PayoutRecipient[];
}

export interface PayoutRequest {
  id: string;
  createdAt: string;
  updatedAt: string;
  sourceAccountId: string;
  status: string;
  memo?: string;
  payouts: Array<{
    id: string;
    amount: TokenAmount;
    details: {
      type: string;
      fiatPayoutStatus?: { type: string };
      fiatAmount?: { fiatAmount: number; fiatCurrencyCode: string };
      exchangeRate?: number;
    };
  }>;
}

// Request options
export interface MuralRequestOptions {
  onBehalfOf: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
  type: "ski" | "snowboard";
}
