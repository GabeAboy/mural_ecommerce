import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import accountsRouter from "./routes/accounts";
import productsRouter from "./routes/products";
import transfersRouter from "./routes/transfers";

const app = express();

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "MuralPay Demo API" });
});

app.use("/accounts", accountsRouter);
app.use("/products", productsRouter);
app.use("/transfers", transfersRouter);

const port = Number(process.env.PORT) || 8001;
app.listen(port, () => {
  console.log(`muralpay-api2 listening on http://127.0.0.1:${port}`);
});
