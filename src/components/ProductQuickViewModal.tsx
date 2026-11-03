import React, { useState } from 'react';
import { Product, SubscriptionCadence } from '../types';
import { 
  X, 
  Check, 
  Clock, 
  MapPin, 
  Sparkles, 
  Plus, 
  Minus, 
  Coffee, 
  Heart, 
  Eye, 
  ShieldCheck, 
  Thermometer, 
  Droplet 
} from 'lucide-react';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, isSubscription: boolean, cadence: SubscriptionCadence, quantity: number) => void;
  onOpenGlossaryForBotanical?: (botanicalName: string) => void;
  onOpenDosageConsultation?: (product: Product) => void;
  onAskNafisha?: (question: string) => void;
  likesCount?: number;
  walkthroughsCount?: number;
  isLiked?: boolean;
  onLikeToggle?: (productId: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenGlossaryForBotanical,
  onOpenDosageConsultation,
  onAskNafisha,
  likesCount = 0,
  walkthroughsCount = 0,
  isLiked = false,
  onLikeToggle,
}) => {
  const [isSubscription, setIsSubscription] = useState(false);
  const [cadence, setCadence] = useState<SubscriptionCadence>(4);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!product) return null;

  const currentPrice = isSubscription
    ? (product.price * (1 - product.subscriptionDiscount))
    : product.price;

  const subtotal = (currentPrice * quantity).toFixed(2);

  const handleAdd = () => {
    onAddToCart(product, isSubscription, cadence, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const ritual = product.chronoRitual;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#231E1B]/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#FAF7F2]/80 hover:bg-white text-[#231E1B] transition-colors cursor-pointer border border-[#E8DFD5]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Image, Origin & Market Traction Metrics */}
        <div className="md:w-1/2 bg-[#F3EAE4] relative p-6 flex flex-col justify-between shrink-0">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8DFD5]">
            {!imageError ? (
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                <span className="text-2xl font-serif text-[#BA6E50]">{product.name}</span>
              </div>
            )}

            {/* Like & Walkthrough overlay */}
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={() => onLikeToggle && onLikeToggle(product.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border ${
                  isLiked
                    ? 'bg-[#BA6E50] text-white border-[#BA6E50]'
                    : 'bg-[#FAF7F2]/90 hover:bg-white text-[#5C524A] border-[#E8DFD5]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-white' : 'text-[#BA6E50]'}`} />
                <span className="font-mono text-[11px]">{likesCount}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#7A7067]">
              <div className="flex items-center gap-1.5 text-[#88452D]">
                <MapPin className="w-3.5 h-3.5" />
                <span>{product.origin}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#5C524A]">
                <Eye className="w-3 h-3 text-[#BA6E50]" />
                <span>{walkthroughsCount.toLocaleString()} Walkthroughs</span>
              </div>
            </div>
            <div className="text-[11px] text-[#7A7067]">
              Harvest: {product.harvestMethod}
            </div>
          </div>
        </div>

        {/* Right Column: Scrollable Details, Chrono-Ritual & Purchase Module */}
        <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Header Metadata */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#A85A3D]">
                {product.isHimalayanOrganicsRange ? (
                  <span className="px-2 py-0.5 rounded bg-[#EAEFE8] border border-[#CAD8C5] text-[#3A4936]">
                    🌿 Himalayan Organics Collection
                  </span>
                ) : (
                  <span>{product.categoryLabel}</span>
                )}
                <span aria-hidden="true">·</span>
                <span>{product.volumeOrWeight}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#65745E] font-medium lowercase">Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%</span>
                  </>
                )}
              </div>

              {/* Tangible Benefit Callout Banner */}
              {product.primaryBenefit && (
                <div className="bg-[#FAF0E6] text-[#88452D] px-3 py-1.5 rounded-lg border border-[#E8DFD5] text-xs font-semibold flex items-center gap-1.5 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#BA6E50] shrink-0" />
                  <span>{product.primaryBenefit}</span>
                </div>
              )}

              <h2 id="quickview-title" className="text-2xl sm:text-3xl font-serif text-[#231E1B] leading-tight pt-1">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#88452D] font-medium">
                {product.subtitle}
              </p>

              {/* Key Benefit Outcome Bullets */}
              {product.benefitBullets && product.benefitBullets.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-[#E8DFD5] space-y-1.5 mt-2">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#7A7067] block">
                    Proven Health Outcomes:
                  </span>
                  {product.benefitBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#231E1B]">
                      <Check className="w-3.5 h-3.5 text-[#505D4A] shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#5C524A] leading-relaxed">
              {product.description}
            </p>

            {/* BEST TIME TO USE & LIQUID PREPARATION GUIDE */}
            {ritual && (
              <div className="p-4 bg-[#FAF4F0] rounded-xl border-2 border-[#EAD3C6] space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAD3C6] pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#88452D]">
                    <Clock className="w-4 h-4 text-[#BA6E50]" />
                    <span>Best Time To Use & Preparation</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-[#BA6E50] text-white px-2 py-0.5 rounded font-bold">
                    {ritual.timeCategory}
                  </span>
                </div>

                {/* Specifics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="text-[10px] uppercase font-bold text-[#7A7067] block">Ideal Time Window</span>
                    <span className="font-semibold text-[#231E1B] block mt-0.5">{ritual.bestTimeOfDay}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="text-[10px] uppercase font-bold text-[#7A7067] block">Calibrated Dose</span>
                    <span className="font-semibold text-[#88452D] block mt-0.5">{ritual.exactDosage}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="text-[10px] uppercase font-bold text-[#7A7067] block">Liquid Vehicle (Anupana)</span>
                    <span className="font-medium text-[#231E1B] block mt-0.5">{ritual.liquidMedium}</span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-lg border border-[#E8DFD5]">
                    <span className="text-[10px] uppercase font-bold text-[#7A7067] block">Liquid Amount & Temp</span>
                    <span className="font-medium text-[#65745E] block mt-0.5">{ritual.liquidAmount} @ {ritual.liquidTemperature}</span>
                  </div>
                </div>

                {/* Preparation step summary */}
                <div className="text-xs text-[#5C524A] bg-white/60 p-2.5 rounded-lg border border-[#EAD3C6] leading-relaxed">
                  <span className="font-semibold text-[#231E1B]">Preparation: </span>
                  {ritual.preparationMethod}
                </div>

                {/* Synergy Tip */}
                <div className="text-[11px] text-[#88452D] italic leading-relaxed">
                  💡 <strong>Synergy: </strong>{ritual.synergyBooster}
                </div>

                {/* Personalized Consultation & Nafisha CTA buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {onOpenDosageConsultation && (
                    <button
                      onClick={() => {
                        onOpenDosageConsultation(product);
                        onClose();
                      }}
                      className="py-2 px-3 bg-[#88452D] hover:bg-[#6D3623] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Timing Consultation</span>
                    </button>
                  )}
                  {onAskNafisha && (
                    <button
                      type="button"
                      onClick={() => {
                        onAskNafisha(`How should I take ${product.name} and what are its key Ayurvedic benefits?`);
                        onClose();
                      }}
                      className="py-2 px-3 bg-[#3F4F38] hover:bg-[#2C3827] text-[#F9F6F0] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ask Nafisha (AI Guide)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tasting Notes */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#231E1B] uppercase tracking-wider">Aroma & Tasting Profile:</span>
              <div className="flex flex-wrap gap-2">
                {product.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 bg-[#F4EFE7] text-[#65745E] rounded-md border border-[#E2D5C8]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Botanicals */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#231E1B] uppercase tracking-wider">Key Botanicals:</span>
              <div className="flex flex-wrap gap-1.5">
                {product.keyBotanicals.map((bot, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenGlossaryForBotanical && onOpenGlossaryForBotanical(bot)}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-[#FAF4F0] text-[#88452D] rounded-md border border-[#E8DFD5] hover:border-[#BA6E50] transition-colors cursor-pointer"
                  >
                    {bot} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Module */}
          <div className="pt-6 border-t border-[#E8DFD5] space-y-4">
            
            {/* Purchase Type Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#231E1B] uppercase tracking-wider">Select Purchase Type:</span>
              <div className="grid grid-cols-2 gap-3">
                {/* One-time option */}
                <button
                  type="button"
                  onClick={() => setIsSubscription(false)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    !isSubscription
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-white hover:border-[#D8B19C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#231E1B]">One-Time Order</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-mono font-semibold text-[#231E1B]">₹{product.price}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-[10px] font-mono line-through text-[#8A7E73]">₹{product.mrp}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#7A7067] block mt-0.5">Standard single apothecary order</span>
                </button>

                {/* Subscription option */}
                <button
                  type="button"
                  onClick={() => setIsSubscription(true)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isSubscription
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-white hover:border-[#D8B19C]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#88452D]">Auto-Replenish</span>
                    <span className="text-xs font-mono font-semibold text-[#88452D]">
                      ₹{Math.round(product.price * (1 - product.subscriptionDiscount))}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#65745E] font-medium block mt-0.5">Save 15% · Pause anytime</span>
                </button>
              </div>
            </div>

            {/* Cadence Selector if Subscription */}
            {isSubscription && (
              <div className="p-3 bg-[#F4EFE7] rounded-lg border border-[#E2D5C8] space-y-2">
                <span className="text-xs font-medium text-[#231E1B] block">Delivery Frequency:</span>
                <div className="flex items-center gap-2">
                  {[4, 6, 8].map((weeks) => (
                    <button
                      key={weeks}
                      type="button"
                      onClick={() => setCadence(weeks as SubscriptionCadence)}
                      className={`flex-1 py-1.5 text-xs rounded border transition-all cursor-pointer ${
                        cadence === weeks
                          ? 'bg-[#BA6E50] text-white border-[#BA6E50] font-semibold'
                          : 'bg-white text-[#5C524A] border-[#E8DFD5] hover:border-[#BA6E50]'
                      }`}
                    >
                      Every {weeks} Weeks
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Bag Row */}
            <div className="flex items-center gap-3">
              {/* Quantity Picker */}
              <div className="flex items-center border border-[#E8DFD5] rounded-lg bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2.5 text-[#5C524A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold font-mono text-[#231E1B]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2.5 text-[#5C524A] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#BA6E50] hover:bg-[#A85A3D] text-white font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <span>Add to Bag · ₹{subtotal}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
