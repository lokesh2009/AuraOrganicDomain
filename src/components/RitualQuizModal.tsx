import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { X, Sparkles, Check, ArrowRight, RotateCcw, PackageCheck } from 'lucide-react';

interface RitualQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBundleToCart: (products: Product[]) => void;
}

export const RitualQuizModal: React.FC<RitualQuizModalProps> = ({
  isOpen,
  onClose,
  onAddBundleToCart,
}) => {
  const [step, setStep] = useState(1);
  const [intention, setIntention] = useState<'sleep' | 'focus' | 'digestion' | 'immunity'>('sleep');
  const [ritualTime, setRitualTime] = useState<'morning' | 'midday' | 'evening'>('evening');
  const [format, setFormat] = useState<'tea' | 'tincture' | 'powder' | 'trifecta'>('trifecta');
  const [addedBundleAnim, setAddedBundleAnim] = useState(false);

  if (!isOpen) return null;

  // Calculate tailored 3-product bundle
  const getRecommendedBundle = (): { title: string; subtitle: string; products: Product[] } => {
    if (format === 'powder') {
      if (intention === 'sleep') {
        const ashwa = PRODUCTS.find((p) => p.id === 'ho-organic-ashwagandha') || PRODUCTS[0];
        const shata = PRODUCTS.find((p) => p.id === 'ho-organic-shatavari') || PRODUCTS[1];
        const milk = PRODUCTS.find((p) => p.id === 'powder-golden-milk') || PRODUCTS[2];
        return {
          title: 'Himalayan Organic Powder Sleep Sanctuary',
          subtitle: 'Certified Organic Ashwagandha, Shatavari, and comforting Golden Milk for profound night rest.',
          products: [ashwa, shata, milk],
        };
      } else if (intention === 'focus') {
        const moringa = PRODUCTS.find((p) => p.id === 'ho-organic-moringa') || PRODUCTS[0];
        const protein = PRODUCTS.find((p) => p.id === 'ho-organic-plant-protein') || PRODUCTS[1];
        const brahmi = PRODUCTS.find((p) => p.id === 'ho-organic-brahmi') || PRODUCTS[2];
        return {
          title: 'Himalayan Organic Mind & Muscle Vitality',
          subtitle: 'Moringa supergreen leaf, clean pea protein, and Bacopa Brahmi for cognitive and physical performance.',
          products: [moringa, protein, brahmi],
        };
      } else if (intention === 'digestion') {
        const wheatgrass = PRODUCTS.find((p) => p.id === 'ho-organic-wheatgrass') || PRODUCTS[0];
        const triphala = PRODUCTS.find((p) => p.id === 'powder-bitter-gourd-triphala') || PRODUCTS[1];
        const amla = PRODUCTS.find((p) => p.id === 'ho-organic-amla') || PRODUCTS[2];
        return {
          title: 'Himalayan Organic Alkaline Gut & Blood Cleanse',
          subtitle: '70% active chlorophyll wheatgrass, pure triphala, and wild organic Amla vitamin C.',
          products: [wheatgrass, triphala, amla],
        };
      } else {
        const moringa = PRODUCTS.find((p) => p.id === 'ho-organic-moringa') || PRODUCTS[0];
        const giloy = PRODUCTS.find((p) => p.id === 'ho-organic-giloy') || PRODUCTS[1];
        const amla = PRODUCTS.find((p) => p.id === 'ho-organic-amla') || PRODUCTS[2];
        return {
          title: 'Himalayan Organic Super-Immunity Shield',
          subtitle: 'Moringa miracle leaf, Giloy Guduchi Amrita vine, and bio-stable Amla antioxidant defense.',
          products: [moringa, giloy, amla],
        };
      }
    }

    if (intention === 'sleep') {
      const milk = PRODUCTS.find((p) => p.id === 'powder-golden-milk')!;
      const nightBox = PRODUCTS.find((p) => p.id === 'box-night-ritual')!;
      const isabgol = PRODUCTS.find((p) => p.id === 'powder-isabgol')!;
      return {
        title: 'The Evening Calm & Circadian Harmony Ritual',
        subtitle: 'Turmeric, soothing ashwagandha, and gut-relaxing psyllium for tranquil sleep architecture.',
        products: [milk, nightBox, isabgol],
      };
    } else if (intention === 'focus') {
      const shilajit = PRODUCTS.find((p) => p.id === 'resin-shilajit')!;
      const haldi = PRODUCTS.find((p) => p.id === 'powder-haldi-turmeric')!;
      const dailyBox = PRODUCTS.find((p) => p.id === 'box-daily-ritual')!;
      return {
        title: 'The High-Altitude Energy & Stamina Ritual',
        subtitle: 'Pure fulvic acid minerals and golden antioxidants to sustain mitochondrial vigor.',
        products: [shilajit, haldi, dailyBox],
      };
    } else if (intention === 'digestion') {
      const isabgol = PRODUCTS.find((p) => p.id === 'powder-isabgol')!;
      const triphala = PRODUCTS.find((p) => p.id === 'powder-bitter-gourd-triphala')!;
      const sevenDay = PRODUCTS.find((p) => p.id === 'box-seven-day')!;
      return {
        title: 'The Gut Balance & Detox Equilibrium Ritual',
        subtitle: 'Soluble dietary prebiotic fiber paired with bitter digestive stimulants and Triphala.',
        products: [isabgol, triphala, sevenDay],
      };
    } else {
      const haldi = PRODUCTS.find((p) => p.id === 'powder-haldi-turmeric')!;
      const milk = PRODUCTS.find((p) => p.id === 'powder-golden-milk')!;
      const shilajit = PRODUCTS.find((p) => p.id === 'resin-shilajit')!;
      return {
        title: 'The Golden Fortress & Cellular Vitality Ritual',
        subtitle: 'High-curcumin golden spices with 84+ ionic trace minerals for everyday immune defense.',
        products: [haldi, milk, shilajit],
      };
    }
  };

  const bundle = getRecommendedBundle();
  const originalTotal = bundle.products.reduce((acc, p) => acc + p.price, 0);
  const bundleDiscount = 0.15; // 15% discount for full ritual bundle
  const discountedTotal = Math.round(originalTotal * (1 - bundleDiscount));
  const savings = originalTotal - discountedTotal;

  const handleAddBundle = () => {
    onAddBundleToCart(bundle.products);
    setAddedBundleAnim(true);
    setTimeout(() => {
      setAddedBundleAnim(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    setStep(1);
    setIntention('sleep');
    setRitualTime('evening');
    setFormat('trifecta');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231E1B]/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl p-6 sm:p-8 my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EAE4] text-[#231E1B] transition-colors cursor-pointer border border-[#E8DFD5]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Header */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#A85A3D]">
            <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
            <span>Interactive Apothecary Consultation</span>
          </div>
          <h2 id="quiz-title" className="text-2xl sm:text-3xl font-serif text-[#231E1B]">
            Botanical Ritual Finder
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524A]">
            Answer three quick questions to reveal your personalized herbal prescription and curated bundle.
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-[#BA6E50]'
                  : s < step
                  ? 'w-6 bg-[#65745E]'
                  : 'w-6 bg-[#E8DFD5]'
              }`}
            />
          ))}
          <span className="text-[11px] font-mono tabular-nums text-[#8A7E73] ml-2">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Intention */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#231E1B]">
              1. What is your primary wellness intention today?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'sleep', title: 'Deep Sleep & Nervous Reset', desc: 'Soothe hyperactive mind, ease muscular tension, delta slumber.' },
                { id: 'focus', title: 'Grounded Energy & Focus', desc: 'Steady mental clarity without caffeine heart palpitations.' },
                { id: 'digestion', title: 'Digestive Harmony & De-bloat', desc: 'Gentle post-meal comfort, microbial balance, anti-spasm.' },
                { id: 'immunity', title: 'Immune Shield & Resilience', desc: 'Fortify against weather shifts and travel burnout.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setIntention(opt.id as any)}
                  className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                    intention === opt.id
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-[#FAF7F2] hover:bg-[#F4EFE7]'
                  }`}
                >
                  <div className="font-serif font-semibold text-sm text-[#231E1B]">{opt.title}</div>
                  <div className="text-xs text-[#6B6056] mt-1 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Time of Day */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#231E1B]">
              2. When during the day do you prefer your wellness ritual?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'morning', title: 'Dawn Awakening', desc: 'Sunlight hydration, tonics, and setting daily intentions.' },
                { id: 'midday', title: 'Afternoon Recenter', desc: 'Overcoming the 2 PM dip, sustaining mental flow.' },
                { id: 'evening', title: 'Twilight Descent', desc: 'Dimming lights, steeping herbs, preparing for rest.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRitualTime(opt.id as any)}
                  className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                    ritualTime === opt.id
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-[#FAF7F2] hover:bg-[#F4EFE7]'
                  }`}
                >
                  <div className="font-serif font-semibold text-sm text-[#231E1B]">{opt.title}</div>
                  <div className="text-xs text-[#6B6056] mt-1 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-[#7A7067] hover:text-[#231E1B] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Botanical Format */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#231E1B]">
              3. Which delivery format best matches your lifestyle?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'trifecta', title: 'The Complete Trifecta (Recommended)', desc: 'Synergistic pairing of loose tea, sublingual tincture, and superfood powder.' },
                { id: 'tea', title: 'Loose Leaf Tea Ritual', desc: 'Savoring hot ceramic mugs, slow steep times, aroma therapy.' },
                { id: 'tincture', title: 'Sublingual Drops', desc: 'Ultra-fast absorption, dropper bottle portability on the go.' },
                { id: 'powder', title: '🌿 Himalayan Organic Powders', desc: '100% pure single-herb USDA organic powders whisked in warm milk or lukewarm water.' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setFormat(opt.id as any)}
                  className={`p-4 text-left rounded-xl border transition-all cursor-pointer ${
                    format === opt.id
                      ? 'border-[#BA6E50] bg-[#FAF4F0] ring-1 ring-[#BA6E50]'
                      : 'border-[#E8DFD5] bg-[#FAF7F2] hover:bg-[#F4EFE7]'
                  }`}
                >
                  <div className="font-serif font-semibold text-sm text-[#231E1B]">{opt.title}</div>
                  <div className="text-xs text-[#6B6056] mt-1 leading-relaxed">{opt.desc}</div>
                </button>
              ))}
            </div>
            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-[#7A7067] hover:text-[#231E1B] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all cursor-pointer"
              >
                <span>Generate Ritual Prescription</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results & Personalized Bundle Builder */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 bg-[#FAF4F0] rounded-xl border border-[#EAD3C6] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#88452D]">
                Prescribed For You
              </span>
              <h3 className="text-xl font-serif text-[#231E1B]">
                {bundle.title}
              </h3>
              <p className="text-xs text-[#5C524A]">
                {bundle.subtitle}
              </p>
            </div>

            {/* Itemized 3-Piece Bundle Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#231E1B]">
                Curated 3-Piece Formulations:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {bundle.products.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DFD5] flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="aspect-[4/3] rounded overflow-hidden bg-[#F3EAE4]">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[11px] text-[#A85A3D] font-medium uppercase">
                        Part 0{idx + 1} · {p.categoryLabel}
                      </div>
                      <div className="text-xs font-serif font-semibold text-[#231E1B] leading-tight">
                        {p.name}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#E8DFD5] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#7A7067]">{p.volumeOrWeight.split(' ')[0]} {p.volumeOrWeight.split(' ')[1]}</span>
                      <span className="font-semibold text-[#231E1B]">₹{p.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle Pricing Card & Action */}
            <div className="p-4 bg-[#F4EFE7] rounded-xl border border-[#E8DFD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A7067] line-through font-mono">
                    ₹{originalTotal.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold font-mono text-[#231E1B]">
                    ₹{discountedTotal.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-[#65745E] bg-[#E9ECE6] px-2 py-0.5 rounded">
                    Save 15% (₹{savings.toLocaleString()})
                  </span>
                </div>
                <div className="text-[11px] text-[#5C524A] mt-0.5">
                  Includes complimentary wooden dosing spoon & tea brewing guide.
                </div>
              </div>

              <button
                onClick={handleAddBundle}
                className={`py-3 px-6 rounded-md text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95 ${
                  addedBundleAnim
                    ? 'bg-[#65745E] text-white'
                    : 'bg-[#BA6E50] hover:bg-[#A85A3D] text-[#FAF7F2]'
                }`}
              >
                {addedBundleAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Bundle Added to Bag</span>
                  </>
                ) : (
                  <>
                    <PackageCheck className="w-4 h-4" />
                    <span>Add Ritual Bundle to Bag</span>
                  </>
                )}
              </button>
            </div>

            {/* Restart Quiz Link */}
            <div className="text-center pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-[#8A7E73] hover:text-[#BA6E50] cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Consultation</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
