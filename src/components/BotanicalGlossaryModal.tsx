import React, { useState } from 'react';
import { BOTANICALS } from '../data/botanicals';
import { PRODUCTS } from '../data/products';
import { BotanicalIngredient, Product } from '../types';
import { X, Search, MapPin, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface BotanicalGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  initialBotanicalSearch?: string;
}

export const BotanicalGlossaryModal: React.FC<BotanicalGlossaryModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  initialBotanicalSearch = '',
}) => {
  const [search, setSearch] = useState(initialBotanicalSearch);
  const [selectedBotanical, setSelectedBotanical] = useState<BotanicalIngredient>(BOTANICALS[0]);

  if (!isOpen) return null;

  const filteredBotanicals = BOTANICALS.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.botanicalName.toLowerCase().includes(q) ||
      b.sourcingRegion.toLowerCase().includes(q) ||
      b.keyBenefits.some((benefit) => benefit.toLowerCase().includes(q))
    );
  });

  const featuredProducts = PRODUCTS.filter((p) =>
    selectedBotanical.featuredInProductIds.includes(p.id)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glossary-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231E1B]/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close glossary"
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#FAF7F2] hover:bg-[#F3EAE4] text-[#231E1B] transition-colors cursor-pointer border border-[#E8DFD5]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#A85A3D]">
            <BookOpen className="w-3.5 h-3.5 text-[#BA6E50]" />
            <span>Farm Sourcing & Pharmacognosy</span>
          </div>
          <h2 id="glossary-title" className="text-2xl sm:text-3xl font-serif text-[#231E1B]">
            The Botanical Sourcing Glossary
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524A] max-w-2xl">
            We source exclusively from certified organic biodynamic micro-farms and ethical wildcrafters. Explore our active pharmacopoeia, harvest regions, and clinical properties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-[#8A7E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by botanical name, Latin taxonomy, or sourcing region..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#DCCFBF] rounded-lg text-[#231E1B] placeholder-[#9E9287] focus:outline-none focus:border-[#BA6E50]"
          />
        </div>

        {/* 2-Column Split: List on Left, Deep Dossier on Right */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 overflow-hidden min-h-[350px]">
          
          {/* Left Column: Botanical Selector List */}
          <div className="md:col-span-5 overflow-y-auto space-y-2 pr-1">
            {filteredBotanicals.map((botanical) => {
              const isSelected = selectedBotanical.id === botanical.id;
              return (
                <button
                  key={botanical.id}
                  onClick={() => setSelectedBotanical(botanical)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FAF4F0] border-[#BA6E50] ring-1 ring-[#BA6E50]'
                      : 'bg-[#FAF7F2] border-[#E8DFD5] hover:bg-[#F4EFE7]'
                  }`}
                >
                  <div className="font-serif font-semibold text-sm text-[#231E1B]">
                    {botanical.name}
                  </div>
                  <div className="text-xs text-[#88452D] italic font-serif mt-0.5">
                    {botanical.botanicalName}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7A7067] mt-1.5">
                    <MapPin className="w-3 h-3 text-[#BA6E50] shrink-0" />
                    <span className="truncate">{botanical.sourcingRegion}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Deep Botanical Dossier */}
          <div className="md:col-span-7 bg-[#F4EFE7] rounded-xl p-6 border border-[#E8DFD5] overflow-y-auto space-y-5">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A85A3D]">
                Active Botanical Monograph
              </span>
              <h3 className="text-2xl font-serif text-[#231E1B] mt-0.5">
                {selectedBotanical.name}
              </h3>
              <p className="text-sm font-serif italic text-[#88452D]">
                {selectedBotanical.botanicalName}
              </p>
            </div>

            {/* Micro Sourcing Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-4 rounded-lg border border-[#E8DFD5]">
              <div>
                <span className="text-[#8A7E73] block uppercase text-[10px] tracking-wider">Harvest Origin:</span>
                <span className="font-medium text-[#231E1B]">{selectedBotanical.sourcingRegion}</span>
              </div>
              <div>
                <span className="text-[#8A7E73] block uppercase text-[10px] tracking-wider">Plant Part Used:</span>
                <span className="font-medium text-[#231E1B]">{selectedBotanical.partUsed}</span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-[#E8DFD5]">
                <span className="text-[#8A7E73] block uppercase text-[10px] tracking-wider">Extraction Standard:</span>
                <span className="text-[#5C524A]">{selectedBotanical.extractionMethod}</span>
              </div>
            </div>

            {/* Folk History & Herbal Lore */}
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#231E1B] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
                <span>Herbal Tradition & Ethnobotany</span>
              </span>
              <p className="text-xs text-[#5C524A] leading-relaxed italic bg-white/60 p-3 rounded border border-[#E8DFD5]">
                &quot;{selectedBotanical.folkHistory}&quot;
              </p>
            </div>

            {/* Clinical Actions */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#231E1B]">
                Key Physiological Actions:
              </span>
              <ul className="space-y-1.5 text-xs text-[#5C524A]">
                {selectedBotanical.keyBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#BA6E50] mt-0.5">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Featured Formulations */}
            <div className="pt-3 border-t border-[#E8DFD5] space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#231E1B]">
                Formulated In Aura Organic Remedies:
              </span>
              <div className="flex flex-wrap gap-2">
                {featuredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(p);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#FAF4F0] border border-[#D8B19C] rounded-md text-xs font-medium text-[#231E1B] transition-colors cursor-pointer"
                  >
                    <span>{p.name}</span>
                    <ExternalLink className="w-3 h-3 text-[#BA6E50]" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
