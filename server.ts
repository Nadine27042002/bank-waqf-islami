import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Resolve paths (works in both dev (tsx) and production (compiled .cjs) modes)
const __dirname = process.cwd();

const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const DONATIONS_FILE = path.join(DATA_DIR, 'donations.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Initialize data directory and database files if they do not exist
function initializeDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const initialProjects = [
    {
      id: "1",
      title: "مجمع النور التعليمي الوقفي لصناعة العقول",
      description: "بناء وتجهيز مجمع تعليمي يستوعب 500 طالب وطالبة من الأيتام وأبناء الأسر المتعففة، يقدم تعليماً متميزاً في مجالات العلوم والتكنولوجيا والقرآن الكريم مجاناً بمواصفات القرن الـ21 لجعلهم قادة المستقبل.",
      category: "educational",
      targetAmount: 750000,
      currentAmount: 492000,
      donorCount: 1420,
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "2",
      title: "مستشفى الشفاء الوقفي لغسيل وحماية الكلى",
      description: "توفير 15 جهاز غسيل كلى حديث مع كافة المستلزمات الطبية والوقائية لأصحاب الفشل الكلوي المزمن لتمكينهم من تلقي العلاج مجاناً وتجنيبهم الأعباء المادية المنهكة في بيئة استشفائية إسلامية راقية ومتكاملة.",
      category: "health",
      targetAmount: 500000,
      currentAmount: 375000,
      donorCount: 980,
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "3",
      title: "مزارع الجود الوقفية للأمن الغذائي المستدام",
      description: "استصلاح وزراعة 100 فدان بمحاصيل القمح والتمور وتخصيص كامل ريعها السنوي لتوزيع السلال الغذائية الجاهزة ودعم المطابخ الخيرية في المناطق المتضررة لكسر دوائر العوز الغذائي والفقر.",
      category: "agricultural",
      targetAmount: 600000,
      currentAmount: 240000,
      donorCount: 612,
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "4",
      title: "مبادرة 'مسكن البركة' لتيسير العيش للأرامل والأيتام",
      description: "تأسيس وصيانة مبنى سكني مكون من 12 شقة مجهزة بالكامل بالتعاون مع البنك الوقفي لتأمين لقمة السكن المستقر والأمان الأسري للأرامل والأمهات الحاضنات للأيتام دون مقابل.",
      category: "social",
      targetAmount: 450000,
      currentAmount: 315000,
      donorCount: 740,
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "5",
      title: "صندوق البحث العلمي والابتكار الوقفي",
      description: "صندوق وقفي مخصص لدعم أبحاث الطاقة النظيفة والمياه للمناطق والقرى النامية مع تمويل براءات الاختراع للعلماء والباحثين المسلمين الشباب لبلورة حلول محلية رائدة.",
      category: "educational",
      targetAmount: 300000,
      currentAmount: 90000,
      donorCount: 215,
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "6",
      title: "وقف سيارات الإسعاف والعناية المتنقلة للمناطق النائية",
      description: "شراء وتجهيز 4 العيادات وسيارات الإسعاف المتكاملة بمواصفات الرعاية المركزة لتقديم الدعم الحياتي العاجل ونقل المرضى المعسرين في القرى المعزولة والمناطق البعيدة عن المستشفيات المركزية.",
      category: "health",
      targetAmount: 400000,
      currentAmount: 180000,
      donorCount: 430,
      image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&q=80&w=600"
    }
  ];

  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2), 'utf-8');
  }

  if (!fs.existsSync(DONATIONS_FILE)) {
    fs.writeFileSync(DONATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }

  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

initializeDatabase();

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not set. Chat features will fallback.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClient;
}

// Stateless token helpers using JSON base64 with expiry
function generateToken(user: any): string {
  const payload = {
    userId: user.id,
    email: user.email,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiry
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function decodeToken(token: string): any | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.expires < Date.now()) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function authenticateToken(req: express.Request): any | null {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  try {
    const usersData = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(usersData);
    return users.find((u: any) => u.id === payload.userId) || null;
  } catch (e) {
    return null;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Authentication - Sign Up
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال الاسم والبريد الإلكتروني وكلمة المرور' });
      }

      const usersData = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(usersData);

      const existingUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
      }

      const newUser = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        passwordHash: hashPassword(password),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        preferredWaqf: 'general',
        monthlyGoal: 50000, // default goal in Dinar Algerian
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

      const token = generateToken(newUser);

      // Don't send back password hash
      const { passwordHash, ...userResponse } = newUser;

      res.status(201).json({
        success: true,
        token,
        user: userResponse
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الحساب' });
    }
  });

  // API Route: Authentication - Login
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' });
      }

      const usersData = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(usersData);

      const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const matched = hashPassword(password) === user.passwordHash;
      if (!matched) {
        return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
      }

      const token = generateToken(user);
      const { passwordHash, ...userResponse } = user;

      res.json({
        success: true,
        token,
        user: userResponse
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
  });

  // API Route: Authentication - Get current logged in user (Me)
  app.get('/api/auth/me', (req, res) => {
    try {
      const user = authenticateToken(req);
      if (!user) {
        return res.status(401).json({ error: 'غير مصرح للوصول، يرجى تسجيل الدخول' });
      }

      const { passwordHash, ...userResponse } = user;
      res.json({
        success: true,
        user: userResponse
      });
    } catch (error) {
      console.error("Auth me error:", error);
      res.status(500).json({ error: 'حدث خطأ أثناء جلب بيانات المستخدم' });
    }
  });

  // API Route: User Profile Update
  app.post('/api/user/profile', (req, res) => {
    try {
      const authenticatedUser = authenticateToken(req);
      if (!authenticatedUser) {
        return res.status(401).json({ error: 'غير مصرح للوصول، يرجى تسجيل الدخول' });
      }

      const { name, phone, preferredWaqf, monthlyGoal, avatar } = req.body;

      const usersData = fs.readFileSync(USERS_FILE, 'utf-8');
      const users = JSON.parse(usersData);

      const updatedUsers = users.map((u: any) => {
        if (u.id === authenticatedUser.id) {
          return {
            ...u,
            name: name !== undefined ? name : u.name,
            phone: phone !== undefined ? phone : u.phone,
            preferredWaqf: preferredWaqf !== undefined ? preferredWaqf : u.preferredWaqf,
            monthlyGoal: monthlyGoal !== undefined ? Number(monthlyGoal) : u.monthlyGoal,
            avatar: avatar !== undefined ? avatar : u.avatar,
          };
        }
        return u;
      });

      fs.writeFileSync(USERS_FILE, JSON.stringify(updatedUsers, null, 2), 'utf-8');

      const updatedUser = updatedUsers.find((u: any) => u.id === authenticatedUser.id);
      const { passwordHash, ...userResponse } = updatedUser;

      res.json({
        success: true,
        user: userResponse
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: 'حدث خطأ أثناء تعديل الملف الشخصي' });
    }
  });

  // API Route: Get User's Personal Donations
  app.get('/api/user/donations', (req, res) => {
    try {
      const user = authenticateToken(req);
      if (!user) {
        return res.status(401).json({ error: 'غير مصرح للوصول، يرجى تسجيل الدخول' });
      }

      const donationsData = fs.readFileSync(DONATIONS_FILE, 'utf-8');
      const donations = JSON.parse(donationsData);

      // Return all donations matching user's email
      const userDonations = donations.filter(
        (d: any) => d.email && d.email.toLowerCase() === user.email.toLowerCase()
      );

      res.json({
        success: true,
        donations: userDonations
      });
    } catch (error) {
      console.error("Fetch user donations error:", error);
      res.status(500).json({ error: 'حدث خطأ أثناء جلب التبرعات' });
    }
  });

  // API Route: Get all active projects
  app.get('/api/projects', (req, res) => {
    try {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading projects:", error);
      res.status(500).json({ error: 'Failed to retrieve projects' });
    }
  });

  // API Route: Record a donation / share subscription
  app.post('/api/donate', (req, res) => {
    try {
      const { projectTitle, amount, donorName, email, phone, isAnonymous, waqfTarget } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }

      // Update project statistics in projects.json
      const projectsData = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const projects = JSON.parse(projectsData);

      let projectMatched = false;
      const updatedProjects = projects.map((p: any) => {
        // If specific project title was provided, match it; otherwise if general waqf or general bank
        if (p.title === projectTitle) {
          projectMatched = true;
          return {
            ...p,
            currentAmount: p.currentAmount + Number(amount),
            donorCount: p.donorCount + 1
          };
        }
        return p;
      });

      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(updatedProjects, null, 2), 'utf-8');

      // Record contribution history in donations.json
      const donationsData = fs.readFileSync(DONATIONS_FILE, 'utf-8');
      const donations = JSON.parse(donationsData);

      const newDonation = {
        id: `don_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        projectTitle: projectTitle || 'البنك الوقفي العام',
        waqfTarget: waqfTarget || 'عام',
        amount: Number(amount),
        donorName: isAnonymous ? 'فاعل خير' : (donorName || 'فاعل خير'),
        email: email || '',
        phone: phone || '',
        isAnonymous: !!isAnonymous,
        timestamp: new Date().toISOString()
      };

      donations.push(newDonation);
      fs.writeFileSync(DONATIONS_FILE, JSON.stringify(donations, null, 2), 'utf-8');

      res.status(200).json({
        success: true,
        donation: newDonation,
        projectMatched
      });
    } catch (error) {
      console.error("Error recording donation:", error);
      res.status(500).json({ error: 'Failed to process contribution' });
    }
  });

  // API Route: Retrieve general stats
  app.get('/api/stats', (req, res) => {
    try {
      const projectsData = fs.readFileSync(PROJECTS_FILE, 'utf-8');
      const projects = JSON.parse(projectsData);

      const donationsData = fs.readFileSync(DONATIONS_FILE, 'utf-8');
      const donations = JSON.parse(donationsData);

      const totalActiveProjects = projects.length;

      // Aggregate total amount & total donor count from both existing initial progress + real transactions
      let totalAmountRaised = projects.reduce((acc: number, curr: any) => acc + curr.currentAmount, 0);
      let totalDonorsCount = projects.reduce((acc: number, curr: any) => acc + curr.donorCount, 0);

      res.json({
        totalAmountRaised,
        totalDonorsCount,
        totalActiveProjects,
        recentDonations: donations.slice(-5).reverse() // send last 5 donations
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: 'Failed to retrieve stats' });
    }
  });

  // API Route: Record Contact Message
  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const contactsData = fs.readFileSync(CONTACTS_FILE, 'utf-8');
      const contacts = JSON.parse(contactsData);

      const newInquiry = {
        id: `inq_${Date.now()}`,
        name,
        email,
        subject: subject || 'استفسار عام',
        message,
        timestamp: new Date().toISOString()
      };

      contacts.push(newInquiry);
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');

      res.status(200).json({ success: true, message: 'Message saved successfully' });
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(500).json({ error: 'Failed to record message' });
    }
  });

  // API Route: AI Waqf Assistant powered by Gemini API
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, chatHistory = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Simple fallback responses if API key is not present yet
        const fallbacks = [
          "أهلاً بك في البنك الوقفي الرقمي (وقفي تك) بالجزائر. أنا مستشارك الرقمي للرد على استفساراتك الشرعية والتقنية حول الأوقاف.",
          "الوقف النقدي جائز شرعاً بفتوى الهيئة الشرعية وهو وسيلة ممتازة ومستدامة للتنمية الاجتماعية والمقاصد الشرعية الشريفة.",
          "يمكنك المساهمة في عدة أوقاف مخصصة كوقف رعاية الأسرة والطفولة، وقف رعاية الأيتام، وقف العلم، وغيرها ومتابعة الأثر لحظياً."
        ];
        const randomAnswer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        return res.json({ reply: randomAnswer + "\n\n(ملاحظة: هذا رد آلي بديل؛ يرجى تهيئة مفتاح GEMINI_API_KEY للاستفادة الكاملة من الذكاء الاصطناعي)" });
      }

      const ai = getGeminiClient();

      // System instruction outlining persona, domain knowledge, and tone
      const systemInstruction =
        "أنت 'مستشار وقفي تك الذكي' - المساعد الافتراضي الرسمي لمنصة (وقفي تك / البنك الوقفي الرقمي في الجزائر). " +
        "تجيب على استفسارات المحسنين والواقفين باللغة العربية الفصحى الودودة والوقورة. " +
        "مهمتك هي:\n" +
        "1. شرح مفهوم الوقف الرقمي والنقدي وتأصيل مشروعيته شرعاً استناداً للسنة الشريفة وفقه المعاملات.\n" +
        "2. شرح أنواع الأسهم الوقفية الثمانية المتوفرة على المنصة بالتفصيل:\n" +
        "   - وقف رعاية الأسرة والطفولة (دعم الأسر المنتجة، حماية الأمهات والطفل)\n" +
        "   - وقف رعاية الأيتام (الكفالة التعليمية والمعيشية الشاملة)\n" +
        "   - وقف العلم (المنح، المدارس والمكتبات الرقمية)\n" +
        "   - وقف الصحة (الأجهزة الطبية، غسيل الكلى، رعاية المعوزين)\n" +
        "   - وقف خدمة القرآن والسنة (كفالة الحلقات، طباعة وتأهيل المصاحف)\n" +
        "   - وقف رعاية المساجد (عمارة وتجهيز بيوت الله بالتكنولوجيا الذكية)\n" +
        "   - وقف البيئة (التشجير، حفر الآبار الجوفية، السقاية والطاقة النظيفة)\n" +
        "   - وقف خدمة المجتمع (الإغاثة، مكافحة الفقر، المشاريع الاجتماعية)\n" +
        "3. إرشاد المستخدمين لكيفية اختيار السهم الوقفي وتحديد المبالغ بالدينار الجزائري (د.ج).\n" +
        "4. تشجيعهم بعبارات إيمانية رقيقة تذكر بفضل الصدقة الجارية وعقد الحبس المؤبد لله تعالى.\n" +
        "تجنب الإفتاء في مسائل معقدة غير وقوفية، ودائماً أحِلهم للهيئة الشرعية عند وجود مسائل خلافية دقيقة. حافظ على إيجاز الرد وسهولة قراءته.";

      // Prepare contents array incorporating history
      const contents = [];

      // Map history if provided
      for (const h of chatHistory) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      }

      // Add the user's latest query
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "عذراً، لم أستطع توليد رد في الوقت الحالي. هل يمكنك إعادة السؤال؟";
      res.json({ reply });

    } catch (error: any) {
      console.error("Gemini API Error in backend:", error);
      res.status(500).json({ error: 'عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.' });
    }
  });

  // Vite Integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();