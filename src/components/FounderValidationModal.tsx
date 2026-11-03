import React, { useState, useEffect } from 'react';
import { Product, MarketFeedback } from '../types';
import { PRODUCTS } from '../data/products';
import { 
  X, 
  TrendingUp, 
  Heart, 
  Eye, 
  BarChart3, 
  CheckCircle2, 
  Vote, 
  MessageSquare, 
  RotateCcw, 
  Download, 
  Sparkles,
  Lightbulb,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface FounderValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productLikes: Record<string, number>;
  productWalkthroughs: Record<string, number>;
  onLikeProduct: (productId: string) => void;
}

export const FounderValidationModal: React.FC<FounderValidationModalProps> = ({
  isOpen,
  onClose,
  productLikes,
  productWalkthroughs,
}) => {
  // Category poll votes
  const [pollVotes, setPollVotes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('aura_category_poll_votes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      'sleep-gummies': 142,
      'mushroom-coffee': 118,
      'kumkumadi-oils': 89,
      'wild-honey-jellies': 64,
      'liquid-tinctures': 96,
    };
  });

  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    return localStorage.getItem('aura_user_has_voted_category') === 'true';
  });

  // User feedbacks
  const [feedbacks, setFeedbacks] = useState<MarketFeedback[]>(() => {
    try {
      const saved = localStorage.getItem('aura_founder_feedbacks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'fb-1',
        timestamp: '2 hours ago',
        categoryInterest: 'Sleep & Relaxation',
        wouldBuy: 'definitely',
        comment: 'The Golden Milk with exact 9:15 PM warm milk preparation was super clear. I would buy this for insomnia immediately.',
      },
      {
        id: 'fb-2',
        timestamp: '5 hours ago',
        categoryInterest: 'Pure Shilajit',
        wouldBuy: 'definitely',
        comment: 'Pricing in ₹999 for 10g Himalayan Shilajit is competitive and the wooden spoon dosage guide makes it easy to use.',
      },
      {
        id: 'fb-3',
        timestamp: 'Yesterday',
        categoryInterest: 'Alternative Category Suggestion',
        wouldBuy: 'maybe',
        comment: 'If you pivot, please consider Ayurvedic mushroom coffee blends with Ashwagandha for morning focus without caffeine jitters.',
      },
    ];
  });

  const [selectedBuyIntent, setSelectedBuyIntent] = useState<'definitely' | 'maybe' | 'unlikely'>('definitely');
  const [selectedCategoryInterest, setSelectedCategoryInterest] = useState('Sleep & Deep Rest Formulations');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  // Sync poll votes
  useEffect(() => {
    try {
      localStorage.setItem('aura_category_poll_votes', JSON.stringify(pollVotes));
      localStorage.setItem('aura_founder_feedbacks', JSON.stringify(feedbacks));
    } catch {
      // Ignore
    }
  }, [pollVotes, feedbacks]);

  if (!isOpen) return null;

  // Aggregate metrics
  const totalLikes = Object.values(productLikes).reduce((sum, n) => sum + n, 0);
  const totalWalkthroughs = Object.values(productWalkthroughs).reduce((sum, n) => sum + n, 0);

  // Sorted products by combined engagement
  const sortedProducts = [...PRODUCTS].sort((a, b) => {
    const scoreA = (productLikes[a.id] || 0) * 3 + (productWalkthroughs[a.id] || 0);
    const scoreB = (productLikes[b.id] || 0) * 3 + (productWalkthroughs[b.id] || 0);
    return scoreB - scoreA;
  });

  const handleVoteCategory = (catKey: string) => {
    if (hasVoted) return;
    setPollVotes((prev) => ({
      ...prev,
      [catKey]: (prev[catKey] || 0) + 1,
    }));
    setHasVoted(true);
    localStorage.setItem('aura_user_has_voted_category', 'true');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const newFb: MarketFeedback = {
      id: `fb-${Date.now()}`,
      timestamp: 'Just now',
      categoryInterest: selectedCategoryInterest,
      wouldBuy: selectedBuyIntent,
      comment: feedbackComment.trim(),
    };

    setFeedbacks((prev) => [newFb, ...prev]);
    setFeedbackComment('');
    setSubmittedFeedback(true);
    setTimeout(() => setSubmittedFeedback(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      totalLikes,
      totalWalkthroughs,
      productLikes,
      productWalkthroughs,
      pollVotes,
      feedbacks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-market-trial-metrics-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pollOptions = [
    { key: 'sleep-gummies', label: 'Ayurvedic Sleep Melatonin-Free Botanical Gummies', votes: pollVotes['sleep-gummies'] || 0 },
    { key: 'mushroom-coffee', label: 'Herbal Mushroom & Adaptogen Coffee (Lion\'s Mane + Ashwagandha)', votes: pollVotes['mushroom-coffee'] || 0 },
    { key: 'liquid-tinctures', label: 'High-Concentration Sublingual Herbal Dropper Tinctures', votes: pollVotes['liquid-tinctures'] || 0 },
    { key: 'kumkumadi-oils', label: 'Cold-Pressed Kumkumadi & Glow Ayurvedic Facial Elixirs', votes: pollVotes['kumkumadi-oils'] || 0 },
    { key: 'wild-honey-jellies', label: 'Himalayan Raw Forest Honey & Royal Shilajit Wellness Jellies', votes: pollVotes['wild-honey-jellies'] || 0 },
  ];

  const totalPollVotes = Object.values(pollVotes).reduce((a, b) => a + b, 0);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#231E1B]/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FAF4F0] border-b border-[#E8DFD5] p-5 sm:p-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#EAD3C6] text-[#88452D] font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Hit-and-Run Market Validation Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#231E1B]">
              Founder Demand & Viability Intelligence
            </h2>
            <p className="text-xs text-[#7A7067] max-w-2xl leading-relaxed">
              Real-time walkthroughs, customer likes, product reception, and alternative category demand to evaluate whether to greenlight this apothecary lineup or pivot to high-performing formulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              title="Download validation analytics JSON"
              className="p-2 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#5C524A] border border-[#E8DFD5] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#BA6E50]" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-full bg-[#FAF7F2] hover:bg-white text-[#231E1B] border border-[#E8DFD5] transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#7A7067]">
                <span className="uppercase font-semibold tracking-wider">Total Walkthroughs</span>
                <Eye className="w-4 h-4 text-[#BA6E50]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#231E1B] mt-2">
                {totalWalkthroughs.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#65745E] mt-1 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> High engagement rate
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#7A7067]">
                <span className="uppercase font-semibold tracking-wider">Customer Likes</span>
                <Heart className="w-4 h-4 text-[#BA6E50]" />
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#231E1B] mt-2">
                {totalLikes.toLocaleString()}
              </div>
              <div className="text-[11px] text-[#88452D] mt-1 font-medium">
                Active product approvals
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#7A7067]">
                <span className="uppercase font-semibold tracking-wider">Top Timing Demand</span>
                <Clock className="w-4 h-4 text-[#BA6E50]" />
              </div>
              <div className="text-lg sm:text-xl font-serif font-bold text-[#231E1B] mt-2 leading-tight">
                Bedtime (9:15 PM)
              </div>
              <div className="text-[11px] text-[#7A7067] mt-1">
                48% users seek sleep relief
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-sm">
              <div className="flex items-center justify-between text-xs text-[#7A7067]">
                <span className="uppercase font-semibold tracking-wider">Viability Verdict</span>
                <Sparkles className="w-4 h-4 text-[#65745E]" />
              </div>
              <div className="text-lg sm:text-xl font-serif font-bold text-[#65745E] mt-2">
                Strong Positive
              </div>
              <div className="text-[11px] text-[#7A7067] mt-1">
                Sleep & Shilajit leads
              </div>
            </div>
          </div>

          {/* Section 1: Product Demand Ranking Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-semibold text-[#231E1B]">
                  Product Demand & Engagement Leaderboard
                </h3>
                <p className="text-xs text-[#7A7067]">
                  Ranked by combined consumer likes, walkthrough views, and time-of-day consultations.
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-[#88452D] bg-[#F4EFE7] px-2.5 py-1 rounded border border-[#E2D5C8]">
                10 Formulations Tested
              </span>
            </div>

            <div className="border border-[#E8DFD5] rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF4F0] border-b border-[#E8DFD5] text-[#7A7067] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Remedy</th>
                      <th className="py-3 px-4">Best Time & Liquid</th>
                      <th className="py-3 px-4 text-center">Likes</th>
                      <th className="py-3 px-4 text-center">Walkthroughs</th>
                      <th className="py-3 px-4">Market Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD5]">
                    {sortedProducts.map((p, idx) => {
                      const likes = productLikes[p.id] || 0;
                      const walks = productWalkthroughs[p.id] || 0;
                      const maxWalks = Math.max(...Object.values(productWalkthroughs), 1);
                      const pct = Math.min(100, Math.round((walks / maxWalks) * 100));

                      return (
                        <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#88452D]">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded object-cover border border-[#E8DFD5] shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-[#231E1B] block">{p.name}</span>
                                <span className="text-[10px] text-[#7A7067]">₹{p.price} · {p.categoryLabel}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-[11px] font-medium text-[#231E1B]">
                              {p.chronoRitual.bestTimeOfDay.split('(')[0]}
                            </div>
                            <div className="text-[10px] text-[#88452D]">
                              {p.chronoRitual.liquidMedium.split('(')[0]}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-[#BA6E50]">
                            {likes}
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-[#5C524A]">
                            {walks.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 min-w-[140px]">
                            <div className="w-full bg-[#F4EFE7] rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-[#BA6E50] h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-[#7A7067] mt-0.5 block">
                              {pct >= 75 ? '🔥 High Demand' : pct >= 45 ? '⚡ Steady Traction' : '💡 Early Stage'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 2: Alternative Product Category Poll */}
          <div className="bg-[#FAF4F0] p-5 sm:p-6 rounded-2xl border border-[#D8B19C] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BA6E50]">
                  <Vote className="w-3.5 h-3.5" />
                  <span>Category Pivot & Expansion Poll</span>
                </div>
                <h3 className="text-base sm:text-lg font-serif font-semibold text-[#231E1B]">
                  If we formulate a new category next, which would you purchase?
                </h3>
                <p className="text-xs text-[#7A7067]">
                  Help the founder evaluate where customer demand is highest if pivoting away from or expanding beyond dummy powders and resins.
                </p>
              </div>

              {hasVoted && (
                <span className="shrink-0 text-xs font-semibold text-[#65745E] bg-white px-2.5 py-1 rounded-full border border-[#D8B19C] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Vote Recorded</span>
                </span>
              )}
            </div>

            <div className="space-y-2.5 pt-1">
              {pollOptions.map((opt) => {
                const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                return (
                  <div
                    key={opt.key}
                    onClick={() => handleVoteCategory(opt.key)}
                    className={`p-3.5 rounded-xl border bg-white transition-all cursor-pointer relative overflow-hidden ${
                      hasVoted
                        ? 'cursor-default border-[#E8DFD5]'
                        : 'hover:border-[#BA6E50] hover:shadow-sm'
                    }`}
                  >
                    {/* Background Progress Fill */}
                    <div
                      className="absolute inset-y-0 left-0 bg-[#EAD3C6]/40 transition-all duration-700 pointer-events-none"
                      style={{ width: `${pct}%` }}
                    />

                    <div className="relative flex items-center justify-between gap-3 text-xs z-10">
                      <span className="font-semibold text-[#231E1B]">{opt.label}</span>
                      <div className="flex items-center gap-2 font-mono font-medium text-[#88452D] shrink-0">
                        <span>{opt.votes} votes</span>
                        <span className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#E8DFD5]">{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {!hasVoted && (
              <p className="text-[11px] text-[#88452D] italic">
                * Click on any alternative category above to submit your vote instantly.
              </p>
            )}
          </div>

          {/* Section 3: Direct Founder Feedback Submissions */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-serif font-semibold text-[#231E1B]">
                Direct Market Trial Feedback & Viability Insights
              </h3>
              <p className="text-xs text-[#7A7067]">
                Share your direct thoughts on whether this Ayurvedic timing concept works for you, or what you would change.
              </p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="p-4 sm:p-5 bg-white rounded-xl border border-[#E8DFD5] space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231E1B] mb-1">
                    Would you buy this product in real life?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'definitely', label: 'Yes, definitely' },
                      { id: 'maybe', label: 'Maybe, with tweaks' },
                      { id: 'unlikely', label: 'Prefer other category' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedBuyIntent(opt.id as any)}
                        className={`py-2 px-2 text-[11px] font-medium rounded-lg border transition-all cursor-pointer text-center ${
                          selectedBuyIntent === opt.id
                            ? 'bg-[#BA6E50] text-white border-[#BA6E50] font-semibold'
                            : 'bg-white text-[#5C524A] border-[#E8DFD5] hover:border-[#BA6E50]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231E1B] mb-1">
                    Category or Focus You Are Evaluating:
                  </label>
                  <select
                    value={selectedCategoryInterest}
                    onChange={(e) => setSelectedCategoryInterest(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E8DFD5] bg-white text-[#231E1B] focus:border-[#BA6E50] outline-none"
                  >
                    <option value="Sleep & Deep Rest Formulations">Sleep & Deep Rest (Golden Milk, Night Ritual)</option>
                    <option value="Cellular Energy & Stamina (Shilajit)">Cellular Energy & Stamina (Shilajit Resin)</option>
                    <option value="Gut Health & Fasted Detoxing">Gut Health & Digestion (Isabgol, Triphala)</option>
                    <option value="Immunity & Daily Anti-inflammatory">Immunity & Anti-inflammatory (Haldi Turmeric)</option>
                    <option value="Discovery Pack & Trial Kits">Discovery Pack & Trial Sachets</option>
                    <option value="Other / Pivot to New Formulation">Other / Pivot to New Formulation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231E1B] mb-1">
                  Your Thoughts, Honest Review, or Product Suggestion:
                </label>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  rows={2}
                  placeholder="e.g. The exact glass of warm milk timing suggestion for sleep was very relatable, but I would also like single-serve ready-to-drink format..."
                  className="w-full text-xs p-3 rounded-lg border border-[#E8DFD5] bg-[#FAF7F2] text-[#231E1B] focus:border-[#BA6E50] outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#7A7067]">
                  Your review directly informs the founder's next manufacturing run.
                </span>

                <button
                  type="submit"
                  disabled={!feedbackComment.trim()}
                  className="py-2 px-5 bg-[#BA6E50] hover:bg-[#A85A3D] disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  {submittedFeedback ? 'Feedback Received!' : 'Submit Founder Feedback'}
                </button>
              </div>
            </form>

            {/* List of Previous Feedbacks */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A7067]">
                Recent Customer Review Log ({feedbacks.length}):
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {feedbacks.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-xl border border-[#E8DFD5] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#88452D]">{item.categoryInterest}</span>
                      <span className="text-[#7A7067] font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-[#5C524A] leading-relaxed">{item.comment}</p>
                    <div className="text-[10px] text-[#65745E] font-medium pt-0.5">
                      Purchase Intent: {item.wouldBuy === 'definitely' ? '✅ Definitely Would Buy' : item.wouldBuy === 'maybe' ? '⚠️ Maybe, with tweaks' : '❌ Unlikely'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FAF4F0] border-t border-[#E8DFD5] p-4 px-6 flex items-center justify-between text-xs text-[#7A7067]">
          <div className="flex items-center gap-1.5 text-[#88452D]">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Market Validation Mode: Live Metrics</span>
          </div>

          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-white hover:bg-[#FAF7F2] text-[#231E1B] border border-[#E8DFD5] rounded-md font-semibold cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
