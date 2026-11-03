import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronRight, 
  ShoppingBag, 
  Clock, 
  Coffee, 
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import nafishaAvatarImg from '../assets/images/nafisha_botanical_guide_1793635012551.jpg';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nafisha';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

interface NafishaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialQuestion?: string;
}

const QUICK_PROMPTS = [
  '🌙 What should I take for insomnia and night anxiety?',
  '⚡ Best morning powder for stamina and brain fog?',
  '🥄 How to prepare Himalayan Shilajit with warm milk?',
  '🌿 Explain the benefits of Organic Moringa powder',
  '🥗 What helps best with chronic bloating & digestion?',
  '🎁 What is in the Daily Ritual Box?'
];

export const NafishaChatbot: React.FC<NafishaChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
  onQuickView,
  onAddToCart,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'nafisha',
      text: "Namaste! I'm Nafisha, your Ayurvedic apothecary guide & herbal wellness assistant. Whether you are seeking restorative sleep rituals, circadian timing guidance (Dinacharya), or discovering our organic Himalayan powders, I am here to help. What brings you to the dispensary today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProductIds: ['powder-golden-milk', 'ho-organic-ashwagandha', 'resin-shilajit'],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  // Local knowledge-base fallback to guarantee fast, reliable answers
  const generateLocalResponse = (query: string): { text: string; recommendedProductIds?: string[] } => {
    const q = query.toLowerCase();

    // Sleep / Insomnia / Cortisol / Night anxiety
    if (q.includes('sleep') || q.includes('insomnia') || q.includes('night') || q.includes('rest') || q.includes('bedtime')) {
      return {
        text: "**For restorative sleep and nocturnal nervous system relaxation**, I recommend our **Golden Milk Mix** or **Himalayan Organics Ashwagandha Powder**.\n\n• **Chrono-Timing**: Take 45 minutes before sleep (around 9:30 PM).\n• **Liquid Vehicle (Anupana)**: Warm A2 cow milk, oat milk, or almond milk (never boiling).\n• **Synergy Booster**: Add 1/4 tsp pure cow ghee or coconut oil; healthy fats escort the lipophilic withanolides across the blood-brain barrier to trigger natural melatonin synthesis.\n\nWould you like me to add Golden Milk or Organic Ashwagandha to your bag?",
        recommendedProductIds: ['powder-golden-milk', 'ho-organic-ashwagandha', 'box-night-ritual'],
      };
    }

    // Shilajit / Stamina / Energy / Fatigue / Morning
    if (q.includes('shilajit') || q.includes('resin') || q.includes('energy') || q.includes('stamina') || q.includes('fatigue') || q.includes('tired')) {
      return {
        text: "**For mitochondrial vitality, endurance, and clearing brain fog**, our **Himalayan Shilajit Resin (10g)** is the premier Ayurvedic Rasayana.\n\n• **Harvest**: Hand-harvested from rocky Himalayan peaks at 16,000+ ft and Surya Tapi sun-purified.\n• **Dosage**: Scoop a rice-grain to pea-sized amount (~300–400mg) using the calibrated wooden spoon.\n• **Timing & Vehicle**: Dissolve in 180ml of lukewarm water or warm milk on an empty stomach first thing in the morning.\n• **Note**: Over 75% bioactive fulvic acid and 84+ ionic trace minerals saturate depleted cells.",
        recommendedProductIds: ['resin-shilajit', 'ho-organic-plant-protein', 'powder-haldi-turmeric'],
      };
    }

    // Moringa / Greens / Superfoods
    if (q.includes('moringa') || q.includes('green') || q.includes('iron') || q.includes('leaf')) {
      return {
        text: "**Himalayan Organics Moringa Leaf Powder (250g)** is known as the 'Miracle Tree' superfood in Ayurveda:\n\n• **Nutritional Profile**: Packed with 90+ bioavailable nutrients, 46 natural antioxidants, plant iron, and vitamin C.\n• **Best Time**: Early morning with breakfast or in a 7:30 AM fasted glass of lukewarm water.\n• **Preparation Tip**: Squeeze 5 drops of fresh lemon juice into your moringa water. The natural citrus vitamin C multiplies non-heme plant iron absorption threefold!",
        recommendedProductIds: ['ho-organic-moringa', 'ho-organic-wheatgrass', 'ho-organic-spirulina'],
      };
    }

    // Digestion / Gut / Bloating / Constipation / Triphala / Isabgol
    if (q.includes('digest') || q.includes('gut') || q.includes('bloat') || q.includes('constipat') || q.includes('triphala') || q.includes('isabgol') || q.includes('stomach')) {
      return {
        text: "**For gut serenity and effortless daily regularity**, we have two synergistic allies:\n\n1. **Premium Isabgol (Psyllium Husk)**: Forms a soothing prebiotic mucilage gel. Take 1 tbsp in 250ml room-temp water at night (followed by a 2nd glass of water).\n2. **Bitter Gourd + Triphala Peel Powder**: Ignites sluggish digestive Agni (hepatic bile & pancreatic enzymes). Take 1/2 tsp in lukewarm lemon water at dawn.\n\nTogether they eliminate systemic Ama (endotoxins) without harsh laxatives.",
        recommendedProductIds: ['powder-isabgol', 'powder-bitter-gourd-triphala', 'box-seven-day'],
      };
    }

    // Wheatgrass / Detox / Alkaline
    if (q.includes('wheatgrass') || q.includes('detox') || q.includes('cleanse') || q.includes('alkaline')) {
      return {
        text: "**Himalayan Organics Natural Wheatgrass Powder (200g)** is raw-enzyme active:\n\n• Over **70% live chlorophyll**, molecularly matching human hemoglobin for cellular oxygenation.\n• Alkaline cleanser that restores internal pH after acidic diets, travel, or seasonal sluggishness.\n• Best taken in 200ml room-temperature filtered water within 2 minutes before the chlorophyll settles.",
        recommendedProductIds: ['ho-organic-wheatgrass', 'ho-organic-moringa', 'powder-bitter-gourd-triphala'],
      };
    }

    // Women's health / Shatavari / Hormones
    if (q.includes('women') || q.includes('shatavari') || q.includes('hormon') || q.includes('period') || q.includes('cramp') || q.includes('pcos')) {
      return {
        text: "**Organic Shatavari Root Powder (200g)** is the revered 'Queen of Herbs' in Ayurveda:\n\n• Contains natural steroidal saponins (shatavarins) that gently modulate estrogen and progesterone.\n• Calms hot flushes, eases monthly abdominal spasms, and replenishes vital Ojas (tissue glow and immunity).\n• **Ritual**: Whisk 1 rounded tsp into warm almond or cow's milk with a pinch of green cardamom 45 minutes before sleep.",
        recommendedProductIds: ['ho-organic-shatavari', 'powder-golden-milk'],
      };
    }

    // Heart / Blood Pressure / Arjun Chaal / Beetroot
    if (q.includes('heart') || q.includes('cardio') || q.includes('arjun') || q.includes('beetroot') || q.includes('blood pressure')) {
      return {
        text: "**For cardiovascular vigor and tissue oxygenation**:\n\n• **Himalayan Organics Arjun Chaal Powder**: Ancient tree bark rich in arjunolic acid that tonifies cardiac muscle. Prepare as *Arjuna Ksheerapaka* (boiled in equal parts milk and water).\n• **Organic Beetroot Powder**: Rich in dietary nitrates that convert into nitric oxide (NO) for expanded arterial blood flow and pre-workout endurance.",
        recommendedProductIds: ['ho-organic-arjun-chaal', 'ho-organic-beetroot'],
      };
    }

    // Memory / Focus / Brain / Brahmi
    if (q.includes('brain') || q.includes('focus') || q.includes('memory') || q.includes('brahmi') || q.includes('mind')) {
      return {
        text: "**Himalayan Organics Brahmi (Bacopa Monnieri) Powder (100g)** is the premier Medhya Rasayana for intellect:\n\n• Active bacosides repair synaptosomes and encourage new dendritic neural branches.\n• Dispels mental chatter, enhances focus during deep study or work, and protects against cognitive fatigue.\n• **Anupana**: Take 1/2 tsp with 1/2 tsp melted warm cow ghee or warm milk.",
        recommendedProductIds: ['ho-organic-brahmi', 'resin-shilajit'],
      };
    }

    // Ritual Boxes / Bundles / Gifts
    if (q.includes('box') || q.includes('bundle') || q.includes('kit') || q.includes('gift')) {
      return {
        text: "Our handcrafted **Ritual Boxes** make establishing an Ayurvedic lifestyle seamless:\n\n• **Daily Ritual Box**: Includes all 5 core remedies (Shilajit, Haldi, Isabgol, Bitter Gourd Triphala, Golden Milk) + carved olivewood spoon.\n• **Night Ritual Box**: Golden Milk, Ashwagandha, and Triphala with an embroidered silk eye mask.\n• **7 Day Ritual Box**: Progressive numbered habit cards for a gentle week-long reset.\n• **Discovery Pack**: 5 pre-measured travel sachets to find your rhythm.",
        recommendedProductIds: ['box-daily-ritual', 'box-night-ritual', 'box-seven-day', 'box-mini-ritual'],
      };
    }

    // General Ayurvedic query fallback
    return {
      text: "Every individual constitution (Prakriti) thrives when herbs are harmonized with the sun and moon cycles. \n\n• **Morning Sunrise**: Pure Shilajit or Moringa in lukewarm water for cellular ATP and alkaline iron.\n• **Midday**: Bitter Gourd Triphala or Pea Protein for sustained metabolic balance.\n• **Evening Twilight**: Ashwagandha, Shatavari, or Golden Milk whisked in warm spiced milk for deep REM sleep.\n\nTell me which specific benefit or symptom you'd like to address, and I will tailor a ritual for you!",
      recommendedProductIds: ['box-daily-ritual', 'ho-organic-ashwagandha', 'ho-organic-moringa'],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      // Call backend Gemini API route
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          // Identify product matches from reply text or query
          const matchedIds: string[] = [];
          const lower = (text + ' ' + data.reply).toLowerCase();
          PRODUCTS.forEach((p) => {
            if (lower.includes(p.name.toLowerCase()) || p.keyBotanicals.some((b) => lower.includes(b.toLowerCase()))) {
              if (matchedIds.length < 3) matchedIds.push(p.id);
            }
          });

          const nafishaMsg: ChatMessage = {
            id: `nafisha-${Date.now()}`,
            sender: 'nafisha',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            recommendedProductIds: matchedIds.length > 0 ? matchedIds : undefined,
          };
          setMessages((prev) => [...prev, nafishaMsg]);
          setIsTyping(false);
          return;
        }
      }
      throw new Error('API route unavailable, using local Ayurvedic knowledge engine');
    } catch {
      // Seamless local Ayurvedic knowledge base fallback
      setTimeout(() => {
        const local = generateLocalResponse(text);
        const nafishaMsg: ChatMessage = {
          id: `nafisha-${Date.now()}`,
          sender: 'nafisha',
          text: local.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProductIds: local.recommendedProductIds,
        };
        setMessages((prev) => [...prev, nafishaMsg]);
        setIsTyping(false);
      }, 600);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'nafisha',
        text: "Warm greetings! The apothecary slate is reset. Tell me what your body or mind needs today—whether it's restorative sleep, morning energy, digestive regularity, or our Himalayan organic powders.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProductIds: ['box-daily-ritual', 'ho-organic-moringa', 'ho-organic-ashwagandha'],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Pill & Button (Always visible on bottom-right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5">
          <button
            onClick={onOpen}
            className="group hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-[#FAF7F2] hover:bg-white text-[#231E1B] rounded-full border border-[#D8B19C] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            aria-label="Open Nafisha Wellness Chatbot"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#BA6E50] shrink-0">
              <img
                src={nafishaAvatarImg}
                alt="Nafisha"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></span>
            </div>
            <div className="text-left">
              <div className="text-xs font-serif font-bold text-[#231E1B] group-hover:text-[#BA6E50] transition-colors leading-none">
                Ask Nafisha
              </div>
              <div className="text-[10px] text-[#88452D] font-medium leading-tight mt-0.5">
                Ayurvedic Wellness Guide
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#BA6E50] animate-pulse ml-1" />
          </button>

          {/* Circular mobile trigger */}
          <button
            onClick={onOpen}
            aria-label="Chat with Nafisha"
            className="sm:hidden relative w-13 h-13 rounded-full bg-[#BA6E50] text-white flex items-center justify-center shadow-xl border-2 border-[#FAF7F2] active:scale-95 transition-transform cursor-pointer"
          >
            <img
              src={nafishaAvatarImg}
              alt="Nafisha"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      )}

      {/* Slide-Up Chatbot Drawer / Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="nafisha-chat-title"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col"
        >
          <div
            className={`bg-[#FAF7F2] border border-[#D8B19C] shadow-2xl rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isExpanded
                ? 'w-[calc(100vw-2rem)] sm:w-[640px] h-[85vh] max-h-[800px]'
                : 'w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh]'
            }`}
          >
            {/* Header: Nafisha Profile & Controls */}
            <div className="bg-gradient-to-r from-[#BA6E50] to-[#88452D] text-[#FAF7F2] p-4 flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#F3E6DF] shrink-0 shadow-inner">
                  <img
                    src={nafishaAvatarImg}
                    alt="Nafisha"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#BA6E50]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 id="nafisha-chat-title" className="text-sm font-serif font-bold text-white tracking-wide">
                      Nafisha
                    </h3>
                    <span className="text-[10px] bg-[#FAF7F2]/20 text-[#FAF7F2] px-1.5 py-0.2 rounded font-medium">
                      Ayurvedic Guide
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F3E6DF] leading-tight">
                    Aura Organic & Himalayan Organics Expert
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#F3E6DF]">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  aria-label="Reset conversation"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse size' : 'Expand window'}
                  aria-label={isExpanded ? 'Collapse size' : 'Expand window'}
                  className="hidden sm:inline-flex p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={onClose}
                  aria-label="Close Nafisha chat"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Status Sub-header */}
            <div className="bg-[#FAF4F0] px-4 py-1.5 border-b border-[#E8DFD5] flex items-center justify-between text-[11px] text-[#7A7067]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#BA6E50]" />
                <span>Ask about sleep, Shilajit, timings, or organic powders</span>
              </div>
              <span className="text-[#88452D] font-mono font-medium">Free Shipping &gt; ₹999</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF7F2]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#BA6E50] text-[#FAF7F2] rounded-br-none'
                        : 'bg-white border border-[#E8DFD5] text-[#231E1B] rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Embedded Product Recommendation Cards */}
                    {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#E8DFD5] space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#88452D] flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3 text-[#BA6E50]" />
                          <span>Recommended Formulations</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.recommendedProductIds.map((pId) => {
                            const p = PRODUCTS.find((prod) => prod.id === pId);
                            if (!p) return null;
                            return (
                              <div
                                key={p.id}
                                className="bg-[#FAF4F0] hover:bg-[#F3E6DF] p-2 rounded-lg border border-[#E2D5C8] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                                onClick={() => onQuickView(p)}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-8 h-8 rounded object-cover border border-[#E8DFD5] shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-[11px] font-semibold text-[#231E1B] truncate">
                                      {p.name}
                                    </div>
                                    <div className="text-[10px] text-[#88452D] font-mono">
                                      ₹{p.price} · {p.volumeOrWeight.split('+')[0].trim()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onAddToCart(p);
                                    }}
                                    className="px-2 py-1 bg-[#BA6E50] hover:bg-[#A85A3D] text-white rounded text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                                  >
                                    + Bag
                                  </button>
                                  <ChevronRight className="w-3.5 h-3.5 text-[#88452D]" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-[9px] mt-1 text-right ${
                        msg.sender === 'user' ? 'text-[#FAF7F2]/75' : 'text-[#8A7E73]'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing animation indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-[#7A7067] bg-white border border-[#E8DFD5] p-2.5 rounded-xl rounded-bl-none max-w-[200px] shadow-sm">
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <img src={nafishaAvatarImg} alt="Nafisha" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px]">Nafisha is brewing advice...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Carousel */}
            <div className="bg-[#FAF4F0] border-t border-[#E8DFD5] px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-semibold text-[#88452D] uppercase whitespace-nowrap shrink-0">
                Suggested:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.replace(/^[^\w]+/, ''))}
                  className="px-2.5 py-1 bg-white hover:bg-[#F3E6DF] text-[#5C524A] hover:text-[#231E1B] border border-[#E2D5C8] rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#E8DFD5] shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Nafisha about sleep, timings, Shilajit..."
                  className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#DCCFBF] rounded-xl text-[#231E1B] placeholder-[#9E9287] focus:outline-none focus:border-[#BA6E50] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message to Nafisha"
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    inputValue.trim() && !isTyping
                      ? 'bg-[#BA6E50] hover:bg-[#A85A3D] text-white active:scale-95 shadow-sm'
                      : 'bg-[#F4EFE7] text-[#B3A69A] cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-[10px] text-center text-[#8A7E73] mt-1.5">
                Powered by Ayurvedic Dinacharya & Aura Apothecary botanical science.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
