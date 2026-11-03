import React, { useState } from 'react';
import { CartItem, PastOrder } from '../types';
import { X, CheckCircle2, ShieldCheck, CreditCard, Banknote, ArrowLeft, ArrowRight, Sparkles, Smartphone } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: string;
  onClearCart: () => void;
  onOrderCompleted?: (order: PastOrder) => void;
  onOpenAccount?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onClearCart,
  onOrderCompleted,
  onOpenAccount,
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  
  // Shipping Form State (Indian format)
  const [fullName, setFullName] = useState('Ananya Sharma');
  const [email, setEmail] = useState('ananya.sharma@botanicals.in');
  const [phone, setPhone] = useState('+91 98201 54321');
  const [address, setAddress] = useState('Flat 402, Lotus Greens, Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [stateName, setStateName] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');
  const [shippingError, setShippingError] = useState('');

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');

  // Confirmation details
  const [orderId, setOrderId] = useState('');
  const [earnedPoints, setEarnedPoints] = useState(0);

  if (!isOpen) return null;

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
  const shippingFee = discountedSubtotal >= 999 || items.length === 0 ? 0 : 99;
  const estimatedTax = discountedSubtotal * 0.05;
  const grandTotal = Math.round(discountedSubtotal + shippingFee + estimatedTax);

  const handleValidateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      setShippingError('Please fill in all required shipping fields.');
      return;
    }
    setShippingError('');
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const generatedId = `AURA-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    const pts = Math.round(grandTotal / 10); // 1 point per 10 Rs spent
    setOrderId(generatedId);
    setEarnedPoints(pts);

    const itemsSummary = items
      .map((item) => `${item.product.name} (x${item.quantity})`)
      .join(', ');

    const newOrder: PastOrder = {
      id: generatedId,
      date: 'Today',
      itemsSummary: itemsSummary || 'Botanical Apothecary Remedy',
      total: grandTotal,
      pointsEarned: pts,
      status: 'Processing',
    };

    onOrderCompleted?.(newOrder);
    setStep('confirmation');
    onClearCart();
  };

  const handleFinish = () => {
    onClose();
    setStep('shipping');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231E1B]/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-[#F4EFE7] border-b border-[#E8DFD5] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#A85A3D]">
              Secure Apothecary Checkout (India)
            </span>
            <h2 id="checkout-modal-title" className="text-xl font-serif text-[#231E1B]">
              {step === 'shipping' && '1. Shipping & Delivery Address (Pan-India)'}
              {step === 'payment' && '2. Payment Selection (UPI / Cards / COD)'}
              {step === 'confirmation' && 'Order Confirmed'}
            </h2>
          </div>
          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              aria-label="Close checkout"
              className="p-2 text-[#7A7067] hover:text-[#231E1B] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 sm:p-8">
          
          {/* Step 1: Shipping Form */}
          {step === 'shipping' && (
            <form onSubmit={handleValidateShipping} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231E1B]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231E1B]">Email for Tracking & Points *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya@botanicals.in"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231E1B]">Street Address & Flat / House No. *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Lotus Greens, 100ft Road"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231E1B]">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231E1B]">State *</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#231E1B]">Pincode *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560038"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#231E1B]">Mobile Phone for Delivery SMS & OTP *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 54321"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#DCCFBF] rounded-md text-[#231E1B] focus:outline-none focus:border-[#BA6E50]"
                />
              </div>

              {shippingError && (
                <div className="text-xs text-[#A85A3D] font-medium">{shippingError}</div>
              )}

              {/* Order total preview */}
              <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#7A7067]">Total Amount Due:</span>
                  <div className="text-lg font-mono font-bold text-[#231E1B]">₹{grandTotal.toLocaleString()}</div>
                  <div className="text-[11px] text-[#65745E] flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Earns ~{Math.round(grandTotal / 10)} Loyalty Seed Points</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Method */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Delivery recipient review */}
              <div className="p-3.5 bg-[#FAF4F0] rounded-xl border border-[#EAD3C6] flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#231E1B]">Delivering to:</span>{' '}
                  <span className="text-[#5C524A]">{fullName}, {address}, {city}, {stateName} - {pincode}</span>
                </div>
                <button
                  onClick={() => setStep('shipping')}
                  className="text-[#88452D] hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Method choice (UPI, Cards, COD) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#BA6E50] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#231E1B]">Instant UPI</div>
                    <div className="text-[10px] text-[#7A7067]">GPay / PhonePe / Paytm</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-[#BA6E50] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#231E1B]">Cards / RuPay</div>
                    <div className="text-[10px] text-[#7A7067]">Visa, Mastercard, RuPay</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-white hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-[#65745E] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-[#231E1B]">Cash on Delivery</div>
                    <div className="text-[10px] text-[#7A7067]">Pay upon doorstep receipt</div>
                  </div>
                </button>
              </div>

              {/* UPI Form */}
              {paymentMethod === 'upi' && (
                <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#231E1B]">
                    <span>Enter your UPI ID (VPA)</span>
                    <span className="text-[10px] text-[#65745E]">Instant Zero-Fee Transfer</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DCCFBF] rounded-md font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-[#7A7067]">
                    A payment request will be sent to your UPI app (Google Pay, PhonePe, Paytm, or BHIM).
                  </p>
                </div>
              )}

              {/* Card Form simulation */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#231E1B]">
                    <span>Card Information</span>
                    <span className="text-[10px] text-[#65745E]">RBI Compliant Tokenization</span>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card number"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DCCFBF] rounded-md font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DCCFBF] rounded-md font-mono"
                    />
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="CVV"
                      className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#DCCFBF] rounded-md font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-[#E8DFD5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#7A7067] hover:text-[#231E1B] cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to address</span>
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order · ₹{grandTotal.toLocaleString()}</span>
                </button>
              </div>

            </div>
          )}

          {/* Step 3: Order Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#E9ECE6] text-[#65745E] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-[#A85A3D]">
                  Order Placed Successfully · Dispatched from Bengaluru Apothecary
                </span>
                <h3 className="text-3xl font-serif text-[#231E1B]">
                  Dhanyavaad, {fullName || 'Valued Customer'}!
                </h3>
                <p className="text-xs text-[#5C524A] max-w-md mx-auto">
                  Your order <span className="font-mono font-bold text-[#231E1B]">#{orderId}</span> is confirmed and will be delivered via Blue Dart Express.
                </p>
              </div>

              {/* Points Earned Celebration Box */}
              <div className="p-4 bg-gradient-to-r from-[#FAF4F0] to-[#F3EAE4] border border-[#EAD3C6] rounded-xl max-w-md mx-auto flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-full bg-[#BA6E50] text-[#FAF7F2] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#231E1B] block">
                      +{earnedPoints} Botanical Seed Points Earned!
                    </span>
                    <span className="text-[#88452D] text-[11px]">
                      Added to {fullName}&apos;s Loyalty Account
                    </span>
                  </div>
                </div>

                {onOpenAccount && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAccount();
                    }}
                    className="px-3 py-1.5 text-[11px] font-semibold text-[#BA6E50] hover:text-[#88452D] bg-white border border-[#D8B19C] rounded cursor-pointer whitespace-nowrap"
                  >
                    View Account
                  </button>
                )}
              </div>

              {/* Receipt Summary Box */}
              <div className="bg-white p-5 rounded-xl border border-[#E8DFD5] text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-[#E8DFD5]">
                  <span className="text-[#7A7067]">Order Confirmation:</span>
                  <span className="font-mono font-semibold text-[#231E1B]">#{orderId}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8DFD5]">
                  <span className="text-[#7A7067]">Estimated Delivery:</span>
                  <span className="font-medium text-[#231E1B]">In 2–4 business days across India</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#E8DFD5]">
                  <span className="text-[#7A7067]">Payment Mode:</span>
                  <span className="font-medium text-[#231E1B]">
                    {paymentMethod === 'upi' ? 'UPI Transfer' : paymentMethod === 'card' ? 'Online Card' : 'Cash on Delivery (COD)'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-semibold text-[#231E1B]">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleFinish}
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer shadow-sm"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
