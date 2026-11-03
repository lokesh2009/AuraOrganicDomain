import React, { useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Mountain, Check, Star, Zap, Moon, Heart, Flame, Shield } from 'lucide-react';
import { DAILY_BOX_IMAGE, SEVEN_DAY_BOX_IMAGE, NIGHT_RITUAL_IMAGE, GIFT_BOX_IMAGE, SHILAJIT_IMAGE } from '../data/products';

interface HeroProps {
  onExploreShop: () => void;
  onOpenQuiz: () => void;
  onSelectConcern?: (concern: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreShop, onOpenQuiz, onSelectConcern }) => {
  const [selectedHeroImage, setSelectedHeroImage] = useState(DAILY_BOX_IMAGE);
  const [activeLabel, setActiveLabel] = useState('Daily Ritual Box · Five Powerful Rituals');

  const previews = [
    { img: DAILY_BOX_IMAGE, label: 'Daily Ritual Box · Five Powerful Rituals' },
    { img: SEVEN_DAY_BOX_IMAGE, label: '7 Day Ritual Box · Progressive Habit Program' },
    { img: NIGHT_RITUAL_IMAGE, label: 'Night Ritual Box · Rest, Restore & Rebalance' },
    { img: GIFT_BOX_IMAGE, label: 'Luxury Wellness Gift Box · Hamper Edition' },
    { img: SHILAJIT_IMAGE, label: 'Himalayan Shilajit Resin · Pure 10g' },
  ];

  const quickConcerns = [
    { id: 'energy', label: 'Energy & Stamina', icon: Zap, outcome: '75%+ Fulvic Shilajit', color: 'bg-amber-50 text-amber-900 border-amber-200' },
    { id: 'sleep', label: 'Deep Sleep & Stress', icon: Moon, outcome: 'REM sleep in 20 mins', color: 'bg-indigo-50 text-indigo-900 border-indigo-200' },
    { id: 'gut', label: 'Gut Cleanse & Anti-Bloat', icon: Flame, outcome: '100% Soluble Fiber', color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    { id: 'skin', label: 'Glowing Skin & Hair', icon: Heart, outcome: 'High Curcumin & Amla', color: 'bg-rose-50 text-rose-900 border-rose-200' },
    { id: 'immunity', label: 'Immunity & Detox', icon: Shield, outcome: 'Giloy & Golden Milk', color: 'bg-orange-50 text-orange-900 border-orange-200' },
  ];

  const handleConcernClick = (concernId: string) => {
    if (onSelectConcern) {
      onSelectConcern(concernId);
    } else {
      onExploreShop();
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2] border-b border-[#E8DFD5]">
      {/* Top D2C Benefit Value Bar */}
      <div className="bg-[#BA6E50] text-[#FAF7F2] text-[11px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-center gap-3 sm:gap-6 overflow-x-auto whitespace-nowrap">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
          <strong>4.98 / 5 Rating</strong> (24,000+ Verified Buyers)
        </span>
        <span aria-hidden="true" className="opacity-40">|</span>
        <span>⚡ <strong>Visible Benefits</strong> in 7 to 14 Days</span>
        <span aria-hidden="true" className="opacity-40">|</span>
        <span>🍃 100% Sun-Purified Ayurvedic Botanicals</span>
        <span aria-hidden="true" className="opacity-40 hidden md:inline">|</span>
        <span className="hidden md:inline">🚚 Free Express Delivery Over ₹999</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Quiet Unboxed Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#A85A3D]">
              <span className="bg-[#F4EFE7] px-2 py-0.5 rounded border border-[#E8DFD5]">100% Organic & Lab Tested</span>
              <span aria-hidden="true" className="text-[#D8B19C]">·</span>
              <span>16,000+ ft Himalayan Altitude</span>
              <span aria-hidden="true" className="text-[#D8B19C]">·</span>
              <span className="text-[#65745E] font-bold">Zero Fillers</span>
            </div>

            {/* Campaign Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#231E1B] tracking-tight leading-[1.12]">
              Real Botanical Purity. <br />
              <span className="text-[#BA6E50] italic font-normal">Real Feelable Benefits.</span>
            </h1>

            {/* Narrative description */}
            <p className="text-sm sm:text-base text-[#5C524A] leading-relaxed max-w-xl">
              Targeted Ayurvedic remedies crafted for fast, feelable results: conquer chronic morning fatigue with pure Himalayan Shilajit, fall asleep within 20 minutes with our Night Ritual, and flush bloating with organic soluble fiber.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#shop"
                onClick={onExploreShop}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <span>Shop By Benefit & Concern</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#88452D] bg-[#F4EFE7] hover:bg-[#EAE2D5] border border-[#E8DFD5] rounded-md transition-all whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
                <span>Find Your Routine (60s Quiz)</span>
              </button>
            </div>

            {/* SHOP BY CONCERN QUICK SELECTOR (Like Blue Tea & Bella Vita) */}
            <div className="pt-3 border-t border-[#E8DFD5] space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#88452D] flex items-center justify-between">
                <span>Select Your Health Goal:</span>
                <span className="text-[10px] text-[#7A7067] font-normal lowercase">click to filter products</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {quickConcerns.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => handleConcernClick(c.id)}
                      className={`p-2 rounded-lg border text-left transition-all hover:scale-102 hover:shadow-xs cursor-pointer flex flex-col justify-between ${c.color}`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[11px] leading-tight">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{c.label}</span>
                      </div>
                      <span className="text-[10px] opacity-80 mt-1 line-clamp-1">{c.outcome}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Visual Frame: User-Uploaded High-Res Photography */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg bg-[#F3EAE4] border border-[#E2D5C8]">
              <img
                src={selectedHeroImage}
                alt={activeLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-500 hover:scale-102"
              />

              {/* Quiet overlay badge */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-[#E8DFD5] flex items-center justify-between text-xs text-[#231E1B]">
                <span className="font-serif italic text-sm">{activeLabel.split(' · ')[0]}</span>
                <span className="text-[#BA6E50] font-semibold uppercase tracking-wider text-[10px]">
                  {activeLabel.split(' · ')[1] || 'Aura Organic'}
                </span>
              </div>
            </div>

            {/* Interactive Image Gallery Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[10px] text-[#8A7E73] uppercase tracking-wider font-mono shrink-0 mr-1">
                Formulations:
              </span>
              {previews.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedHeroImage(item.img);
                    setActiveLabel(item.label);
                  }}
                  className={`relative shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedHeroImage === item.img
                      ? 'border-[#BA6E50] shadow-sm scale-105'
                      : 'border-[#E8DFD5] opacity-70 hover:opacity-100 hover:border-[#D8B19C]'
                  }`}
                  aria-label={`Preview ${item.label}`}
                >
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                  {selectedHeroImage === item.img && (
                    <div className="absolute inset-0 bg-[#BA6E50]/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
