import { Router, Request, Response } from "express";
import { MuralClient } from "../clients/MuralClient";

const router = Router();
const muralClient = new MuralClient();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const onBehalfOf = req.headers["on-behalf-of"] as string;

    if (!name) {
      res.status(400).json({ error: "name is required" });
      return;
    }

    if (!onBehalfOf) {
      res.status(400).json({ error: "on-behalf-of header is required" });
      return;
    }

    const account = await muralClient.createAccount(
      { name, description },
      { onBehalfOf }
    );

    res.json(account);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

export default router;
