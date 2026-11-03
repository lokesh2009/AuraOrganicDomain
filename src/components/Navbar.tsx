import React from 'react';
import { ShoppingBag, Sparkles, BookOpen, TrendingUp, Clock, ShieldCheck, Phone, LogIn } from 'lucide-react';
import { AuthUser } from '../types';

interface NavbarProps {
  cartCount: number;
  loyaltyPoints: number;
  authUser: AuthUser | null;
  onOpenCart: () => void;
  onOpenQuiz: () => void;
  onOpenGlossary: () => void;
  onOpenAuthModal: (tab?: 'google' | 'phone' | 'admin') => void;
  onOpenUserProfile: () => void;
  onOpenAdminConsole: () => void;
  onOpenDosageConsultation: () => void;
  onOpenValidationModal: () => void;
  onOpenNafishaChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  loyaltyPoints,
  authUser,
  onOpenCart,
  onOpenQuiz,
  onOpenGlossary,
  onOpenAuthModal,
  onOpenUserProfile,
  onOpenAdminConsole,
  onOpenDosageConsultation,
  onOpenValidationModal,
  onOpenNafishaChat,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5]">
      {/* Admin Top Alert Bar if signed in as Admin */}
      {authUser?.role === 'admin' && (
        <div className="bg-[#231E1B] text-white px-4 py-1.5 text-xs flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-stone-300">
                Apothecary Administrator Mode Active (<strong className="text-white">{authUser.email}</strong>)
              </span>
            </div>
            <button
              onClick={onOpenAdminConsole}
              className="text-[11px] font-semibold text-[#EAD3C6] hover:text-white underline cursor-pointer"
            >
              Open Admin Console &rarr;
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-2xl font-serif tracking-tight text-[#231E1B] hover:text-[#BA6E50] transition-colors whitespace-nowrap shrink-0"
        >
          Aura Organic
        </a>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-[#5C524A]">
          <a
            href="#shop"
            className="hover:text-[#BA6E50] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#BA6E50]"
          >
            Apothecary Shop
          </a>
          <a
            href="#shop"
            className="text-[#3A4936] hover:text-[#2B3528] font-semibold transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#3A4936]"
          >
            🌿 Organic Powders
          </a>
          <button
            onClick={onOpenDosageConsultation}
            className="flex items-center gap-1.5 text-[#88452D] hover:text-[#BA6E50] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#BA6E50] text-left cursor-pointer font-semibold"
          >
            <Clock className="w-3.5 h-3.5 text-[#BA6E50]" />
            Timing & Dosage Rx
          </button>
          {onOpenNafishaChat && (
            <button
              onClick={onOpenNafishaChat}
              className="flex items-center gap-1.5 text-[#BA6E50] hover:text-[#88452D] font-bold transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#BA6E50] text-left cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
              Ask Nafisha (AI)
            </button>
          )}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 hover:text-[#BA6E50] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#BA6E50] text-left cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
            Routine Finder
          </button>
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 hover:text-[#BA6E50] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#BA6E50] text-left cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#BA6E50]" />
            Botanicals
          </button>
          <button
            onClick={onOpenValidationModal}
            className="flex items-center gap-1.5 text-xs text-[#65745E] hover:text-[#231E1B] bg-[#EFE9DF] hover:bg-[#E5DDCF] px-2.5 py-1 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono font-medium"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#BA6E50]" />
            Market Trial
          </button>
          {authUser?.role === 'admin' ? (
            <button
              onClick={onOpenAdminConsole}
              className="flex items-center gap-1 text-xs text-white bg-[#88452D] hover:bg-[#6D3623] px-2.5 py-1 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer font-bold shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAD3C6]" />
              Admin
            </button>
          ) : (
            <button
              onClick={() => onOpenAuthModal('admin')}
              title="Apothecary Staff & Admin Login"
              className="text-xs text-[#7A7067] hover:text-[#231E1B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin Portal
            </button>
          )}
        </nav>

        {/* Zone 3: SSO Authentication & Bag Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Mobile Quick Nafisha button */}
          {onOpenNafishaChat && (
            <button
              onClick={onOpenNafishaChat}
              title="Ask Nafisha AI Assistant"
              className="lg:hidden p-2 text-[#BA6E50] bg-[#FAF4F0] hover:bg-[#F3E6DF] border border-[#D8B19C] rounded-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
            </button>
          )}

          {/* Mobile Quick Consultation button */}
          <button
            onClick={onOpenDosageConsultation}
            title="Prescribe Timing & Dose"
            className="lg:hidden p-2 text-[#88452D] bg-[#F4EFE7] hover:bg-[#EAE2D5] border border-[#E8DFD5] rounded-md transition-colors cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#BA6E50]" />
          </button>

          {/* SSO Auth or User Hub Trigger (Replaces old dummy Account button) */}
          {!authUser ? (
            <button
              onClick={() => onOpenAuthModal('google')}
              aria-label="SSO Login with Gmail, Phone or Admin"
              className="flex items-center gap-2 px-2.5 sm:px-3 py-2 text-xs font-semibold text-[#231E1B] bg-white hover:bg-[#F4EFE7] border border-[#D8B19C] rounded-lg transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center -space-x-1 shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 flex items-center justify-center border border-white">
                  <Phone className="w-2 h-2 text-emerald-700" />
                </div>
              </div>
              <span className="whitespace-nowrap font-medium text-[#88452D]">SSO Login</span>
            </button>
          ) : authUser.role === 'admin' ? (
            <button
              onClick={onOpenAdminConsole}
              aria-label="Admin Apothecary Console"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[#88452D] hover:bg-[#6D3623] rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#EAD3C6]" />
              <span className="hidden sm:inline">Admin</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-[#231E1B] rounded text-[9px] font-black uppercase">
                Console
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenUserProfile}
              aria-label={`User profile for ${authUser.name}`}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 text-xs text-[#231E1B] bg-white hover:bg-[#FAF7F2] border border-[#E8DFD5] rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {authUser.avatar ? (
                <img src={authUser.avatar} alt="" className="w-5 h-5 rounded-full object-cover border border-[#E8DFD5]" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#88452D] text-white flex items-center justify-center font-bold text-[10px]">
                  {authUser.name.charAt(0)}
                </div>
              )}
              <span className="hidden sm:inline font-semibold max-w-[90px] truncate">{authUser.name}</span>
              <span className="font-mono tabular-nums text-[11px] font-bold text-[#88452D]">
                {authUser.loyaltyPoints.toLocaleString()}p
              </span>
            </button>
          )}

          {/* Bag Drawer Trigger */}
          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${cartCount} items`}
            className="group flex items-center gap-2 px-3 sm:px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] bg-[#BA6E50] hover:bg-[#A85A3D] rounded-md transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span className="hidden xs:inline whitespace-nowrap">Bag</span>
            <span className="font-mono tabular-nums px-1.5 py-0.2 bg-[#88452D] rounded text-[11px]">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
