import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductCategory, WellnessBenefit } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Heart, 
  Zap, 
  Moon, 
  Flame, 
  Shield, 
  Star 
} from 'lucide-react';

interface ProductCatalogProps {
  products?: Product[];
  activeConcernFilter?: string | null;
  onClearConcernFilter?: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, isSubscription?: boolean) => void;
  onOpenQuiz: () => void;
  onOpenDosageConsultation: (product?: Product) => void;
  onOpenValidationModal: () => void;
  onOpenNafishaChat?: (initialQuestion?: string) => void;
  productLikes: Record<string, number>;
  userLikedIds: Set<string>;
  onLikeToggle: (productId: string, e?: React.MouseEvent) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products = PRODUCTS,
  activeConcernFilter = null,
  onClearConcernFilter,
  onQuickView,
  onAddToCart,
  onOpenQuiz,
  onOpenDosageConsultation,
  onOpenValidationModal,
  onOpenNafishaChat,
  productLikes,
  userLikedIds,
  onLikeToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedConcern, setSelectedConcern] = useState<string>('all');
  const [selectedPowderSubcategory, setSelectedPowderSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'popular'>('featured');

  // Sync external concern filter from Hero
  useEffect(() => {
    if (activeConcernFilter) {
      setSelectedConcern(activeConcernFilter);
    }
  }, [activeConcernFilter]);

  const concerns = [
    { id: 'all', label: 'All Concerns', icon: Sparkles, badge: 'All 16' },
    { id: 'energy', label: '⚡ Energy & Stamina', icon: Zap, badge: 'Shilajit & BCAA' },
    { id: 'sleep', label: '🌙 Deep Sleep & Stress', icon: Moon, badge: 'Ashwagandha & Night Box' },
    { id: 'gut', label: '🌿 Gut Cleanse & Anti-Bloat', icon: Flame, badge: 'Isabgol & Triphala' },
    { id: 'skin', label: '✨ Radiant Skin & Hair', icon: Heart, badge: 'Haldi & Amla Vitamin C' },
    { id: 'immunity', label: '🛡️ Immunity & Detox', icon: Shield, badge: 'Moringa & Giloy' },
  ];

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'All Formulations' },
    { id: 'organic-powders', label: '🌿 Himalayan Organic Powders' },
    { id: 'ritual-boxes', label: 'Curated Ritual Boxes' },
    { id: 'superfood-powders', label: 'Superfood Mixes' },
    { id: 'pure-extracts', label: 'Pure Resins & Shilajit' },
  ];

  const powderSubcategories = [
    { id: 'all', label: 'All Powders' },
    { id: 'greens-detox', label: '🍃 Greens & Detox' },
    { id: 'adaptogens-brain', label: '🧠 Adaptogens & Brain' },
    { id: 'heart-endurance', label: '❤️ Heart & Endurance' },
    { id: 'womens-wellness', label: '🌸 Women’s Balance' },
    { id: 'daily-vitality', label: '🛡️ Immunity & Rasayana' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Concern match (tangible consumer benefit filter)
      if (selectedConcern !== 'all') {
        if (product.targetConcern !== selectedConcern) {
          // Fallback check in benefits
          if (selectedConcern === 'sleep' && !product.benefits.includes('calm-sleep')) return false;
          if (selectedConcern === 'energy' && !product.benefits.includes('focus-energy')) return false;
          if (selectedConcern === 'gut' && !product.benefits.includes('digestive-harmony')) return false;
          if (selectedConcern === 'immunity' && !product.benefits.includes('immune-defense')) return false;
          if (selectedConcern === 'skin' && product.targetConcern !== 'skin') return false;
        }
      }
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Powder Subcategory match
      if (selectedPowderSubcategory !== 'all' && product.powderSubcategory !== selectedPowderSubcategory) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(q);
        const matchesBenefit = product.primaryBenefit?.toLowerCase().includes(q);
        const matchesBotanicals = product.keyBotanicals.some((b) => b.toLowerCase().includes(q));
        if (!matchesName && !matchesSubtitle && !matchesBenefit && !matchesBotanicals) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') {
        const likesA = productLikes[a.id] || 0;
        const likesB = productLikes[b.id] || 0;
        return likesB - likesA;
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedConcern, selectedCategory, selectedPowderSubcategory, searchQuery, sortBy, productLikes]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedConcern('all');
    setSelectedPowderSubcategory('all');
    setSearchQuery('');
    setSortBy('featured');
    if (onClearConcernFilter) onClearConcernFilter();
  };

  const totalLikes = Object.values(productLikes).reduce((a, b) => a + b, 0);

  return (
    <section id="shop" className="py-8 sm:py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Compact Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8DFD5]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A85A3D]">
              <span>Formulated For Tangible Results</span>
              <span aria-hidden="true" className="text-[#D8B19C]">·</span>
              <span className="text-[#65745E]">Ayush Certified</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#231E1B]">
              The Apothecary Collection
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {onOpenNafishaChat && (
              <button
                onClick={() => onOpenNafishaChat()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#231E1B] bg-white hover:bg-[#FAF4F0] border border-[#D8B19C] rounded-md transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
                <span>Nafisha AI</span>
              </button>
            )}

            <button
              onClick={() => onOpenDosageConsultation()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timing Rx</span>
            </button>

            <button
              onClick={onOpenQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#88452D] bg-[#F4EFE7] hover:bg-[#EAE2D5] border border-[#E8DFD5] rounded-md transition-all cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Quiz</span>
            </button>
          </div>
        </div>

        {/* 1. BENEFIT-FIRST CONCERN TABS (Blue Tea / Bella Vita Style Quick Switcher) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold tracking-wider text-[#88452D]">
              Shop By Desired Benefit:
            </span>
            {selectedConcern !== 'all' && (
              <button
                onClick={() => {
                  setSelectedConcern('all');
                  if (onClearConcernFilter) onClearConcernFilter();
                }}
                className="text-xs text-[#BA6E50] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All Benefits</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {concerns.map((c) => {
              const isActive = selectedConcern === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedConcern(c.id);
                    if (c.id === 'all' && onClearConcernFilter) {
                      onClearConcernFilter();
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isActive
                      ? 'bg-[#88452D] text-white border-[#88452D] shadow-sm font-semibold'
                      : 'bg-white hover:bg-[#FAF4F0] text-[#5C524A] border-[#E8DFD5]'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F4EFE7] text-[#7A7067]'
                  }`}>
                    {c.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. COMPACT SECONDARY TOOLBAR: Category Pills + Search + Sort in 1 streamlined row */}
        <div className="bg-white p-3 rounded-xl border border-[#E8DFD5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'organic-powders') setSelectedPowderSubcategory('all');
                  }}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#231E1B] text-white'
                      : 'bg-[#F4EFE7] text-[#5C524A] hover:bg-[#EAE2D5]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search & Sort inline */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-[#8A7E73] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search benefit or herb..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#231E1B] placeholder-[#8A7E73] focus:outline-none focus:border-[#BA6E50]"
              />
            </div>

            <select
              value={sortBy}
              aria-label="Sort products by"
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 text-xs rounded-md bg-[#FAF7F2] border border-[#E8DFD5] text-[#231E1B] focus:outline-none focus:border-[#BA6E50] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="popular">Most Liked</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Dedicated Sub-row for Himalayan Organic Powders Subcategories (only when active) */}
        {selectedCategory === 'organic-powders' && (
          <div className="p-2.5 bg-[#EAEFE8] rounded-lg border border-[#CAD8C5] flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-semibold text-[#3A4936] shrink-0">Target Focus:</span>
            {powderSubcategories.map((sub) => {
              const isActive = selectedPowderSubcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedPowderSubcategory(sub.id)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all cursor-pointer font-medium whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3A4936] text-white shadow-xs'
                      : 'bg-white text-[#505D4A] hover:bg-[#D7E2D4]'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Compact D2C Trust & Founder Strip (Replacing huge 250px block) */}
        <div className="bg-[#FAF4F0] border border-[#D8B19C] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#88452D] text-white font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Personalized Rx</span>
            </span>
            <span className="text-[#5C524A]">
              Need exact glass of milk / lukewarm water timing for your condition?
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenDosageConsultation()}
              className="text-[#BA6E50] font-semibold hover:underline cursor-pointer"
            >
              Consult Dosage Assistant →
            </button>
            <span className="text-[#D8B19C]">|</span>
            <button
              onClick={onOpenValidationModal}
              className="text-[#5C524A] hover:text-[#231E1B] flex items-center gap-1 cursor-pointer"
            >
              <Heart className="w-3 h-3 text-[#BA6E50] fill-current" />
              <span>{totalLikes} validated reviews</span>
            </button>
          </div>
        </div>

        {/* Active Filter Notice */}
        <div className="flex items-center justify-between text-xs text-[#7A7067]">
          <span>
            Showing <strong className="text-[#231E1B]">{filteredProducts.length}</strong> formulations
            {selectedConcern !== 'all' ? ` for "${selectedConcern.toUpperCase()}"` : ''}
          </span>
          {(selectedCategory !== 'all' || selectedConcern !== 'all' || searchQuery.trim() !== '') && (
            <button
              onClick={handleResetFilters}
              className="text-[#BA6E50] hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>

        {/* Product Cards Grid: High-converting 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                likesCount={productLikes[product.id] || product.likesCount || 0}
                isLiked={userLikedIds.has(product.id)}
                onLikeToggle={onLikeToggle}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onConsultDosage={onOpenDosageConsultation}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-xl border border-[#E8DFD5] space-y-3 p-6">
            <p className="text-base font-serif text-[#231E1B]">
              No formulations match your chosen filter.
            </p>
            <p className="text-xs text-[#7A7067]">
              Try choosing &quot;All Concerns&quot; or clearing your search term.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
