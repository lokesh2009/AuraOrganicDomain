import { useState, useEffect } from 'react';
import { Product, CartItem, SubscriptionCadence, PastOrder, LoyaltyTransaction, AuthUser } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SourcingRibbon } from './components/SourcingRibbon';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { RitualQuizModal } from './components/RitualQuizModal';
import { BotanicalGlossaryModal } from './components/BotanicalGlossaryModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { DosageConsultationModal } from './components/DosageConsultationModal';
import { FounderValidationModal } from './components/FounderValidationModal';
import { NafishaChatbot } from './components/NafishaChatbot';
import { PhilosophySection } from './components/PhilosophySection';
import { Footer } from './components/Footer';

export default function App() {
  // Cart state with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aura_organic_cart');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  // Loyalty points state (starts with 1,280 points from past purchases)
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('aura_loyalty_points');
      if (saved) return Number(saved);
    } catch {
      // Fallback
    }
    return 1280;
  });

  // Past Orders history
  const [pastOrders, setPastOrders] = useState<PastOrder[]>(() => {
    try {
      const saved = localStorage.getItem('aura_past_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'AURA-892401',
        date: 'Oct 14, 2026',
        itemsSummary: 'Daily Ritual Box (Five Powerful Rituals Set) (x1)',
        total: 2499,
        pointsEarned: 250,
        status: 'Delivered',
      },
      {
        id: 'AURA-719302',
        date: 'Sep 02, 2026',
        itemsSummary: 'Himalayan Shilajit Resin 10g (x1)',
        total: 999,
        pointsEarned: 100,
        status: 'Delivered',
      },
      {
        id: 'AURA-604192',
        date: 'Jul 19, 2026',
        itemsSummary: 'Haldi Turmeric Powder 200g (x1), Premium Isabgol 200g (x1)',
        total: 748,
        pointsEarned: 75,
        status: 'Delivered',
      },
    ];
  });

  // Loyalty points transactions history
  const [loyaltyHistory, setLoyaltyHistory] = useState<LoyaltyTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('aura_loyalty_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'txn-1',
        date: 'Oct 14, 2026',
        description: 'Earned on Order #AURA-892401',
        orderId: 'AURA-892401',
        amountSpent: 2499,
        points: 250,
        type: 'earned',
      },
      {
        id: 'txn-2',
        date: 'Sep 02, 2026',
        description: 'Earned on Order #AURA-719302',
        orderId: 'AURA-719302',
        amountSpent: 999,
        points: 100,
        type: 'earned',
      },
      {
        id: 'txn-3',
        date: 'Aug 10, 2026',
        description: 'Redeemed ₹50 Botanical Voucher',
        points: -500,
        type: 'redeemed',
      },
      {
        id: 'txn-4',
        date: 'Jul 19, 2026',
        description: 'Earned on Order #AURA-604192',
        orderId: 'AURA-604192',
        amountSpent: 748,
        points: 75,
        type: 'earned',
      },
      {
        id: 'txn-5',
        date: 'Jun 01, 2026',
        description: 'Welcome Bonus · Aura Herbal Circle Registration',
        points: 1355,
        type: 'earned',
      },
    ];
  });

  // Hit-and-run Market Validation: Product Likes & Walkthroughs
  const [productLikes, setProductLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('aura_product_likes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    const initial: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = p.likesCount || 100;
    });
    return initial;
  });

  const [userLikedIds, setUserLikedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('aura_user_liked_ids');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // Fallback
    }
    return new Set<string>();
  });

  const [productWalkthroughs, setProductWalkthroughs] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('aura_product_walkthroughs');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    const initial: Record<string, number> = {};
    PRODUCTS.forEach((p) => {
      initial[p.id] = p.walkthroughsCount || 500;
    });
    return initial;
  });

  // Modal visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [glossaryInitialSearch, setGlossaryInitialSearch] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // SSO Authentication & Profile states (Replaces old dummy Account)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('aura_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'google' | 'phone' | 'admin'>('google');
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);

  // New Modals: Dosage Consultation & Founder Demand Validation
  const [isDosageConsultationOpen, setIsDosageConsultationOpen] = useState(false);
  const [consultationProduct, setConsultationProduct] = useState<Product | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [activeConcernFilter, setActiveConcernFilter] = useState<string | null>(null);

  // Nafisha Ayurvedic AI Chatbot Assistant
  const [isNafishaOpen, setIsNafishaOpen] = useState(false);
  const [nafishaInitialQuestion, setNafishaInitialQuestion] = useState<string | undefined>(undefined);

  const handleOpenNafishaChat = (question?: string) => {
    setNafishaInitialQuestion(question);
    setIsNafishaOpen(true);
  };

  // AI Chat Pop up After site loaded successfully
  useEffect(() => {
    const hasPopped = sessionStorage.getItem('aura_nafisha_chat_auto_popped');
    if (!hasPopped) {
      const timer = setTimeout(() => {
        setIsNafishaOpen(true);
        sessionStorage.setItem('aura_nafisha_chat_auto_popped', 'true');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync authUser to localStorage
  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem('aura_auth_user', JSON.stringify(authUser));
      } else {
        localStorage.removeItem('aura_auth_user');
      }
    } catch {}
  }, [authUser]);

  const handleOpenAuthModal = (tab: 'google' | 'phone' | 'admin' = 'google') => {
    setAuthModalInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    const userWithCurrentPoints = {
      ...user,
      loyaltyPoints: loyaltyPoints,
    };
    setAuthUser(userWithCurrentPoints);
    if (user.role === 'admin') {
      setIsAdminConsoleOpen(true);
    }
  };

  const handleSignOut = () => {
    setAuthUser(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Delivered' | 'In Transit' | 'Processing') => {
    setPastOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleToggleProductStock = (productId: string) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  };

  // Promo code
  const [appliedPromo, setAppliedPromo] = useState('');

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_organic_cart', JSON.stringify(cartItems));
      localStorage.setItem('aura_loyalty_points', String(loyaltyPoints));
      localStorage.setItem('aura_past_orders', JSON.stringify(pastOrders));
      localStorage.setItem('aura_loyalty_history', JSON.stringify(loyaltyHistory));
      localStorage.setItem('aura_product_likes', JSON.stringify(productLikes));
      localStorage.setItem('aura_user_liked_ids', JSON.stringify(Array.from(userLikedIds)));
      localStorage.setItem('aura_product_walkthroughs', JSON.stringify(productWalkthroughs));
    } catch {
      // Ignore storage errors
    }
  }, [cartItems, loyaltyPoints, pastOrders, loyaltyHistory, productLikes, userLikedIds, productWalkthroughs]);

  // Market Validation Handlers
  const handleLikeToggle = (productId: string) => {
    setUserLikedIds((prev) => {
      const next = new Set(prev);
      const isCurrentlyLiked = next.has(productId);
      if (isCurrentlyLiked) {
        next.delete(productId);
        setProductLikes((l) => ({ ...l, [productId]: Math.max(0, (l[productId] || 1) - 1) }));
      } else {
        next.add(productId);
        setProductLikes((l) => ({ ...l, [productId]: (l[productId] || 0) + 1 }));
      }
      return next;
    });
  };

  const recordWalkthrough = (productId: string) => {
    setProductWalkthroughs((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleOpenQuickView = (product: Product) => {
    recordWalkthrough(product.id);
    setQuickViewProduct(product);
  };

  const handleOpenConsultation = (product?: Product) => {
    if (product) {
      recordWalkthrough(product.id);
      setConsultationProduct(product);
    } else {
      setConsultationProduct(null);
    }
    setIsDosageConsultationOpen(true);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    isSubscription: boolean = false,
    cadence: SubscriptionCadence = 4,
    quantity: number = 1
  ) => {
    recordWalkthrough(product.id);
    setCartItems((prevItems) => {
      const uniqueId = `${product.id}-${isSubscription ? `sub-${cadence}` : 'onetime'}`;
      const existing = prevItems.find((item) => item.id === uniqueId);
      if (existing) {
        return prevItems.map((item) =>
          item.id === uniqueId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prevItems,
        {
          id: uniqueId,
          product,
          quantity,
          isSubscription,
          cadenceWeeks: cadence,
        },
      ];
    });
  };

  const handleAddBundleToCart = (products: Product[]) => {
    products.forEach((product) => {
      recordWalkthrough(product.id);
      handleAddToCart(product, false, 4, 1);
    });
    if (!appliedPromo) {
      setAppliedPromo('AURA15');
    }
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedPromo('');
  };

  const handleApplyPromo = (code: string): boolean => {
    const validCodes = ['AURA15', 'ORGANIC10', 'POINTS50', 'POINTS100', 'POINTS5', 'POINTS10', 'WOODENSPOON'];
    if (validCodes.includes(code)) {
      setAppliedPromo(code);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo('');
  };

  // Redeem Loyalty Reward
  const handleRedeemReward = (pointsCost: number, code: string, rewardName: string): boolean => {
    if (loyaltyPoints < pointsCost) return false;
    
    setLoyaltyPoints((prev) => prev - pointsCost);
    const newTxn: LoyaltyTransaction = {
      id: `txn-${Date.now()}`,
      date: 'Today',
      description: `Redeemed ${rewardName}`,
      points: -pointsCost,
      type: 'redeemed',
    };
    setLoyaltyHistory((prev) => [newTxn, ...prev]);
    // Auto apply to bag
    setAppliedPromo(code);
    return true;
  };

  // Order completed handler: awards points and updates history
  const handleOrderCompleted = (newOrder: PastOrder) => {
    setPastOrders((prev) => [newOrder, ...prev]);
    setLoyaltyPoints((prev) => prev + newOrder.pointsEarned);
    const newTxn: LoyaltyTransaction = {
      id: `txn-${Date.now()}`,
      date: 'Today',
      description: `Earned on Order #${newOrder.id}`,
      orderId: newOrder.id,
      amountSpent: newOrder.total,
      points: newOrder.pointsEarned,
      type: 'earned',
    };
    setLoyaltyHistory((prev) => [newTxn, ...prev]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleOpenGlossaryForBotanical = (botanicalName: string) => {
    setGlossaryInitialSearch(botanicalName);
    setQuickViewProduct(null);
    setIsGlossaryOpen(true);
  };

  const handleSelectProductFromGlossary = (product: Product) => {
    setIsGlossaryOpen(false);
    handleOpenQuickView(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231E1B] antialiased selection:bg-[#EAD3C6] selection:text-[#88452D]">
      {/* 3-Zone Top Bar with Loyalty Points preview, Rx Timing & Market Trial triggers */}
      <Navbar
        cartCount={totalCartCount}
        loyaltyPoints={loyaltyPoints}
        authUser={authUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenGlossary={() => {
          setGlossaryInitialSearch('');
          setIsGlossaryOpen(true);
        }}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onOpenDosageConsultation={() => handleOpenConsultation()}
        onOpenValidationModal={() => setIsValidationModalOpen(true)}
        onOpenNafishaChat={() => handleOpenNafishaChat()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Campaign Hero Section with Shop by Concern Quick Links */}
        <Hero
          onExploreShop={() => {
            const el = document.getElementById('shop');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onSelectConcern={(concernId) => {
            setActiveConcernFilter(concernId);
            const el = document.getElementById('shop');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 4 Pillars of Ayurvedic Purity */}
        <SourcingRibbon />

        {/* Product Catalog with Resins, Powders, Boxes, Best Times, and Live Likes */}
        <ProductCatalog
          products={catalogProducts}
          activeConcernFilter={activeConcernFilter}
          onClearConcernFilter={() => setActiveConcernFilter(null)}
          onQuickView={handleOpenQuickView}
          onAddToCart={(p, isSub) => handleAddToCart(p, isSub, 4, 1)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenDosageConsultation={handleOpenConsultation}
          onOpenValidationModal={() => setIsValidationModalOpen(true)}
          onOpenNafishaChat={handleOpenNafishaChat}
          productLikes={productLikes}
          userLikedIds={userLikedIds}
          onLikeToggle={handleLikeToggle}
        />

        {/* Philosophy & Traditional Craftsmanship */}
        <PhilosophySection />
      </main>

      {/* Editorial Footer */}
      <Footer
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenGlossary={() => {
          setGlossaryInitialSearch('');
          setIsGlossaryOpen(true);
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Product Quick-View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(product, isSub, cadence, qty) => {
          handleAddToCart(product, isSub, cadence, qty);
          setIsCartOpen(true);
        }}
        onOpenGlossaryForBotanical={handleOpenGlossaryForBotanical}
        onOpenDosageConsultation={handleOpenConsultation}
        onAskNafisha={handleOpenNafishaChat}
        likesCount={quickViewProduct ? (productLikes[quickViewProduct.id] || 0) : 0}
        walkthroughsCount={quickViewProduct ? (productWalkthroughs[quickViewProduct.id] || 0) : 0}
        isLiked={quickViewProduct ? userLikedIds.has(quickViewProduct.id) : false}
        onLikeToggle={handleLikeToggle}
      />

      {/* Personalized Timing & Dosage Consultation Modal */}
      <DosageConsultationModal
        isOpen={isDosageConsultationOpen}
        onClose={() => setIsDosageConsultationOpen(false)}
        initialProduct={consultationProduct}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Founder Hit-and-Run Market Validation & Analytics Dashboard */}
      <FounderValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        productLikes={productLikes}
        productWalkthroughs={productWalkthroughs}
        onLikeProduct={handleLikeToggle}
      />

      {/* Personalized Wellness Ritual Quiz Modal */}
      <RitualQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddBundleToCart={handleAddBundleToCart}
      />

      {/* Botanical Sourcing & Pharmacognosy Glossary Modal */}
      <BotanicalGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onSelectProduct={handleSelectProductFromGlossary}
        initialBotanicalSearch={glossaryInitialSearch}
      />

      {/* Multi-Step Checkout Modal with Points Earning */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        appliedPromo={appliedPromo}
        onClearCart={handleClearCart}
        onOrderCompleted={handleOrderCompleted}
        onOpenAccount={() => (authUser ? setIsUserProfileOpen(true) : handleOpenAuthModal('google'))}
      />

      {/* SSO Authentication Modal (Gmail SSO, Phone OTP, Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authModalInitialTab}
      />

      {/* Authenticated Customer Wellness Profile & Points Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={authUser}
        orders={pastOrders}
        loyaltyHistory={loyaltyHistory}
        onRedeemReward={handleRedeemReward}
        onSignOut={handleSignOut}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
      />

      {/* Apothecary Admin Management Console */}
      <AdminConsoleModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        adminUser={authUser}
        orders={pastOrders}
        products={catalogProducts}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onToggleProductStock={handleToggleProductStock}
        onSignOut={handleSignOut}
      />

      {/* Nafisha Ayurvedic AI Botanical Guide Chatbot */}
      <NafishaChatbot
        isOpen={isNafishaOpen}
        onClose={() => setIsNafishaOpen(false)}
        onOpen={() => handleOpenNafishaChat()}
        onQuickView={(product) => setQuickViewProduct(product)}
        onAddToCart={(product) => {
          handleAddToCart(product, false, 4, 1);
          setIsCartOpen(true);
        }}
        initialQuestion={nafishaInitialQuestion}
      />
    </div>
  );
}
