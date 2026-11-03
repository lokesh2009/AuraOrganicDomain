import React from 'react';
import { Sprout, Sun, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';

export const SourcingRibbon: React.FC = () => {
  const pillars = [
    {
      icon: Sprout,
      title: 'Biodynamic & Single-Origin',
      benefit: 'High-altitude soil potency with intact enzymes',
    },
    {
      icon: Sun,
      title: 'Sub-40°C Low Heat Drying',
      benefit: 'Protects fragile flavonoids, curcuminoids & withanolides',
    },
    {
      icon: ShieldCheck,
      title: '100% Zero-Additive Guarantee',
      benefit: 'No silicon dioxide, maltodextrin, or synthetic binders',
    },
    {
      icon: Truck,
      title: 'Direct Fast Dispatch in India',
      benefit: 'UV-blocking amber glass packaging • Free over ₹999',
    },
  ];

  return (
    <section id="sourcing" className="bg-[#5B2F21] text-[#FAF7F2] py-4 border-b border-[#442217]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-center">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-[#FAF7F2]/10 shrink-0 text-[#D8B19C] mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-semibold text-[#FAF7F2] flex items-center gap-1">
                    <span>{pillar.title}</span>
                  </h3>
                  <p className="text-[11px] text-[#E6CEBF] leading-tight line-clamp-1">
                    {pillar.benefit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
