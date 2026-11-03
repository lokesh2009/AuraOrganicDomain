import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

interface FooterProps {
  onOpenQuiz: () => void;
  onOpenGlossary: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenQuiz, onOpenGlossary }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 2000);
    }
  };

  return (
    <footer className="bg-[#231E1B] text-[#FAF7F2] pt-16 pb-12 border-t border-[#3E3530]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-2xl font-serif tracking-tight text-[#FAF7F2]">
              Aura Organic
            </span>
            <p className="text-xs text-[#B3A69A] leading-relaxed max-w-sm">
              Certified organic herbal tisanes, wildcrafted adaptogenic superfoods, and sublingual plant medicine formulated to align modern nervous systems with ancestral rhythms.
            </p>
            <div className="text-xs text-[#8A7E73] space-y-1 pt-2">
              <div>Apothecary Dispensary & Botanical Labs</div>
              <div>Bengaluru & Nilgiris Highlands · India</div>
            </div>
          </div>

          {/* Nav Links Column 1 */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#BA6E50]">
              The Dispensary
            </span>
            <ul className="space-y-2 text-xs text-[#B3A69A]">
              <li>
                <a href="#shop" className="hover:text-[#FAF7F2] transition-colors">
                  Herbal Tisanes
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-[#FAF7F2] transition-colors">
                  Botanical Tinctures
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-[#FAF7F2] transition-colors">
                  Adaptogen Superfoods
                </a>
              </li>
              <li>
                <a href="#shop" className="text-[#8FB384] hover:text-[#FAF7F2] font-medium transition-colors">
                  🌿 Himalayan Organic Powders
                </a>
              </li>
              <li>
                <button onClick={onOpenQuiz} className="hover:text-[#FAF7F2] transition-colors text-left cursor-pointer">
                  Ritual Consultation
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 2 */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#BA6E50]">
              Knowledge
            </span>
            <ul className="space-y-2 text-xs text-[#B3A69A]">
              <li>
                <button onClick={onOpenGlossary} className="hover:text-[#FAF7F2] transition-colors text-left cursor-pointer">
                  Botanical Glossary
                </button>
              </li>
              <li>
                <a href="#sourcing" className="hover:text-[#FAF7F2] transition-colors">
                  Micro-Farm Sourcing
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-[#FAF7F2] transition-colors">
                  Our Whole-Herb Standard
                </a>
              </li>
              <li>
                <span className="text-[#8A7E73]">Third-Party Lab COAs</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-xs uppercase font-mono tracking-wider text-[#BA6E50]">
              The Solstice Gazette
            </span>
            <p className="text-xs text-[#B3A69A]">
              Seasonal harvest bulletins, lunar planting calendar notes, and early batch reserves.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3 py-2 text-xs bg-[#2F2925] border border-[#4A3F39] rounded text-[#FAF7F2] placeholder-[#8A7E73] focus:outline-none focus:border-[#BA6E50]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#BA6E50] hover:bg-[#A85A3D] text-[#FAF7F2] rounded transition-all cursor-pointer whitespace-nowrap"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Join'}
                </button>
              </div>
              {subscribed && (
                <div className="text-[11px] text-[#65745E]">
                  Welcome to the circle. Check your inbox for your 10% welcome token.
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Unboxed Regulatory Notes */}
        <div className="pt-8 border-t border-[#3E3530] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-[#8A7E73]">
          <div>
            © {new Date().getFullYear()} Aura Organic LLC. All rights reserved. Single-origin biodynamic apothecary.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Terms of Service</span>
            <span>·</span>
            <span>FDA Herbal Disclaimer</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
