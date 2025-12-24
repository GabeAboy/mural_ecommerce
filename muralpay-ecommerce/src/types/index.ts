export interface Product {
  id: string;
  name: string;
  brand: string;
  priceUsd: number;
  type: 'ski' | 'snowboard';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface TransferResult {
  message: string;
  payout: {
    id: string;
    createdAt: string;
    updatedAt: string;
    sourceAccountId: string;
    status: string;
    memo?: string;
    payouts: Array<{
      id: string;
      amount: {
        tokenAmount: number;
        tokenSymbol: string;
      };
      details: {
        type: string;
        walletAddress?: string;
        blockchain?: string;
        status?: string;
      };
    }>;
  };
}
