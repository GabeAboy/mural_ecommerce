import { Router, Request, Response } from "express";
import products from "../data/products.json";
import { Product } from "../types";

const router = Router();

// Add IDs to products
const productsWithIds: Product[] = products.map((p, index) => ({
  ...p,
  id: `product-${index + 1}`,
  type: p.type as "ski" | "snowboard",
}));

// GET /products - List all products
router.get("/", (_req: Request, res: Response) => {
  res.json(productsWithIds);
});

// GET /products/:id - Get single product
router.get("/:id", (req: Request, res: Response) => {
  const product = productsWithIds.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

export default router;
