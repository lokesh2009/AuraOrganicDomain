import React, { useState } from 'react';
import { AuthUser, PastOrder, Product } from '../types';
import { 
  X, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  Truck, 
  Users, 
  AlertTriangle, 
  Check, 
  ExternalLink, 
  Clock, 
  DollarSign, 
  LogOut,
  RefreshCw,
  Search
} from 'lucide-react';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminUser: AuthUser | null;
  orders: PastOrder[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: 'Delivered' | 'In Transit' | 'Processing') => void;
  onToggleProductStock: (productId: string) => void;
  onSignOut: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({
  isOpen,
  onClose,
  adminUser,
  orders,
  products,
  onUpdateOrderStatus,
  onToggleProductStock,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'Processing' | 'In Transit' | 'Delivered'>('all');

  if (!isOpen || !adminUser) return null;

  // Calculate live analytics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Processing' || o.status === 'In Transit');
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
                          o.itemsSummary.toLowerCase().includes(orderSearchQuery.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'all' || o.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="bg-[#231E1B] text-white px-6 py-4 flex items-center justify-between border-b border-[#3D3531]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#88452D] text-white flex items-center justify-center border border-white/10 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#EAD3C6]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-medium text-white tracking-tight">
                  Aura Apothecary Master Console
                </h3>
                <span className="px-2 py-0.5 bg-[#88452D] text-white rounded text-[10px] font-bold uppercase tracking-wider">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-[#A89F91]">
                Signed in as <strong className="text-white">{adminUser.email || 'admin@auraorganic.in'}</strong> ({adminUser.adminTitle || 'Store Lead'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close admin modal"
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E8DFD5] bg-[#F4EFE7]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#BA6E50] text-[#88452D] bg-[#FAF7F2]'
                : 'border-transparent text-[#7A7067] hover:text-[#231E1B]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Store Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'orders'
                ? 'border-[#BA6E50] text-[#88452D] bg-[#FAF7F2]'
                : 'border-transparent text-[#7A7067] hover:text-[#231E1B]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Order Fulfillment ({orders.length})</span>
            {pendingOrders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#88452D] text-white rounded-full text-[10px]">
                {pendingOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors cursor-pointer flex items-center gap-1.5 border-b-2 ${
              activeTab === 'inventory'
                ? 'border-[#BA6E50] text-[#88452D] bg-[#FAF7F2]'
                : 'border-transparent text-[#7A7067] hover:text-[#231E1B]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Botanical Inventory ({products.length})</span>
            {outOfStockCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-600 text-white rounded-full text-[10px]">
                {outOfStockCount} low
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#7A7067]">
                    <span>Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#231E1B]">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    +18.4% vs last week · Live session
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#7A7067]">
                    <span>Active Orders</span>
                    <Truck className="w-4 h-4 text-[#BA6E50]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#231E1B]">
                    {orders.length} orders
                  </div>
                  <span className="text-[11px] text-[#88452D] font-medium">
                    {pendingOrders.length} pending dispatch
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#7A7067]">
                    <span>SSO Customers</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#231E1B]">
                    142 members
                  </div>
                  <span className="text-[11px] text-blue-700 font-medium">
                    Gmail & Phone verified
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#E8DFD5] shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#7A7067]">
                    <span>Stock Status</span>
                    <Package className="w-4 h-4 text-[#65745E]" />
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#231E1B]">
                    {products.length - outOfStockCount} in stock
                  </div>
                  <span className="text-[11px] text-[#65745E] font-medium">
                    All lab certificates current
                  </span>
                </div>
              </div>

              {/* Quick Actions & Live Order Preview */}
              <div className="bg-white rounded-xl border border-[#E8DFD5] p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-semibold text-[#231E1B]">
                    Recent Customer Orders Requiring Attention
                  </h4>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#88452D] hover:underline font-semibold cursor-pointer"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="divide-y divide-[#E8DFD5]">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#231E1B]">{o.id}</span>
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
                        <p className="text-xs text-[#5C524A] mt-0.5">{o.itemsSummary}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-xs text-[#231E1B]">₹{o.total}</span>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                          className="text-xs bg-[#FAF7F2] border border-[#E8DFD5] rounded-md px-2 py-1 font-medium cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-[#7A7067] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order ID or item..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E8DFD5] rounded-lg text-xs text-[#231E1B] focus:outline-hidden focus:border-[#BA6E50]"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[#7A7067] font-medium">Status:</span>
                  {(['all', 'Processing', 'In Transit', 'Delivered'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-md capitalize transition-colors cursor-pointer ${
                        selectedStatusFilter === st
                          ? 'bg-[#88452D] text-white font-semibold'
                          : 'bg-white border border-[#E8DFD5] text-[#5C524A] hover:bg-[#F4EFE7]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Table */}
              <div className="bg-white rounded-xl border border-[#E8DFD5] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EFE7] text-[#7A7067] font-semibold border-b border-[#E8DFD5]">
                    <tr>
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-4">Items Summary</th>
                      <th className="py-3 px-4">Total & Points</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DFD5]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#7A7067]">
                          No orders matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-4 align-top">
                            <span className="font-mono font-bold text-[#231E1B] block">{order.id}</span>
                            <span className="text-[11px] text-[#7A7067]">{order.date}</span>
                          </td>
                          <td className="py-3 px-4 align-top max-w-xs text-[#5C524A] leading-relaxed">
                            {order.itemsSummary}
                          </td>
                          <td className="py-3 px-4 align-top whitespace-nowrap">
                            <span className="font-bold text-[#231E1B] block">₹{order.total}</span>
                            <span className="text-[10px] text-[#88452D]">+{order.pointsEarned} pts awarded</span>
                          </td>
                          <td className="py-3 px-4 align-top">
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              order.status === 'Delivered' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : order.status === 'In Transit'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 align-top text-right whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                              className="text-[11px] bg-[#FAF7F2] border border-[#E8DFD5] rounded px-2 py-1 font-medium cursor-pointer"
                            >
                              <option value="Processing">Processing</option>
                              <option value="In Transit">In Transit</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-[#231E1B]">
                    Aura & Himalayan Organics Catalog Control
                  </h4>
                  <p className="text-xs text-[#7A7067]">
                    Toggle stock availability in real time across the apothecary store.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {products.map((p) => (
                  <div key={p.id} className="p-3.5 bg-white rounded-xl border border-[#E8DFD5] shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-[#E8DFD5]" 
                      />
                      <div>
                        <h5 className="text-xs font-bold text-[#231E1B] line-clamp-1">{p.name}</h5>
                        <span className="text-[11px] text-[#7A7067] font-mono">₹{p.price} · {p.volumeOrWeight}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {p.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleProductStock(p.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        p.inStock
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          : 'bg-[#88452D] hover:bg-[#6D3623] text-white'
                      }`}
                    >
                      {p.inStock ? 'Mark Out of Stock' : 'Restock Item'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
