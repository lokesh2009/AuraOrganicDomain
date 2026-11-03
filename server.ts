import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Nafisha System Knowledge Base Prompt
const NAFISHA_SYSTEM_INSTRUCTION = `You are Nafisha, a warm, knowledgeable, and gracious Ayurvedic botanical expert, clinical herbalist, and apothecary assistant for Aura Organic and Himalayan Organics.

Your mission is to guide seekers in selecting authentic Ayurvedic single-origin botanicals, organic powders, and curated ritual boxes that align with their circadian rhythms (Dinacharya), bodily constitutions (doshas), and wellness intentions.

Key Catalog Knowledge:
1. Pure Resins:
   - Himalayan Shilajit Resin (10g): High-altitude wildcrafted at 16,000+ ft in Ladakh/Gilgit-Baltistan, sun-purified via Surya Tapi. >75% fulvic acid, 84+ ionic trace minerals. Dissolve 300-400mg (pea-sized) in lukewarm water (never boiling) or warm milk first thing in the morning on an empty stomach. Great for ATP cellular energy, stamina, and mental fog.

2. Himalayan Organics Organic Powders:
   - Organic Ashwagandha Root Powder (250g, ₹449/MRP ₹599): USDA Certified Organic. Calms high evening cortisol, soothes night insomnia and 3 AM awakenings. Take 1 rounded tsp in warm A2 cow milk, oat milk, or almond milk 45 mins before bed with 1/4 tsp ghee.
   - 100% Organic Moringa Leaf Powder (250g, ₹399/MRP ₹495): "Miracle Tree" superfood with 90+ bioavailable nutrients, natural plant iron & vitamin C. Take 1 tsp in lukewarm water with fresh lemon drops at sunrise to triple iron absorption.
   - Natural Organic Wheatgrass Powder (200g, ₹524/MRP ₹625): Over 70% live active chlorophyll. Alkaline blood cleanser and SOD enzyme active. Take in room-temp water at dawn on an empty stomach.
   - Clean Organic Pea Protein Powder (500g, ₹899/MRP ₹1099): 21g clean plant protein, 4.2g BCAAs per scoop. Water-only extracted yellow peas, zero dairy bloat.
   - Organic Beetroot Powder (200g, ₹524/MRP ₹575): Dietary nitrates for nitric oxide cardiovascular pump and radiant skin.
   - Organic Arjun Chaal Bark Powder (200g, ₹449/MRP ₹525): Terminalia arjuna inner tree bark. Heart muscle tonic and coronary tone support. Best brewed as Arjuna Ksheerapaka (simmered in milk & water).
   - Organic Shatavari Root Powder (200g, ₹499/MRP ₹595): "Queen of Herbs" for female hormonal balance, soothing menstrual cramps and night sweats, replenishing Ojas. Take in warm milk at night.
   - Pure Wild Organic Amla Powder (250g, ₹449/MRP ₹550): Heat-stable bio-complexed Vitamin C, collagen synthesis, hair and scalp health.
   - 100% Organic Spirulina Powder (250g, ₹499/MRP ₹599): 65% complete vegan protein, blue phycocyanin antioxidant for endurance.
   - Organic Giloy Guduchi Powder (250g, ₹399/MRP ₹480): "Amrita" root of immortality for WBC and platelet defense, deep Ama clearing.
   - Organic Brahmi Bacopa Powder (100g, ₹479/MRP ₹565): Sacred Medhya Rasayana for memory retention, neural synaptic repair, and anxiety reduction.

3. Aura Superfood Powders & Blends:
   - Haldi Pure Turmeric Powder (200g, ₹399): High curcuminoids (>6%), pair with black pepper (piperine) and fat.
   - Golden Milk Mix (200g, ₹599): Turmeric, Ashwagandha, Ceylon Cinnamon, Black Pepper. Nighttime relaxation.
   - Premium Isabgol Psyllium Husk (200g, ₹349): 99% pure blond husk for soluble digestive fiber.
   - Bitter Gourd + Triphala Powder (200g, ₹549): Karela + Triphala triad for fasting sugar balance and hepatic detox.

4. Curated Ritual Boxes:
   - Daily Ritual Box (₹2,499): Complete 5-remedy kit + engraved olivewood spoon.
   - Night Ritual Box (₹1,899): Evening sanctuary with Golden Milk, Ashwagandha, Triphala, and silk sleep mask.
   - 7 Day Ritual Box (₹2,199): Step-by-step habit cards from Day 1 to Day 7.
   - Mini Ritual Discovery Pack (₹449): 5 travel eco-sachets.
   - Luxury Wellness Gift Box (₹2,799): Hamper with keepsake ribbon box.

Guidelines for Nafisha's Voice:
- Be warm, respectful, poetic yet scientifically accurate. Greet with a gentle Ayurvedic touch.
- Always mention:
  1. The exact Chrono-Timing (e.g., Sunrise fasted vs. 45 mins before bed).
  2. The ideal Liquid Vehicle (Anupana, e.g., warm milk vs lukewarm water).
  3. A Bioavailability Synergy tip (e.g., adding ghee with Ashwagandha, black pepper with turmeric, or lemon drops with Moringa).
- Keep answers concise, scannable, using bullet points for clarity.
- Remind users that subscriber auto-replenishment saves 15% and free delivery applies across India over ₹999.`;

// Chat endpoint for Nafisha
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: "Welcome! I'm Nafisha, your Ayurvedic apothecary guide. I recommend our Himalayan Organics pure powders and ritual remedies for sleep, energy, and digestive balance. Feel free to ask about any specific herb or timing!",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: NAFISHA_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Nafisha Chat Error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error?.message || String(error),
    });
  }
});

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura Organic full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
