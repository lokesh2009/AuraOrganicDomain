import React, { useState } from 'react';
import { AuthUser, PastOrder, LoyaltyTransaction } from '../types';
import { 
  X, 
  Sparkles, 
  Award, 
  Gift, 
  Check, 
  PackageCheck, 
  Copy, 
  Truck, 
  LogOut, 
  User, 
  ShieldCheck, 
  Mail, 
  Phone 
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  orders: PastOrder[];
  loyaltyHistory: LoyaltyTransaction[];
  onRedeemReward: (pointsCost: number, code: string, rewardName: string) => boolean;
  onSignOut: () => void;
  onOpenAdminConsole?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  orders,
  loyaltyHistory,
  onRedeemReward,
  onSignOut,
  onOpenAdminConsole,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'loyalty' | 'rewards'>('profile');
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !user) return null;

  const rewards = [
    {
      id: 'reward-50',
      pointsCost: 500,
      code: 'POINTS50',
      name: '₹50 Off Next Botanical Order',
      description: 'Applicable on all teas, pure shilajit, and superfood powders.',
    },
    {
      id: 'reward-100',
      pointsCost: 1000,
      code: 'POINTS100',
      name: '₹100 Off Next Botanical Order',
      description: 'No minimum cart requirement. Can be paired with subscriptions.',
    },
    {
      id: 'reward-spoon',
      pointsCost: 1500,
      code: 'WOODENSPOON',
      name: 'Complimentary Olive Wood Dosing Spoon',
      description: 'Handcrafted measuring spoon calibrated for adaptogenic powders.',
    },
  ];

  const handleRedeem = (cost: number, code: string, name: string) => {
    const success = onRedeemReward(cost, code, name);
    if (success) {
      setRedeemedCode(code);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* User Identity Header */}
        <div className="bg-[#88452D] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-11 h-11 rounded-full border-2 border-white/30 bg-white/10" 
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-base border border-white/30">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium text-white tracking-tight">
                  {user.name}
                </h3>
                {user.role === 'admin' ? (
                  <span className="px-2 py-0.5 bg-amber-500 text-[#231E1B] rounded text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-500/80 text-white rounded text-[10px] font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Verified SSO</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#EAD3C6] flex items-center gap-1 mt-0.5">
                {user.method === 'google' && <Mail className="w-3.5 h-3.5" />}
                {user.method === 'phone' && <Phone className="w-3.5 h-3.5" />}
                <span>{user.email || user.phoneNumber || 'Authenticated User'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close profile"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-[#E8DFD5] bg-[#F4EFE7] text-xs font-semibold text-[#7A7067]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#BA6E50] text-[#88452D] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            Identity & Points
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'border-[#BA6E50] text-[#88452D] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            <span>My Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`py-3 px-3 transition-colors cursor-pointer border-b-2 ${
              activeTab === 'rewards'
                ? 'border-[#BA6E50] text-[#88452D] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            Redeem Vouchers
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* PROFILE & POINTS TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7A7067] tracking-wider block">
                    Aura Loyalty Balance
                  </span>
                  <div className="text-2xl font-serif font-bold text-[#88452D]">
                    {user.loyaltyPoints.toLocaleString()} pts
                  </div>
                  <p className="text-[11px] text-[#5C524A]">
                    Equivalent to ₹{Math.round(user.loyaltyPoints / 10)} store credit.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#7A7067] tracking-wider block">
                    Authentication Method
                  </span>
                  <div className="text-base font-bold text-[#231E1B] capitalize flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{user.method === 'google' ? 'Google Account SSO' : user.method === 'phone' ? 'Mobile SMS OTP' : 'Admin Credentials'}</span>
                  </div>
                  <p className="text-[11px] text-[#7A7067]">
                    Joined on {user.joinedAt}
                  </p>
                </div>
              </div>

              {/* Admin Portal Quick Access if Admin */}
              {user.role === 'admin' && onOpenAdminConsole && (
                <div className="p-4 bg-[#231E1B] text-white rounded-xl flex items-center justify-between">
                  <div>
                    <h5 className="font-serif font-semibold text-sm">Apothecary Admin Management</h5>
                    <p className="text-xs text-stone-300">Access store analytics, fulfillment, and inventory.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminConsole();
                    }}
                    className="px-3.5 py-2 bg-[#88452D] hover:bg-[#6D3623] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Launch Admin Console
                  </button>
                </div>
              )}

              {/* Sign Out Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 bg-white hover:bg-stone-100 border border-[#E8DFD5] text-stone-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-stone-500" />
                  <span>Sign Out of Aura Organic</span>
                </button>
              </div>
            </div>
          )}

          {/* MY ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#7A7067]">
                  No orders placed yet. Explore the apothecary shop to start your botanical ritual.
                </div>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-[#231E1B]">{o.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        o.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : o.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C524A] leading-relaxed">{o.itemsSummary}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-[#E8DFD5] text-xs">
                      <span className="text-[#7A7067]">{o.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#88452D] font-medium">+{o.pointsEarned} pts</span>
                        <span className="font-serif font-bold text-[#231E1B]">₹{o.total}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REDEEM VOUCHERS TAB */}
          {activeTab === 'rewards' && (
            <div className="space-y-3">
              {rewards.map((r) => {
                const canAfford = user.loyaltyPoints >= r.pointsCost;
                return (
                  <div key={r.id} className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-xs flex items-center justify-between gap-3">
                    <div>
                      <h5 className="text-xs font-bold text-[#231E1B]">{r.name}</h5>
                      <p className="text-[11px] text-[#7A7067] leading-relaxed">{r.description}</p>
                      <span className="text-[11px] font-semibold text-[#88452D] mt-1 block">
                        Cost: {r.pointsCost} points
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => handleRedeem(r.pointsCost, r.code, r.name)}
                      className="px-3 py-1.5 bg-[#BA6E50] hover:bg-[#A85A3D] text-white rounded text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {canAfford ? 'Redeem Voucher' : 'Need More Pts'}
                    </button>
                  </div>
                );
              })}

              {redeemedCode && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Voucher Code</span>
                    <span className="font-mono text-sm font-bold text-[#88452D]">{redeemedCode}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(redeemedCode)}
                    className="px-2.5 py-1 bg-[#88452D] text-white rounded text-[11px] font-semibold hover:bg-[#6D3623] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
