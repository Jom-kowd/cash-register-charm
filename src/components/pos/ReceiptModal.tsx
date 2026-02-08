import { Sale } from '@/lib/types';
import { X, Printer } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
}

const ReceiptModal = ({ sale, onClose }: ReceiptModalProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-scale-in w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Sale Complete!</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt */}
        <div className="receipt-paper rounded-lg p-6 text-xs">
          <div className="mb-4 text-center">
            <h4 className="text-base font-bold">SwiftPOS</h4>
            <p className="opacity-60">123 Main Street</p>
            <p className="opacity-60">Receipt #{sale.id.slice(-6)}</p>
            <p className="opacity-60">{new Date(sale.timestamp).toLocaleString()}</p>
          </div>

          <div className="mb-3 border-t border-dashed border-gray-400 pt-3">
            {sale.items.map((item, i) => (
              <div key={i} className="mb-1.5 flex justify-between">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="opacity-60">{item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                </div>
                <span className="font-medium">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t border-dashed border-gray-400 pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-${sale.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${sale.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-dashed border-gray-400 pt-2">
              <span>Paid</span>
              <span>${sale.amountPaid.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Change</span>
              <span>${sale.change.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-4 text-center opacity-60">
            <p>Cashier: {sale.cashier}</p>
            <p className="mt-2">Thank you for your purchase!</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg pos-gradient-bg py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            New Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
