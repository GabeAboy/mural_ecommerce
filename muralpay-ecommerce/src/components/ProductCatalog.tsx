import React from 'react';
import { Product, CartItem } from '../types';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onCheckout: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
}) => {
  const cartTotal = cart.reduce((sum, item) => sum + item.priceUsd * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const skis = products.filter((p) => p.type === 'ski');
  const snowboards = products.filter((p) => p.type === 'snowboard');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SkiEazy Store</h1>
              <p className="text-sm text-gray-500">Premium ski & snowboard equipment</p>
            </div>
            <button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">{cartItemCount} items</span>
              <span className="bg-indigo-500 px-2 py-0.5 rounded text-sm">
                ${cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Skis Section */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⛷️</span> Skis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {skis.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getCartQuantity(product.id)}
                onAdd={() => onAddToCart(product)}
                onRemove={() => onRemoveFromCart(product.id)}
              />
            ))}
          </div>
        </section>

        {/* Snowboards Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏂</span> Snowboards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {snowboards.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={getCartQuantity(product.id)}
                onAdd={() => onAddToCart(product)}
                onRemove={() => onRemoveFromCart(product.id)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onAdd, onRemove }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <span className="text-6xl">{product.type === 'ski' ? '🎿' : '🏂'}</span>
      </div>
      <div className="p-4">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide">
          {product.brand}
        </p>
        <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">${product.priceUsd}</span>
          {quantity === 0 ? (
            <button
              onClick={onAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={onAdd}
                className="p-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition-colors"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
