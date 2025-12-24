import React, { useState, useEffect } from 'react';
import ProductCatalog from './components/ProductCatalog';
import CheckoutPage from './components/CheckoutPage';
import PaymentReceipt from './components/PaymentReceipt';
import { Product, CartItem, TransferResult } from './types';
import { getProducts, createTransfer } from './api';

type View = 'catalog' | 'checkout' | 'receipt';

const ACCOUNT_ID = process.env.REACT_APP_ACCOUNT_ID || '';
const RECIPIENT_WALLET = process.env.REACT_APP_WALLET_ADDRESS || '';

function App() {
  const [view, setView] = useState<View>('catalog');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [transferResult, setTransferResult] = useState<TransferResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      setView('checkout');
    }
  };

  const handlePayWithMural = async (): Promise<TransferResult> => {
    const result = await createTransfer({
      sourceAccountId: ACCOUNT_ID,
      recipientWalletAddress: RECIPIENT_WALLET,
      recipientName: 'SkiEazy Store',
      blockchain: 'POLYGON',
      tokenAmount: cartTotal,
      memo: `Purchase of ${cart.length} item(s)`,
    });
    setTransferResult(result);
    setView('receipt');
    return result;
  };

  const handleContinueShopping = () => {
    setCart([]);
    setTransferResult(null);
    setView('catalog');
  };

  const handleBackToCatalog = () => {
    setView('catalog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  switch (view) {
    case 'checkout':
      return (
        <CheckoutPage
          cart={cart}
          cartTotal={cartTotal}
          onBack={handleBackToCatalog}
          onPayWithMural={handlePayWithMural}
        />
      );
    case 'receipt':
      return (
        <PaymentReceipt
          cart={cart}
          cartTotal={cartTotal}
          transferResult={transferResult}
          onContinueShopping={handleContinueShopping}
        />
      );
    default:
      return (
        <ProductCatalog
          products={products}
          cart={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
      );
  }
}

export default App;
