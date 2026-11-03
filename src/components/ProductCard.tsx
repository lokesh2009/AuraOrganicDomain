import React, { useState } from 'react';
import { Product } from '../types';
import { Eye, Plus, Check, Heart, Clock, Coffee, Sparkles, Star, CheckCircle2, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  likesCount?: number;
  isLiked?: boolean;
  onLikeToggle?: (productId: string, e: React.MouseEvent) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, isSubscription?: boolean) => void;
  onConsultDosage?: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  likesCount = 0,
  isLiked = false,
  onLikeToggle,
  onQuickView,
  onAddToCart,
  onConsultDosage,
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, false);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1400);
  };

  const timeCategory = product.chronoRitual?.timeCategory || 'all-day';

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-[#FAF7F2] rounded-xl border border-[#E8DFD5] hover:border-[#BA6E50] transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden"
    >
      {/* Top Tangible Benefit Highlight Ribbon (Blue Tea / Bella Vita Style) */}
      {product.primaryBenefit ? (
        <div className="bg-[#FAF0E6] text-[#88452D] px-3 py-1.5 text-[11px] font-semibold tracking-wide border-b border-[#E8DFD5] flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-[#BA6E50] shrink-0" />
          <span className="line-clamp-1">{product.primaryBenefit}</span>
        </div>
      ) : null}

      {/* Visual Product Box */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EAE4]">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FAF5F2] to-[#EAD3C6] text-center">
            <span className="text-lg font-serif text-[#BA6E50]">{product.name}</span>
            <span className="text-xs text-[#7A7067] mt-1">{product.categoryLabel}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isHimalayanOrganicsRange ? (
            <div className="bg-[#FAF7F2]/95 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-[#505D4A] border border-[#CAD4C5] flex items-center gap-1 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#65745E]"></span>
              <span>Himalayan Organics</span>
            </div>
          ) : product.featured ? (
            <div className="bg-[#88452D] text-white px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs">
              ★ Bestseller
            </div>
          ) : null}
        </div>

        {/* Live Like / Demand Heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onLikeToggle) onLikeToggle(product.id, e);
          }}
          title={isLiked ? 'Unlike formulation' : 'Like & validate formulation'}
          aria-label={`Like ${product.name}`}
          className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border ${
            isLiked
              ? 'bg-[#BA6E50] text-white border-[#BA6E50] shadow-xs'
              : 'bg-[#FAF7F2]/90 hover:bg-white text-[#5C524A] border-[#E8DFD5]'
          }`}
        >
          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current text-white' : 'text-[#BA6E50]'}`} />
          <span className="font-mono text-[10px] tabular-nums">{likesCount}</span>
        </button>

        {/* Quick Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#231E1B]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full max-w-[170px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#231E1B] bg-white hover:bg-[#FAF7F2] rounded-md shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#BA6E50]" />
            <span>Quick View</span>
          </button>

          {onConsultDosage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConsultDosage(product, e);
              }}
              className="w-full max-w-[170px] inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#88452D] hover:bg-[#6D3623] rounded-md shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timing & Milk Rx</span>
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Rating & Size */}
          <div className="flex items-center justify-between text-[11px] text-[#7A7067]">
            <div className="flex items-center gap-1 text-[#BA6E50] font-semibold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[#8A7E73] font-normal">({product.reviewCount})</span>
            </div>
            <span className="font-medium text-[#8A7E73]">{product.volumeOrWeight}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base font-serif font-bold text-[#231E1B] group-hover:text-[#BA6E50] transition-colors leading-snug line-clamp-1">
            {product.name}
          </h3>

          {/* Tangible Benefit Bullets (The Core Value Reflection like Blue Tea / Bella Vita) */}
          <div className="space-y-1 pt-1">
            {(product.benefitBullets && product.benefitBullets.length > 0
              ? product.benefitBullets.slice(0, 2)
              : [product.tagline]
            ).map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-[11px] text-[#4A3E38] leading-tight">
                <CheckCircle2 className="w-3 h-3 text-[#505D4A] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Compact Dinacharya Timing Pill */}
          <div className="pt-1 flex items-center justify-between text-[10px] text-[#7A7067] bg-[#F4EFE7]/80 px-2 py-1 rounded">
            <span className="flex items-center gap-1 font-medium text-[#88452D]">
              <Clock className="w-2.5 h-2.5 text-[#BA6E50]" />
              <span>Best: {product.chronoRitual?.bestTimeOfDay.split('(')[0]}</span>
            </span>
            <span className="text-[#5C524A] font-semibold">
              {timeCategory === 'bedtime' ? '🌙 Warm Milk' : '☀️ Lukewarm Water'}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#E8DFD5] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base font-bold font-mono tabular-nums text-[#231E1B]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-xs text-[#8A7E73] line-through font-mono tabular-nums">
                  ₹{product.mrp.toLocaleString()}
                </span>
              )}
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] font-bold text-[#3E523A] bg-[#E5ECE3] px-1.5 py-0.2 rounded">
                  Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                </span>
              )}
            </div>
            <div className="text-[10px] text-[#88452D] font-mono tabular-nums">
              ₹{Math.round(product.price * (1 - product.subscriptionDiscount)).toLocaleString()} on ritual sub
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Add to Bag */}
            <button
              onClick={handleQuickAdd}
              aria-label={`Add ${product.name} to bag`}
              className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                addedAnim
                  ? 'bg-[#505D4A] text-white'
                  : 'bg-[#BA6E50] hover:bg-[#A85A3D] text-[#FAF7F2]'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
