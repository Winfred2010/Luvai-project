import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_USERS, INITIAL_CATEGORIES, INITIAL_SUPPLIERS, INITIAL_PRODUCTS, INITIAL_TRANSACTIONS, INITIAL_SALES, INITIAL_AUDIT_LOGS } from './src/data/seedData';
import { Product, Category, Supplier, Transaction, Sale, AuditLog, User, UserRole } from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'database.json');

app.use(express.json());

// Multi-Branch list for helper references
const BRANCHES = ['Nairobi HQ', 'Nakuru Branch', 'Mombasa Branch'];

// Helper to initialize and retrieve database
interface DBState {
  users: User[];
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  transactions: Transaction[];
  sales: Sale[];
  auditLogs: AuditLog[];
}

function loadDB(): DBState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file, resetting to seed data.', err);
  }

  // Create default database structure
  const defaultState: DBState = {
    users: INITIAL_USERS,
    categories: INITIAL_CATEGORIES,
    suppliers: INITIAL_SUPPLIERS,
    products: INITIAL_PRODUCTS,
    transactions: INITIAL_TRANSACTIONS,
    sales: INITIAL_SALES,
    auditLogs: INITIAL_AUDIT_LOGS
  };

  saveDB(defaultState);
  return defaultState;
}

function saveDB(state: DBState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file.', err);
  }
}

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// --- REST API ENDPOINTS ---

// Get all system data
app.get('/api/data', (req, res) => {
  const db = loadDB();
  res.json({
    ...db,
    branches: BRANCHES
  });
});

// Product Management: Add / Edit / Delete
app.post('/api/products', (req, res) => {
  const db = loadDB();
  const { action, product, id, userId, userName, userRole } = req.body;
  const currentBranch = product?.branch || 'Nairobi HQ';

  if (action === 'add') {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`
    };
    db.products.push(newProduct);

    // Write audit log
    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      userId,
      userName,
      userRole,
      action: `Added premium product '${newProduct.name}' (SKU: ${newProduct.sku}) with target quantity ${newProduct.quantity}`,
      date: new Date().toISOString(),
      branch: currentBranch
    };
    db.auditLogs.unshift(log);
    saveDB(db);
    return res.json({ success: true, product: newProduct });
  }

  if (action === 'edit') {
    const idx = db.products.findIndex(p => p.id === id);
    if (idx > -1) {
      const oldProd = db.products[idx];
      const updatedProduct = { ...oldProd, ...product };
      db.products[idx] = updatedProduct;

      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        userId,
        userName,
        userRole,
        action: `Updated details for product '${updatedProduct.name}' (SKU: ${updatedProduct.sku})`,
        date: new Date().toISOString(),
        branch: currentBranch
      };
      db.auditLogs.unshift(log);
      saveDB(db);
      return res.json({ success: true, product: updatedProduct });
    }
    return res.status(404).json({ error: 'Product not found' });
  }

  if (action === 'delete') {
    const prod = db.products.find(p => p.id === id);
    if (prod) {
      db.products = db.products.filter(p => p.id !== id);
      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        userId,
        userName,
        userRole,
        action: `Deleted product '${prod.name}' from active index`,
        date: new Date().toISOString(),
        branch: prod.branch
      };
      db.auditLogs.unshift(log);
      saveDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(400).json({ error: 'Invalid operation' });
});

// Category Management: Add / Edit / Delete
app.post('/api/categories', (req, res) => {
  const db = loadDB();
  const { action, category, id, userId, userName, userRole } = req.body;

  if (action === 'add') {
    const newCat: Category = {
      ...category,
      id: `cat_${Date.now()}`
    };
    db.categories.push(newCat);

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      userId,
      userName,
      userRole,
      action: `Created new inventory category: '${newCat.name}'`,
      date: new Date().toISOString(),
      branch: 'ALL'
    };
    db.auditLogs.unshift(log);
    saveDB(db);
    return res.json({ success: true, category: newCat });
  }

  if (action === 'edit') {
    const idx = db.categories.findIndex(c => c.id === id);
    if (idx > -1) {
      const updatedCat = { ...db.categories[idx], ...category };
      db.categories[idx] = updatedCat;

      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        userId,
        userName,
        userRole,
        action: `Modified description for category: '${updatedCat.name}'`,
        date: new Date().toISOString(),
        branch: 'ALL'
      };
      db.auditLogs.unshift(log);
      saveDB(db);
      return res.json({ success: true, category: updatedCat });
    }
    return res.status(404).json({ error: 'Category not found' });
  }

  if (action === 'delete') {
    const cat = db.categories.find(c => c.id === id);
    if (cat) {
      db.categories = db.categories.filter(c => c.id !== id);
      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        userId,
        userName,
        userRole,
        action: `Removed category: '${cat.name}'`,
        date: new Date().toISOString(),
        branch: 'ALL'
      };
      db.auditLogs.unshift(log);
      saveDB(db);
      return res.json({ success: true });
    }
    return res.status(404).json({ error: 'Category not found' });
  }

  res.status(400).json({ error: 'Invalid operation' });
});

// Supplier Management: Add / Edit
app.post('/api/suppliers', (req, res) => {
  const db = loadDB();
  const { action, supplier, id, userId, userName, userRole } = req.body;

  if (action === 'add') {
    const newSupplier: Supplier = {
      ...supplier,
      id: `sup_${Date.now()}`
    };
    db.suppliers.push(newSupplier);

    const log: AuditLog = {
      id: `audit_${Date.now()}`,
      userId,
      userName,
      userRole,
      action: `Added new supplier connection: '${newSupplier.name}'`,
      date: new Date().toISOString(),
      branch: 'ALL'
    };
    db.auditLogs.unshift(log);
    saveDB(db);
    return res.json({ success: true, supplier: newSupplier });
  }

  if (action === 'edit') {
    const idx = db.suppliers.findIndex(s => s.id === id);
    if (idx > -1) {
      const updatedSup = { ...db.suppliers[idx], ...supplier };
      db.suppliers[idx] = updatedSup;

      const log: AuditLog = {
        id: `audit_${Date.now()}`,
        userId,
        userName,
        userRole,
        action: `Updated supplier details: '${updatedSup.name}'`,
        date: new Date().toISOString(),
        branch: 'ALL'
      };
      db.auditLogs.unshift(log);
      saveDB(db);
      return res.json({ success: true, supplier: updatedSup });
    }
    return res.status(404).json({ error: 'Supplier not found' });
  }

  res.status(400).json({ error: 'Invalid operation' });
});

// Stock In / Stock Out module adjustment (Automatic state calculator)
app.post('/api/stock-adjust', (req, res) => {
  const db = loadDB();
  const { productId, quantity, type, reason, supplierId, notes, userId, userName, userRole, branch } = req.body;

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    return res.status(400).json({ error: 'Quantity must be a positive integer' });
  }

  const pIdx = db.products.findIndex(p => p.id === productId);
  if (pIdx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const product = db.products[pIdx];

  if (type === 'out' && product.quantity < qty) {
    return res.status(400).json({ error: `Not enough stock. Available: ${product.quantity}, Requested: ${qty}` });
  }

  // Calculate new quantity
  if (type === 'in') {
    product.quantity += qty;
  } else {
    product.quantity -= qty;
  }

  const txId = `tx_${Date.now()}`;
  const newTx: Transaction = {
    id: txId,
    productId,
    quantity: qty,
    type,
    reason,
    supplierId,
    date: new Date().toISOString(),
    userId,
    userName,
    branch: branch || product.branch,
    notes
  };

  db.transactions.push(newTx);

  // Custom Human Audit narrative
  const statusVerb = type === 'in' ? 'received' : 'deducted';
  const reasonText = reason === 'damaged' ? 'due to damage' : reason === 'expired' ? 'due to product expiry' : reason === 'sale' ? 'for active sale' : 'due to manual adjustment';
  
  const log: AuditLog = {
    id: `audit_${Date.now()}`,
    userId,
    userName,
    userRole,
    action: `Stock ${type.toUpperCase()}: ${statusVerb} ${qty} unit(s) of '${product.name}' ${reasonText}. Current stock is now ${product.quantity}.`,
    date: new Date().toISOString(),
    branch: branch || product.branch
  };

  db.auditLogs.unshift(log);
  saveDB(db);

  res.json({ success: true, product, transaction: newTx });
});

// Sales management with digital payment simulation
app.post('/api/sales', (req, res) => {
  const db = loadDB();
  const { customerName, items, paymentMethod, userId, userName, userRole, branch } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Sales receipt must contain at least 1 item' });
  }

  // Validate quantities of all products first before deducting!
  for (const item of items) {
    const prod = db.products.find(p => p.id === item.productId);
    if (!prod) {
      return res.status(404).json({ error: `Product with ID ${item.productId} not found` });
    }
    if (prod.quantity < item.quantity) {
      return res.status(400).json({ error: `Insufficient inventory for ${prod.name}. In stock: ${prod.quantity}, requested: ${item.quantity}` });
    }
  }

  // Process sales: deduct stock, generate Transactions and write Sale
  const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const resolvedItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const prodIdx = db.products.findIndex(p => p.id === item.productId);
    const prod = db.products[prodIdx];

    // Deduct stock
    prod.quantity -= item.quantity;

    resolvedItems.push({
      productId: item.productId,
      productName: prod.name,
      quantity: item.quantity,
      price: prod.price
    });

    totalAmount += prod.price * item.quantity;

    // Create a Stock Out transaction record
    const tx: Transaction = {
      id: `tx_${Date.now()}_${item.productId}`,
      productId: item.productId,
      quantity: item.quantity,
      type: 'out',
      reason: 'sale',
      date: new Date().toISOString(),
      userId,
      userName,
      branch: branch || prod.branch
    };
    db.transactions.push(tx);
  }

  const newSale: Sale = {
    id: `sale_${Date.now()}`,
    customerName: customerName || 'Walk-in Customer',
    items: resolvedItems,
    totalAmount,
    paymentMethod,
    date: new Date().toISOString(),
    userId,
    userName,
    branch: branch || 'Nairobi HQ',
    receiptNumber
  };

  db.sales.push(newSale);

  const log: AuditLog = {
    id: `audit_${Date.now()}`,
    userId,
    userName,
    userRole,
    action: `Completed sale ${receiptNumber} for client '${newSale.customerName}' worth KES ${totalAmount.toLocaleString()}`,
    date: new Date().toISOString(),
    branch: branch || 'Nairobi HQ'
  };
  db.auditLogs.unshift(log);

  saveDB(db);

  res.json({ success: true, sale: newSale });
});

// AI Prediction Route securely proxying to Gemini
app.post('/api/ai/predict', async (req, res) => {
  const { productId, currentStock, minStock, categoryName, salesHistory } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      apiKeyMissing: true,
      prediction: `AI Demand Prediction recommends restocking based on automatic calculations. 
(Please register your GEMINI_API_KEY in the Settings > Secrets screen to enable real-time natural language demand projections!)`
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `
You are a highly analytical Retail Demand AI Assistant. Your task is to analyze sales data and inventory figures of a specific item to predict future and seasonal demand. 

Analyze this product:
- Category: ${categoryName}
- Current Stock Level: ${currentStock} units
- Minimum Required Stock level (buffer): ${minStock} units
- Recent Sales Records: ${JSON.stringify(salesHistory)}

Write an elegant, human-readable paragraph predicting demand for next 30 days and provide clear restocking recommendations. Address whether sales are increasing/decreasing, if seasonal spikes relate to weekends or educational/pharmaceutical events, and exactly how many units the local store manager should purchase immediately to secure profits without tying up too much capital.

Be brief (under 120 words), specific, and practical. Write direct retail business advice. Keep numbers realistic for small/medium shops.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    const advice = response.text || "Unable to retrieve analytical guidance at this time.";
    res.json({ success: true, prediction: advice.trim() });
  } catch (err: any) {
    console.error('Gemini API call failed:', err);
    res.json({
      success: false,
      prediction: `AI projection services experienced a network block: ${err.message || err}. Recommending conservative restoration up to ${minStock * 2} buffer units.`
    });
  }
});

// Serves the client-side SPA bundle in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Use Vite middlewares in development
  import('vite').then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Inventory server running on http://0.0.0.0:${PORT}`);
});
