import { Router, Request, Response } from "express";
import { MuralClient, TransferParams } from "../clients/MuralClient";

const router = Router();
const muralClient = new MuralClient();

// POST /transfers - Send USDC from source account to recipient wallet
router.post("/", async (req: Request, res: Response) => {
  try {
    const onBehalfOf = req.headers["on-behalf-of"] as string;

    if (!onBehalfOf) {
      res.status(400).json({ error: "on-behalf-of header is required" });
      return;
    }

    const {
      sourceAccountId,
      recipientWalletAddress,
      recipientName,
      blockchain,
      tokenAmount,
      memo,
    } = req.body as {
      sourceAccountId: string;
      recipientWalletAddress: string;
      recipientName?: string;
      blockchain?: "ETHEREUM" | "POLYGON" | "BASE" | "CELO";
      tokenAmount: number;
      memo?: string;
    };

    if (!sourceAccountId) {
      res.status(400).json({ error: "sourceAccountId is required" });
      return;
    }

    if (!recipientWalletAddress) {
      res.status(400).json({ error: "recipientWalletAddress is required" });
      return;
    }

    if (!tokenAmount || tokenAmount <= 0) {
      res.status(400).json({ error: "tokenAmount must be a positive number" });
      return;
    }

    const transferParams: TransferParams = {
      sourceAccountId,
      recipientWalletAddress,
      blockchain: blockchain || "POLYGON",
      tokenAmount,
      recipientName: recipientName || "Recipient",
      memo,
    };

    console.log(`[Transfer] Initiating transfer:`, transferParams);

    const payout = await muralClient.transfer(transferParams, { onBehalfOf });

    console.log(`[Transfer] Transfer completed, payout ID: ${payout.id}`);

    res.status(201).json({
      message: "Transfer initiated successfully",
      payout,
    });
  } catch (err: unknown) {
    console.error("[Transfer] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
