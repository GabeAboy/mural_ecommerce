import React from 'react';
import { CartItem, TransferResult } from '../types';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface PaymentReceiptProps {
  cart: CartItem[];
  cartTotal: number;
  transferResult: TransferResult | null;
  onContinueShopping: () => void;
}

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  cart,
  cartTotal,
  transferResult,
  onContinueShopping,
}) => {
  const payoutId = transferResult?.payout?.id || '';
  const payoutStatus = transferResult?.payout?.status || 'Unknown';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Payment Initiated!</h2>
            <p className="text-green-100 mt-1">Your transfer has been successfully submitted</p>
          </div>

          <div className="p-6">
            {/* Order Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.priceUsd * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-green-600">${cartTotal.toFixed(2)} USDC</span>
              </div>
            </div>

            {/* Payout Info */}
            {transferResult && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payout ID:</span>
                    <code className="font-mono text-gray-800">{payoutId.slice(0, 8)}...</code>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-indigo-600 uppercase">{payoutStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Info */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-indigo-900">USDC Transfer on Polygon</p>
                  <p className="text-sm text-indigo-700 mt-1">
                    Your payment has been processed via Mural's blockchain transfer system.
                  </p>
                </div>
              </div>
            </div>

            {/* Polygonscan Link */}
            {payoutId && (
              <a
                href={`https://polygonscan.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mb-6"
              >
                View on Polygonscan
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Actions */}
            <button
              onClick={onContinueShopping}
              className="w-full py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
