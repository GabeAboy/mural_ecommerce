import {
  Account,
  CreateAccountParams,
  CreatePayoutRequest,
  MuralRequestOptions,
  PayoutRequest,
  BlockchainPayoutDetails,
} from "../types";

// Re-export types for backward compatibility
export type {
  Account,
  CreateAccountParams,
  CreatePayoutRequest,
  MuralRequestOptions,
  PayoutRequest,
  BlockchainPayoutDetails,
};

export interface TransferParams {
  sourceAccountId: string;
  recipientWalletAddress: string;
  blockchain: "ETHEREUM" | "POLYGON" | "BASE" | "CELO";
  tokenAmount: number;
  recipientName: string;
  memo?: string;
}

const MURAL_API_BASE_URL = "https://api.muralpay.com";

export class MuralClient {
  private apiKey?: string;
  private transferKey?: string;

  constructor(apiKey?: string, transferKey?: string) {
    this.apiKey = apiKey ?? process.env.MURAL_API_KEY;
    this.transferKey = transferKey ?? process.env.MURAL_TRANSFER_KEY;
    console.log(`[MuralClient] Initialized with API key: ${this.apiKey ? 'SET (' + this.apiKey.substring(0, 8) + '...)' : 'NOT SET'}`);
    console.log(`[MuralClient] Initialized with Transfer key: ${this.transferKey ? 'SET (' + this.transferKey.substring(0, 8) + '...)' : 'NOT SET'}`);
  }

  private async request<T>(
    method: string,
    path: string,
    options: MuralRequestOptions & { useTransferKey?: boolean },
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      accept: "application/json",
      "on-behalf-of": options.onBehalfOf,
    };

    console.log(`[MuralClient] ${method} ${path}`);
    console.log(`[MuralClient] on-behalf-of: ${options.onBehalfOf}`);
    
    // API Key is always required for Authorization
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
      console.log(`[MuralClient] API key: ${this.apiKey.substring(0, 8)}...`);
    }
    
    // Transfer API Key is additional header for execute/cancel/create operations
    if (options.useTransferKey && this.transferKey) {
      headers["transfer-api-key"] = this.transferKey;
      console.log(`[MuralClient] Transfer API key: ${this.transferKey.substring(0, 8)}...`);
    }

    if (body) {
      headers["content-type"] = "application/json";
      console.log(`[MuralClient] Request body:`, JSON.stringify(body, null, 2));
    }

    console.log(`[MuralClient] Request headers:`, JSON.stringify(headers, null, 2));

    const response = await fetch(`${MURAL_API_BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[MuralClient] ERROR ${response.status}:`, errorBody);
      throw new Error(`Mural API error ${response.status}: ${errorBody}`);
    }

    const responseData = await response.json();
    console.log(`[MuralClient] Response:`, JSON.stringify(responseData, null, 2));
    return responseData as T;
  }

  async createAccount(params: CreateAccountParams, options: MuralRequestOptions) {
    return this.request<Account>("POST", "/api/accounts", options, params);
  }

  // Payout methods
  async createPayout(params: CreatePayoutRequest, options: MuralRequestOptions & { useTransferKey?: boolean }) {
    console.log("[MuralClient] createPayout params:", JSON.stringify(params, null, 2));
    console.log("[MuralClient] createPayout options:", JSON.stringify(options, null, 2));
    return this.request<PayoutRequest>("POST", "/api/payouts/payout", options, params);
  }

  async executePayout(payoutId: string, options: MuralRequestOptions & { useTransferKey?: boolean }) {
    return this.request<PayoutRequest>("POST", `/api/payouts/payout/${payoutId}/execute`, options);
  }

  // Transfer helper - creates and executes a blockchain payout using MURAL_TRANSFER_KEY
  async transfer(params: TransferParams, options: MuralRequestOptions) {
    console.log(`[MuralClient] Transfer params:`, JSON.stringify(params, null, 2));
    const payoutRequest: CreatePayoutRequest = {
      sourceAccountId: params.sourceAccountId,
      memo: params.memo || `Transfer to ${params.recipientWalletAddress}`,
      payouts: [
        {
          amount: {
            tokenAmount: params.tokenAmount,
            tokenSymbol: "USDC",
          },
          payoutDetails: {
            type: "blockchain",
            walletDetails: {
              walletAddress: params.recipientWalletAddress,
              blockchain: params.blockchain,
            },
          },
          recipientInfo: {
            name: params.recipientName,
          },
        },
      ],
    };

    // Create payout (no transfer key needed)
    console.log("before createPayout");
    const payout = await this.createPayout(payoutRequest, options);
    console.log(`[MuralClient] Payout created:`, JSON.stringify(payout, null, 2));
    
    // Execute payout (transfer-api-key required)
    return this.executePayout(payout.id, { ...options, useTransferKey: true });
  }

}
