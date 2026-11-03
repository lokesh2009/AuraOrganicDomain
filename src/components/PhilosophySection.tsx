import React, { useState } from 'react';
import { Check, X, ShieldCheck, Sparkles, Award, Leaf } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const [showFullGuildStory, setShowFullGuildStory] = useState(false);

  const comparisons = [
    {
      feature: 'Origin & Altitude',
      aura: '16,000+ ft Wild Himalayan rock faces & certified biodynamic soils',
      auraHighlight: 'Maximum trace mineral and fulvic density',
      ordinary: 'Lowland mass farms or industrial chemical synthesizers',
    },
    {
      feature: 'Drying & Processing Temp',
      aura: 'Sub-40°C Surya-Tapi solar shade curing',
      auraHighlight: '100% intact heat-sensitive flavonoids & enzymes',
      ordinary: 'High-heat ovens (80°C+) that destroy active withanolides',
    },
    {
      feature: 'Additives & Binders',
      aura: '100% Pure Botanical — zero flowing agents or silicon dioxide',
      auraHighlight: 'Clean gut absorption with zero cramps',
      ordinary: 'Microcrystalline cellulose, artificial talc, maltodextrin',
    },
    {
      feature: 'Active Compound Potency',
      aura: '>75% Bioactive Fulvic Acid & >6% Curcuminoids lab verified',
      auraHighlight: 'Feelable results in 7 to 14 days',
      ordinary: 'Unstandardized ground roots or bleached waste husks',
    },
    {
      feature: 'Bio-Vehicle & Clock Timing',
      aura: 'Personalized Dinacharya Rx (warm spiced milk or lukewarm water)',
      auraHighlight: 'Triples systemic cellular bioavailability',
      ordinary: 'Generic "take with water" without absorption synergy',
    },
  ];

  return (
    <section id="philosophy" className="py-10 sm:py-14 bg-[#F4EFE7] border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#A85A3D] flex items-center justify-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>The Aura Organic Difference</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#231E1B]">
            Why Our Formulations Deliver Real Results
          </h2>
          <p className="text-xs sm:text-sm text-[#5C524A]">
            Comparing Aura Organic with ordinary commercial wellness brands: see exactly why pure extraction, solar curing, and sacred timing make the difference.
          </p>
        </div>

        {/* D2C Benefit Comparison Table (Bella Vita & Blue Tea Benchmark) */}
        <div className="bg-white rounded-2xl border border-[#E8DFD5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E8DFD5] bg-[#FAF7F2]">
                  <th className="py-3.5 px-4 sm:px-6 text-xs font-mono uppercase font-bold text-[#7A7067] w-1/3">
                    Quality Standard
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-xs font-mono uppercase font-bold text-[#88452D] bg-[#F4EFE7]/60 w-1/3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
                      <span>Aura Organic</span>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-xs font-mono uppercase font-bold text-[#8A7E73] w-1/3">
                    Ordinary Market Brands
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD5] text-xs">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F2]/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#231E1B]">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 bg-[#FAF7F2]/60 text-[#231E1B]">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#505D4A] shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">{row.aura}</div>
                          <div className="text-[11px] text-[#88452D] font-semibold mt-0.5">
                            ★ {row.auraHighlight}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#7A7067]">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-[#A85A3D] shrink-0 mt-0.5 opacity-60" />
                        <span>{row.ordinary}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible Guild Story to keep page compact */}
        <div className="text-center">
          <button
            onClick={() => setShowFullGuildStory(!showFullGuildStory)}
            className="text-xs text-[#88452D] hover:text-[#BA6E50] font-medium underline cursor-pointer"
          >
            {showFullGuildStory ? 'Hide Botanical Guild Story' : 'Read Our Living Soil & Moon Phase Harvesting Story →'}
          </button>

          {showFullGuildStory && (
            <div className="mt-4 p-5 bg-white rounded-xl border border-[#E8DFD5] text-xs text-[#5C524A] max-w-2xl mx-auto text-left space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-[#88452D] font-serif font-semibold">
                <Leaf className="w-4 h-4 text-[#65745E]" />
                <span>The Herbalists Guild Heritage</span>
              </div>
              <p>
                Industrial wellness strips herbs into isolated chemicals with petroleum solvents. At Aura Organic, we practice true whole-plant maceration: whole flowers, roots, and purified resin cured under high-altitude Himalayan sun.
              </p>
              <p>
                Every batch is delivered in light-blocking amber glass to prevent photochemical oxidation, ensuring you receive the same active vitality harvested at dawn.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
