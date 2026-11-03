import React, { useState, useMemo } from 'react';
import { Product, DosagePrescription } from '../types';
import { PRODUCTS } from '../data/products';
import { 
  X, 
  Moon, 
  Sun, 
  Clock, 
  Coffee, 
  Check, 
  Copy, 
  Share2, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface DosageConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
  onAddToCart: (product: Product, isSubscription?: boolean) => void;
  onOpenCart?: () => void;
}

export const DosageConsultationModal: React.FC<DosageConsultationModalProps> = ({
  isOpen,
  onClose,
  initialProduct,
  onAddToCart,
  onOpenCart,
}) => {
  // Consultation Steps: 1 = Mental/Physical Status, 2 = Lifestyle/Timing, 3 = Prescription Result
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // User Responses
  const [concern, setConcern] = useState<string>(() => {
    if (initialProduct?.id === 'powder-golden-milk' || initialProduct?.id === 'box-night-ritual') {
      return 'nightly-sleep-disorder';
    }
    if (initialProduct?.id === 'resin-shilajit') {
      return 'chronic-fatigue';
    }
    if (initialProduct?.id === 'powder-isabgol' || initialProduct?.id === 'powder-bitter-gourd-triphala') {
      return 'sluggish-digestion';
    }
    return 'nightly-sleep-disorder';
  });

  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProduct?.id || 'powder-golden-milk'
  );

  const [bedtime, setBedtime] = useState<string>('10:30 PM');
  const [wakeTime, setWakeTime] = useState<string>('6:30 AM');
  const [liquidPref, setLiquidPref] = useState<string>('warm-milk');
  const [digestiveSensitivity, setDigestiveSensitivity] = useState<'mild' | 'moderate' | 'sensitive'>('moderate');
  const [copied, setCopied] = useState(false);
  const [addedToBag, setAddedToBag] = useState(false);

  // Sync when initialProduct changes
  React.useEffect(() => {
    if (initialProduct) {
      setSelectedProductId(initialProduct.id);
      if (initialProduct.chronoRitual.timeCategory === 'bedtime' || initialProduct.benefits.includes('calm-sleep')) {
        setConcern('nightly-sleep-disorder');
      } else if (initialProduct.chronoRitual.timeCategory === 'morning') {
        setConcern('chronic-fatigue');
      } else {
        setConcern('sluggish-digestion');
      }
      setStep(1);
    }
  }, [initialProduct]);

  if (!isOpen) return null;

  // Selected or recommended product
  const currentProduct = PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  // Calculate customized prescription based on inputs
  const prescription: DosagePrescription = useMemo(() => {
    let calculatedTime = '';
    let targetLiquid = '';
    let targetTemp = '';
    let targetAmount = '';
    let exactDose = '';
    let prepSteps: string[] = [];
    let synergy = '';
    let dinacharya = '';

    // Logic based on concern & selected product
    if (concern === 'nightly-sleep-disorder' || concern === 'nocturnal-anxiety') {
      // Calculate 45 minutes before user's stated bedtime
      const bedMap: Record<string, string> = {
        '9:30 PM': '8:45 PM',
        '10:00 PM': '9:15 PM',
        '10:30 PM': '9:45 PM',
        '11:00 PM': '10:15 PM',
        '11:30 PM': '10:45 PM',
        '12:00 AM': '11:15 PM',
        '1:00 AM': '12:15 AM',
      };
      calculatedTime = bedMap[bedtime] || '9:45 PM';

      if (liquidPref === 'warm-milk') {
        targetLiquid = 'Warm Organic A2 Cow Milk, Oat Milk, or Almond Milk';
        targetTemp = 'Warm (50°C – 55°C, soothing to touch, not boiling)';
      } else {
        targetLiquid = 'Lukewarm Mineral Water with a drop of organic honey';
        targetTemp = 'Lukewarm (40°C – 45°C)';
      }

      targetAmount = '200 ml (approx 1 ceramic mug)';
      exactDose = digestiveSensitivity === 'sensitive' 
        ? '3/4 level teaspoon (approx 3.5 grams)' 
        : '1 rounded teaspoon (approx 5 grams)';

      prepSteps = [
        `Gently heat 200 ml of ${liquidPref === 'warm-milk' ? 'milk' : 'water'} in a small pot until steam gently rises (do not boil).`,
        `Whisk in ${exactDose} of ${currentProduct.name} for 30–45 seconds until velvety and aromatic.`,
        'Pour into a comfortable ceramic mug. Inhale the warm botanical aroma deeply before your first sip.',
        'Sip slowly in an amber-lit room at least 45 minutes before sleep with mobile screens put away.',
      ];

      synergy = 'Add 1/4 tsp pure desi cow ghee or virgin coconut oil. The healthy fats escort lipophilic Ashwagandha withanolides directly across the blood-brain barrier.';
      dinacharya = 'Ratri-charya (Ayurvedic Evening Regimen): Nightly sleep disorders stem from elevated Vata dosha (restless wind & nervous thoughts). Warm spiced milk pacifies the vagus nerve, initiating natural endogenous melatonin synthesis.';
    } else if (concern === 'chronic-fatigue' || concern === 'brain-fog') {
      calculatedTime = wakeTime === '5:30 AM' ? '6:00 AM' : wakeTime === '6:30 AM' ? '7:00 AM' : '7:45 AM';
      targetLiquid = liquidPref === 'warm-milk' 
        ? 'Warm A2 Cow Milk or Warm Oat Milk' 
        : 'Lukewarm Filtered Water with 1/2 tsp Raw Honey';
      targetTemp = 'Lukewarm (38°C – 42°C)';
      targetAmount = '180–200 ml (approx 3/4 glass)';
      exactDose = currentProduct.id === 'resin-shilajit'
        ? (digestiveSensitivity === 'sensitive' ? '250 mg (small rice-grain size)' : '350–400 mg (pea-sized portion on wooden spoon)')
        : '1/2 level teaspoon (approx 2.5 grams)';

      prepSteps = [
        `Measure 180 ml of lukewarm water or warm milk first thing upon rising on a fasted stomach.`,
        `Submerge the tip of your wooden spoon and stir continuously for 45 seconds until fully dissolved.`,
        'Consume immediately in relaxed seated posture before your morning tea or breakfast.',
        'Wait 20–30 minutes before consuming caffeinated coffee or solid food.',
      ];

      synergy = 'Take in natural sunlight within 15 minutes of waking to anchor the suprachiasmatic circadian nucleus and maximize ionic cellular ATP production.';
      dinacharya = 'Brahma Muhurta / Usha Pana: Taking potent rasayana herbs during early morning fasted state enables 84+ trace ionic minerals to saturate cells before digestive load begins.';
    } else if (concern === 'sluggish-digestion' || concern === 'metabolic-sugar') {
      // Sluggish Digestion / Bloating / Metabolic
      calculatedTime = currentProduct.id === 'powder-isabgol'
        ? (bedtime ? `${bedtime.split(' ')[0]} (30 mins before sleep)` : '9:30 PM')
        : '6:45 AM (Sunrise fasted)';
      
      targetLiquid = 'Lukewarm Water (Never boiling)';
      targetTemp = 'Lukewarm (35°C – 40°C)';
      targetAmount = currentProduct.id === 'powder-isabgol' 
        ? '250 ml (1 full tall glass) + Follow immediately with 2nd 200ml glass of water'
        : '200 ml (1 glass)';
      exactDose = currentProduct.id === 'powder-isabgol'
        ? '1 to 2 level tablespoons (approx 7–10 grams)'
        : '1/2 level teaspoon (approx 2.5 grams)';

      prepSteps = [
        `Fill a clean glass with 250 ml of lukewarm water.`,
        `Add ${exactDose} of ${currentProduct.name} and stir briskly for just 5 seconds.`,
        'Drink immediately in continuous sips before the mucilage or botanical powder gels.',
        currentProduct.id === 'powder-isabgol' 
          ? 'Drink a second glass of 200 ml plain water immediately after to hydrate the soluble fiber.'
          : 'Wait 30 minutes before eating breakfast to allow hepatic digestive enzymes to stimulate.',
      ];

      synergy = 'Lukewarm water relaxes gastrointestinal smooth muscle, allowing natural peristaltic waves without stomach cramps.';
      dinacharya = 'Agni Deepana: Awakening the metabolic digestive fire gently through bitter and mucilaginous herbs clears gut endotoxins (Ama).';
    } else if (concern === 'supergreen-alkaline') {
      calculatedTime = '7:15 AM (Morning fasted or with breakfast)';
      targetLiquid = liquidPref === 'warm-milk' ? 'Warm Plant Milk' : 'Lukewarm Water with 5 drops fresh lemon juice';
      targetTemp = 'Lukewarm (35°C – 40°C)';
      targetAmount = '200–250 ml (1 full glass)';
      exactDose = currentProduct.chronoRitual?.exactDosage || '1 level teaspoon (approx 5 grams)';
      prepSteps = [
        `Measure 200 ml of lukewarm water or plant milk into a glass.`,
        `Add ${exactDose} of ${currentProduct.name} and whisk or stir briskly for 20 seconds.`,
        'Add a squeeze of fresh lemon to double non-heme plant iron bioavailability.',
        'Drink in calm sips. Chlorophyll molecules immediately begin alkaline oxygenation.',
      ];
      synergy = currentProduct.chronoRitual?.synergyBooster || 'Vitamin C from lemon enhances plant iron absorption threefold.';
      dinacharya = 'Rasa Dhatu Nourishment: Whole green powders saturate the primary plasma fluid with vitamins, minerals, and live enzymes.';
    } else if (concern === 'cardio-heart') {
      calculatedTime = '10:30 AM (Mid-Morning) or 45 mins before training';
      targetLiquid = liquidPref === 'warm-milk' ? 'Warm Milk Decoction (Arjuna Ksheerapaka)' : 'Room-temperature water or pomegranate juice';
      targetTemp = liquidPref === 'warm-milk' ? 'Warm (50°C – 55°C)' : 'Room Temperature';
      targetAmount = '200 ml';
      exactDose = currentProduct.chronoRitual?.exactDosage || '1 level teaspoon (approx 3 to 5 grams)';
      prepSteps = [
        `If using milk: gently simmer ${exactDose} in 100ml water + 100ml milk until concentrated.`,
        `If using water/juice: stir ${exactDose} briskly for 20 seconds until homogeneous.`,
        'Sip mindfully while relaxed.',
      ];
      synergy = currentProduct.chronoRitual?.synergyBooster || 'Cardamom or honey enhances arterial endothelial bioavailability.';
      dinacharya = 'Hridaya Rasayana: Ayurvedic cardiovascular botanicals strengthen cardiac myocytes and maintain healthy coronary vascular tone.';
    } else if (concern === 'womens-hormone') {
      const bedMap: Record<string, string> = {
        '9:30 PM': '8:45 PM',
        '10:00 PM': '9:15 PM',
        '10:30 PM': '9:45 PM',
        '11:00 PM': '10:15 PM',
        '11:30 PM': '10:45 PM',
        '12:00 AM': '11:15 PM',
        '1:00 AM': '12:15 AM',
      };
      calculatedTime = bedMap[bedtime] || '9:45 PM';
      targetLiquid = liquidPref === 'warm-milk' ? 'Warm Organic A2 Cow Milk or Warm Almond Milk' : 'Lukewarm Water with 1 tsp Raw Honey';
      targetTemp = 'Warm (50°C – 55°C)';
      targetAmount = '200 ml (1 teacup)';
      exactDose = currentProduct.chronoRitual?.exactDosage || '1 rounded teaspoon (approx 4 grams)';
      prepSteps = [
        `Warm 200 ml of milk gently in a small pot.`,
        `Whisk in ${exactDose} of ${currentProduct.name} until a silky golden/cream beverage forms.`,
        'Add 1/4 tsp pure cow ghee or a pinch of crushed green cardamom.',
        'Drink slowly 45 minutes before sleep to replenish restorative Ojas.',
      ];
      synergy = currentProduct.chronoRitual?.synergyBooster || 'Ghee assists steroid-saponin delivery to deep reproductive and endocrine tissues.';
      dinacharya = 'Ojas Vardhana: Calming the nervous system at twilight restores hormonal equilibrium and deep tissue vitality.';
    } else {
      // General botanical fallback from product's calibrated chronoRitual
      calculatedTime = currentProduct.chronoRitual?.bestTimeOfDay || 'Morning 7:30 AM';
      targetLiquid = currentProduct.chronoRitual?.liquidMedium || (liquidPref === 'warm-milk' ? 'Warm Milk' : 'Lukewarm Water');
      targetTemp = currentProduct.chronoRitual?.liquidTemperature || 'Warm (50-60°C)';
      targetAmount = currentProduct.chronoRitual?.liquidAmount || '200 ml';
      exactDose = currentProduct.chronoRitual?.exactDosage || '1 level teaspoon';
      prepSteps = [
        currentProduct.chronoRitual?.preparationMethod || `Mix ${exactDose} into ${targetAmount} of ${targetLiquid}.`,
        'Consume mindfully in a calm seated posture.',
      ];
      synergy = currentProduct.chronoRitual?.synergyBooster || 'Maintain steady daily intake for cumulative cellular benefits.';
      dinacharya = `Ayurvedic Dinacharya: ${currentProduct.chronoRitual?.targetHealthNeed || 'Holistic system replenishment'}`;
    }

    return {
      productId: currentProduct.id,
      productName: currentProduct.name,
      productImage: currentProduct.image,
      patientConcern: concern,
      userBedtime: bedtime,
      calculatedTime,
      liquidMedium: targetLiquid,
      liquidTemperature: targetTemp,
      liquidAmount: targetAmount,
      exactDosage: exactDose,
      preparationSteps: prepSteps,
      synergyTips: synergy,
      dinacharyaNote: dinacharya,
    };
  }, [concern, selectedProductId, bedtime, wakeTime, liquidPref, digestiveSensitivity, currentProduct]);

  const handleCopyPrescription = () => {
    const text = `--- AURA ORGANIC APOTHECARY PRESCRIPTION ---
Product: ${prescription.productName}
Primary Symptom/Status: ${prescription.patientConcern}
Prescribed Timing: ${prescription.calculatedTime}
Liquid Medium: ${prescription.liquidMedium} (${prescription.liquidTemperature})
Liquid Volume: ${prescription.liquidAmount}
Exact Calibrated Dose: ${prescription.exactDosage}

Preparation Protocol:
${prescription.preparationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Bioavailability Synergy:
${prescription.synergyTips}

Circadian Chrono-Wisdom:
${prescription.dinacharyaNote}
---------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddPrescriptionToBag = () => {
    onAddToCart(currentProduct, false);
    setAddedToBag(true);
    setTimeout(() => {
      setAddedToBag(false);
      onClose();
      if (onOpenCart) onOpenCart();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#231E1B]/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl border border-[#E8DFD5] shadow-2xl overflow-hidden my-6 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#FAF4F0] border-b border-[#E8DFD5] p-5 sm:p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#BA6E50]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ayurvedic Chrono-Biology Consultation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif text-[#231E1B]">
              Personalized Timing & Liquid Prescription
            </h2>
            <p className="text-xs text-[#7A7067]">
              Tailored preparation, exact liquid medium (warm milk vs lukewarm water), and calibrated clock times for your current state.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close consultation"
            className="p-2 rounded-full bg-[#FAF7F2] hover:bg-white text-[#231E1B] border border-[#E8DFD5] transition-colors cursor-pointer shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-Step Indicator */}
        <div className="bg-[#F4EFE7] px-6 py-2.5 border-b border-[#E8DFD5] flex items-center justify-between text-xs font-medium text-[#7A7067]">
          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 1 ? 'bg-[#BA6E50] text-white' : 'bg-[#E8DFD5] text-[#7A7067]'
            }`}>
              1
            </span>
            <span className={step === 1 ? 'text-[#88452D] font-semibold' : ''}>Mental Health & Concern</span>
          </div>

          <span className="text-[#C5B7A8]">→</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step >= 2 ? 'bg-[#BA6E50] text-white' : 'bg-[#E8DFD5] text-[#7A7067]'
            }`}>
              2
            </span>
            <span className={step === 2 ? 'text-[#88452D] font-semibold' : ''}>Schedule & Vehicle</span>
          </div>

          <span className="text-[#C5B7A8]">→</span>

          <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 3 ? 'bg-[#BA6E50] text-white' : 'bg-[#E8DFD5] text-[#7A7067]'
            }`}>
              3
            </span>
            <span className={step === 3 ? 'text-[#88452D] font-semibold' : ''}>Prescription Card</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: Mental Health & Health Status */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-serif text-[#231E1B] mb-1">
                  1. What is your primary health state or symptom right now?
                </h3>
                <p className="text-xs text-[#7A7067]">
                  Ayurvedic chronobiology aligns active botanical phytochemicals with your internal hormonal and nervous clock.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'nightly-sleep-disorder',
                    title: 'Nightly Sleep Disorder & Insomnia',
                    desc: 'Takes >45 mins to fall asleep, mental restlessness in bed, high evening tension.',
                    recommendedProduct: 'powder-golden-milk',
                    icon: Moon,
                  },
                  {
                    id: 'nocturnal-anxiety',
                    title: '3:00 AM Nocturnal Cortisol Spikes & Anxiety',
                    desc: 'Waking abruptly in the middle of the night with racing thoughts or elevated heart rate.',
                    recommendedProduct: 'box-night-ritual',
                    icon: AlertCircle,
                  },
                  {
                    id: 'chronic-fatigue',
                    title: 'Morning Brain Fog & Low Physical Stamina',
                    desc: 'Waking up unrefreshed, sluggish afternoon slump, needing energy renewal.',
                    recommendedProduct: 'resin-shilajit',
                    icon: Sun,
                  },
                  {
                    id: 'sluggish-digestion',
                    title: 'Sluggish Digestion, Heavy Bloating & Constipation',
                    desc: 'Slow gut transit, abdominal heaviness, post-meal discomfort.',
                    recommendedProduct: 'powder-isabgol',
                    icon: Flame,
                  },
                  {
                    id: 'metabolic-sugar',
                    title: 'Metabolic Detoxification & Blood Sugar Balance',
                    desc: 'Sugar cravings, morning grogginess, desiring liver & gut renewal.',
                    recommendedProduct: 'powder-bitter-gourd-triphala',
                    icon: Sparkles,
                  },
                  {
                    id: 'supergreen-alkaline',
                    title: 'Alkaline Blood Cleansing & Cellular Greens',
                    desc: 'High acidity, sluggish hemoglobin, low vegetable micronutrient intake.',
                    recommendedProduct: 'ho-organic-moringa',
                    icon: Sparkles,
                  },
                  {
                    id: 'cardio-heart',
                    title: 'Cardiovascular Strength & Endurance Stamina',
                    desc: 'Heart stress, arterial tone maintenance, desiring natural nitric oxide.',
                    recommendedProduct: 'ho-organic-arjun-chaal',
                    icon: Sparkles,
                  },
                  {
                    id: 'womens-hormone',
                    title: 'Female Hormonal Balance & Ojas Radiance',
                    desc: 'Monthly cycle discomfort, evening restlessness, vitality replenishment.',
                    recommendedProduct: 'ho-organic-shatavari',
                    icon: Moon,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = concern === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setConcern(item.id);
                        setSelectedProductId(item.recommendedProduct);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#FAF4F0] border-[#BA6E50] ring-1 ring-[#BA6E50] shadow-sm'
                          : 'bg-white border-[#E8DFD5] hover:border-[#D8B19C]'
                      }`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        isSelected ? 'bg-[#BA6E50] text-white' : 'bg-[#F4EFE7] text-[#88452D]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-[#231E1B]">
                            {item.title}
                          </h4>
                          {isSelected && (
                            <span className="text-[11px] font-semibold text-[#88452D] bg-[#EAD3C6] px-2 py-0.5 rounded">
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5C524A] mt-0.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Product selection preview with dropdown switch */}
              <div className="p-4 bg-[#F4EFE7] rounded-xl border border-[#E2D5C8] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-12 h-12 rounded-lg object-cover border border-[#E8DFD5]"
                    />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#88452D]">Matched Formulation</span>
                      <h5 className="text-sm font-serif font-semibold text-[#231E1B]">{currentProduct.name}</h5>
                      <span className="text-xs text-[#6F7D67]">₹{currentProduct.price} · {currentProduct.volumeOrWeight}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[#7A7067] block">Standard Best Time:</span>
                    <span className="text-xs font-semibold text-[#88452D]">{currentProduct.chronoRitual.bestTimeOfDay.split('(')[0]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2D5C8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-[#5C524A] font-medium">Customize specific botanical:</span>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="bg-white border border-[#DCCFBF] rounded-md px-2.5 py-1 text-xs text-[#231E1B] focus:outline-none focus:border-[#BA6E50] cursor-pointer"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.volumeOrWeight})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Lifestyle, Bedtime & Liquid Preferences */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-base font-serif text-[#231E1B] mb-1">
                  2. Your Daily Routine & Liquid Vehicle Preference
                </h3>
                <p className="text-xs text-[#7A7067]">
                  Ayurveda prescribes specific liquid vehicles (Anupana) like warm milk or lukewarm water to escort herbs to the target organ systems.
                </p>
              </div>

              {/* Sleep / Wake Timings */}
              {(concern.includes('sleep') || concern.includes('nocturnal')) ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#231E1B] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#BA6E50]" />
                    <span>What time do you typically get into bed to sleep?</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['9:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM', '12:00 AM', '1:00 AM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setBedtime(time)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          bedtime === time
                            ? 'bg-[#BA6E50] text-white border-[#BA6E50] shadow-sm font-semibold'
                            : 'bg-white text-[#5C524A] border-[#E8DFD5] hover:border-[#BA6E50]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#231E1B] flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#BA6E50]" />
                    <span>What time do you usually wake up in the morning?</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {['5:30 AM', '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setWakeTime(time)}
                        className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          wakeTime === time
                            ? 'bg-[#BA6E50] text-white border-[#BA6E50] shadow-sm font-semibold'
                            : 'bg-white text-[#5C524A] border-[#E8DFD5] hover:border-[#BA6E50]'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Liquid Medium Preference */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#231E1B] flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#BA6E50]" />
                  <span>Preferred Liquid Vehicle (Anupana):</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'warm-milk',
                      title: 'Warm Milk (Cow / Oat / Almond)',
                      desc: 'Ideal for soothing sleep, nervous tension, and lipophilic adaptogens.',
                    },
                    {
                      id: 'lukewarm-water',
                      title: 'Lukewarm Water (38°C – 42°C)',
                      desc: 'Best for rapid fasted cellular absorption and digestive cleansing.',
                    },
                  ].map((liquid) => (
                    <div
                      key={liquid.id}
                      onClick={() => setLiquidPref(liquid.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        liquidPref === liquid.id
                          ? 'bg-[#FAF4F0] border-[#BA6E50] ring-1 ring-[#BA6E50]'
                          : 'bg-white border-[#E8DFD5] hover:border-[#D8B19C]'
                      }`}
                    >
                      <h4 className="text-xs font-semibold text-[#231E1B]">{liquid.title}</h4>
                      <p className="text-[11px] text-[#7A7067] mt-1">{liquid.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digestive Sensitivity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#231E1B]">
                  Digestive System Sensitivity:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sensitive', label: 'Delicate / Sensitive' },
                    { id: 'moderate', label: 'Balanced / Normal' },
                    { id: 'mild', label: 'Strong Digestive Fire' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDigestiveSensitivity(item.id as any)}
                      className={`py-2 px-3 text-xs rounded-lg border text-center transition-all cursor-pointer ${
                        digestiveSensitivity === item.id
                          ? 'bg-[#65745E] text-white border-[#65745E] font-medium'
                          : 'bg-white text-[#5C524A] border-[#E8DFD5] hover:border-[#65745E]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Generated Prescription Card */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Apothecary Rx Card */}
              <div className="bg-[#FAF4F0] border-2 border-[#D8B19C] rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                {/* Decorative Seal */}
                <div className="absolute top-4 right-4 bg-[#88452D] text-white text-[10px] uppercase tracking-widest font-mono px-3 py-1 rounded shadow-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Rx Certified</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#88452D]">
                      Aura Dinacharya Chrono-Prescription
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-[#231E1B]">
                      {prescription.productName}
                    </h3>
                    <p className="text-xs text-[#7A7067] mt-0.5">
                      Target Condition: <span className="font-semibold text-[#88452D] capitalize">{prescription.patientConcern.replace(/-/g, ' ')}</span>
                    </p>
                  </div>

                  {/* 3 Key Prescribed Metrics Highlight Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E8DFD5]">
                    <div className="bg-white p-3 rounded-xl border border-[#E8DFD5]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88452D]">
                        <Clock className="w-3.5 h-3.5 text-[#BA6E50]" />
                        <span>Prescribed Time</span>
                      </div>
                      <div className="text-base sm:text-lg font-serif font-bold text-[#231E1B] mt-1">
                        {prescription.calculatedTime}
                      </div>
                      <div className="text-[10px] text-[#7A7067]">
                        {concern.includes('sleep') ? '45m prior to sleep' : 'Fasted morning window'}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#E8DFD5]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88452D]">
                        <Coffee className="w-3.5 h-3.5 text-[#BA6E50]" />
                        <span>Liquid Vehicle</span>
                      </div>
                      <div className="text-xs font-semibold text-[#231E1B] mt-1 line-clamp-1">
                        {prescription.liquidMedium.split('(')[0]}
                      </div>
                      <div className="text-[10px] text-[#65745E] font-medium">
                        {prescription.liquidAmount} @ {prescription.liquidTemperature.split('(')[0]}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#E8DFD5]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#88452D]">
                        <Sparkles className="w-3.5 h-3.5 text-[#BA6E50]" />
                        <span>Calibrated Dose</span>
                      </div>
                      <div className="text-xs font-semibold text-[#231E1B] mt-1">
                        {prescription.exactDosage}
                      </div>
                      <div className="text-[10px] text-[#7A7067]">
                        Precision wooden spoon
                      </div>
                    </div>
                  </div>

                  {/* Preparation Steps */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#231E1B]">
                      Step-by-Step Preparation & Intake:
                    </h4>
                    <div className="space-y-1.5">
                      {prescription.preparationSteps.map((stepText, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#5C524A] bg-white/70 p-2 rounded-lg border border-[#EAD3C6]">
                          <span className="w-4 h-4 rounded-full bg-[#BA6E50] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{stepText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bioavailability Synergy */}
                  <div className="p-3 bg-[#F3EAE4] rounded-xl border border-[#D8B19C] text-xs text-[#5C524A] space-y-1">
                    <span className="font-semibold text-[#88452D] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#BA6E50]" />
                      Bioavailability Booster:
                    </span>
                    <p className="leading-relaxed text-[11px]">{prescription.synergyTips}</p>
                  </div>

                  {/* Chrono-wisdom rationale */}
                  <div className="text-[11px] text-[#7A7067] italic leading-relaxed border-t border-[#E8DFD5] pt-2">
                    {prescription.dinacharyaNote}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleAddPrescriptionToBag}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#BA6E50] hover:bg-[#A85A3D] text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {addedToBag ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Order Prescribed Remedy (₹{currentProduct.price})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyPrescription}
                  className="w-full sm:w-auto py-3 px-4 bg-white hover:bg-[#FAF7F2] text-[#231E1B] border border-[#E8DFD5] font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#65745E]" />
                      <span>Copied Protocol!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#7A7067]" />
                      <span>Copy Prescription</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#FAF4F0] border-t border-[#E8DFD5] p-4 px-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C524A] hover:text-[#231E1B] py-2 px-3 rounded-lg border border-[#E8DFD5] bg-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="text-[11px] text-[#7A7067]">
              Step 1 of 3: Status Diagnostic
            </div>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#BA6E50] hover:bg-[#A85A3D] py-2.5 px-5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
            >
              <span>{step === 1 ? 'Configure Timing & Liquid' : 'Generate Prescription'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setStep(1)}
              className="text-xs text-[#88452D] hover:underline cursor-pointer"
            >
              Change Symptom or Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
