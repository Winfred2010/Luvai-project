import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Gen AI lazily or check key exists
const apiKey = process.env.GEMINI_API_KEY;

// Log key availability safely (do not print actual key!)
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not defined in environment variables.');
}

// Create Gemini Client with correct build agent telemetry
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json());

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Chat Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Gemini API Key is missing. Please add it to your AI Studio Secrets Panel to enable the AI Chatbot.' 
      });
    }

    // Format messages for ai.models.generateContent
    // The history needs to match what generateContent expects.
    // Or we can use ai.chats.create() for chat session, but since we receive the full history
    // in req.body, calling generateContent with the full conversation formatted as contents is cleaner.
    const systemInstruction = 
      language === 'sw' 
        ? "Wewe ni 'Msaidizi wa EmpowerHer', msaidizi wa AI mwenye huruma, salama na mtaalamu wa hali ya juu ndani ya programu ya 'EmpowerHer Connect'. " +
          "Dhamira yako ni kusaidia kina mama walezi mmoja waliopitia unyanyasaji wa nyumbani, kutelekezwa, umaskini au changamoto nyingine. " +
          "Toa ushauri katika Kiswahili au Kiingereza kwa huruma, heshima na matumaini makubwa. " +
          "Wasaidie kuelewa haki zao za kisheria katika Afrika Mashariki (haswa Kenya), ushauri wa kisaikolojia, malezi bora, mafunzo ya kazi (kama utengenezaji wa sabuni, ushonaji, kuoka, ususi, ujuzi wa kidijitali, ujasiriamali), kuandaa wasifu (CV), na kubuni mawazo ya biashara. " +
          "Toni yako iwe ya kukaribisha na kutia moyo sana. Wakumbushe kwamba hutoa maelezo ya kisheria na kisaikolojia lakini wewe si wakili au mtaalamu wa saikolojia aliyeidhinishwa."
        : "You are 'EmpowerHer Assistant', a safe, compassionate, and highly professional AI advisor built inside the 'EmpowerHer Connect' application. " +
          "Your mission is to support single mothers who have experienced domestic violence, abandonment, poverty, or other challenges. " +
          "Provide helpful, empathetic guidance in English and Swahili. " +
          "Offer support on legal rights in East Africa (specifically Kenya), counseling resources, positive parenting, skills training (e.g. soap making, tailoring, basket weaving, caregiving, baking, digital skills, entrepreneurship), drafting structured CVs, and formulating micro-business ideas. " +
          "Keep your tone extremely welcoming, empathetic, respectful, and encouraging. " +
          "Remind users that while you provide accurate information and resources, you do not replace professional attorneys or certified therapists.";

    // Map frontend message format to Gemini generateContent format
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Call generateContent with gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "I'm sorry, I couldn't process that query.";
    res.json({ content: reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate response from Gemini' });
  }
});

// Vite Middleware configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EmpowerHer Backend] Server running on http://localhost:${PORT}`);
  });
}

startServer();
