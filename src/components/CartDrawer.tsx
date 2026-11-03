import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 999;

  const rawSubtotal = items.reduce((acc, item) => {
    const itemPrice = item.isSubscription
      ? item.product.price * (1 - item.product.subscriptionDiscount)
      : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const promoDiscountPercent = appliedPromo === 'AURA15' ? 0.15 : appliedPromo === 'ORGANIC10' ? 0.1 : 0;
  const fixedDiscountAmount = appliedPromo === 'POINTS50' ? 50 : appliedPromo === 'POINTS100' ? 100 : 0;
  const promoDiscountAmount = (rawSubtotal * promoDiscountPercent) + fixedDiscountAmount;
  const discountedSubtotal = Math.max(0, rawSubtotal - promoDiscountAmount);

  const isFreeShipping = discountedSubtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const estimatedTax = discountedSubtotal * 0.05; // 5% GST
  const grandTotal = discountedSubtotal + shippingFee + estimatedTax;

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal);
  const freeShippingProgress = Math.min(100, (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid code. Try "AURA15", "ORGANIC10", or loyalty reward codes');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#231E1B]/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DFD5] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD5] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 id="cart-drawer-title" className="text-xl font-serif text-[#231E1B]">
                Your Botanical Bag
              </h2>
              <span className="font-mono text-xs tabular-nums text-[#8A7E73] bg-[#EAE2D5] px-2 py-0.5 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close bag"
              className="p-2 text-[#7A7067] hover:text-[#231E1B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-[#F4EFE7] border-b border-[#E8DFD5] space-y-1.5">
            <div className="text-xs text-[#5C524A] flex items-center justify-between">
              {isFreeShipping ? (
                <span className="font-medium text-[#65745E] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Complimentary express shipping across India unlocked!</span>
                </span>
              ) : (
                <span>
                  Add <span className="font-mono font-semibold text-[#BA6E50]">₹{Math.round(amountToFreeShipping).toLocaleString()}</span> more for Free Shipping
                </span>
              )}
            </div>
            <div className="h-1.5 w-full bg-[#E8DFD5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#BA6E50] transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                <span className="text-4xl text-[#D8B19C]">🌿</span>
                <h3 className="text-lg font-serif text-[#231E1B]">Your bag is currently empty</h3>
                <p className="text-xs text-[#7A7067] max-w-xs">
                  Discover our organic teas, adaptogen superfoods, and artisanal tinctures to begin your ritual.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer"
                >
                  Explore Apothecary
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemUnitPrice = item.isSubscription
                  ? item.product.price * (1 - item.product.subscriptionDiscount)
                  : item.product.price;
                const itemLineTotal = Math.round(itemUnitPrice * item.quantity);

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-[#E8DFD5] flex gap-3.5 relative"
                  >
                    {/* Thumbnail */}
                    <div className="w-18 h-18 rounded-lg overflow-hidden bg-[#F3EAE4] shrink-0 border border-[#E8DFD5]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5 pr-6">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#A85A3D] uppercase font-semibold">
                          <span>{item.product.categoryLabel}</span>
                          {item.isSubscription && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[#65745E] flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                Subscribed (Every {item.cadenceWeeks} wks)
                              </span>
                            </>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-serif font-semibold text-[#231E1B] leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] font-mono text-[#7A7067]">
                          ₹{Math.round(itemUnitPrice).toLocaleString()} each
                        </div>
                      </div>

                      {/* Quantity Stepper & Line Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#DCCFBF] rounded bg-[#FAF7F2]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#7A7067] hover:text-[#231E1B] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono tabular-nums font-semibold text-[#231E1B]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#7A7067] hover:text-[#231E1B] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-[#231E1B] tabular-nums">
                          ₹{itemLineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remove Item Button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                      className="absolute top-3 right-3 text-[#B3A69A] hover:text-[#BA6E50] cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Calculation & Actions */}
          {items.length > 0 && (
            <div className="p-5 bg-[#F4EFE7] border-t border-[#E8DFD5] space-y-4">
              
              {/* Promo Code Form */}
              <div className="space-y-1">
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2 bg-[#E9ECE6] text-[#505D4A] rounded text-xs border border-[#CED5C7]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Coupon &quot;{appliedPromo}&quot; Applied (-{(promoDiscountPercent * 100)}%)</span>
                    </div>
                    <button
                      onClick={onRemovePromo}
                      className="text-xs text-[#88452D] hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePromoSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. AURA15)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DCCFBF] rounded text-[#231E1B] placeholder-[#9E9287] uppercase focus:outline-none focus:border-[#BA6E50]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-[#231E1B] text-[#FAF7F2] hover:bg-[#3E3530] rounded cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <div className="text-[11px] text-[#A85A3D]">{promoError}</div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#5C524A] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{Math.round(rawSubtotal).toLocaleString()}</span>
                </div>
                {promoDiscountAmount > 0 && (
                  <div className="flex justify-between text-[#65745E]">
                    <span>Promotional Discount</span>
                    <span className="font-mono tabular-nums">-₹{Math.round(promoDiscountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Pan-India Shipping</span>
                  <span className="font-mono tabular-nums">
                    {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-mono tabular-nums">₹{Math.round(estimatedTax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-[#231E1B] pt-2 border-t border-[#E8DFD5]">
                  <span>Total</span>
                  <span className="font-mono tabular-nums text-base">₹{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-md text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[10px] text-[#7A7067] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#65745E]" />
                <span>30-Day Happiness Guarantee · Encrypted 256-bit Checkout</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
