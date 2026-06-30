import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { 
  CommunityReport, 
  DevelopmentProject, 
  UserProfile, 
  AppNotification, 
  Comment, 
  StatusHistoryEntry,
  ReportCategory,
  ReportStatus
} from './src/types';

// Declare initial mock data reflecting Kenyan cities
let reports: CommunityReport[] = [
  {
    id: 'rep-101',
    title: 'Burst Main Water Pipe on Ring Road, Westlands',
    category: 'water',
    description: 'A major water distribution pipe burst early this morning. Water is flooding onto the road near the Sarit Center roundabout. Millions of liters are being wasted, and local estates have lost pressure.',
    status: 'assigned',
    photoUrl: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=60', // water main pipe burst
    location: {
      lat: -1.2635,
      lng: 36.8021,
      county: 'Nairobi',
      address: 'Ring Road, near Sarit Center Roundabout, Westlands'
    },
    reporterId: 'user-001',
    reporterName: 'Winfred Luvai',
    reporterEmail: 'winfredluvai@gmail.com',
    reporterRole: 'citizen',
    likes: ['user-002', 'user-003'],
    assignedTo: {
      agencyName: 'Nairobi Water and Sewerage Company (NCWSC)',
      updatedAt: new Date(Date.now() - 36 * 3600000).toISOString()
    },
    comments: [
      {
        id: 'c-1',
        authorId: 'user-002',
        authorName: 'David Omondi',
        authorEmail: 'david.omondi@gmail.com',
        authorRole: 'citizen',
        text: 'This has made the Westlands traffic even worse today! Hope NCWSC comes soon.',
        createdAt: new Date(Date.now() - 40 * 3600000).toISOString()
      },
      {
        id: 'c-2',
        authorId: 'user-agency',
        authorName: 'NCWSC Support Team',
        authorEmail: 'support@nairobiwater.co.ke',
        authorRole: 'agency',
        text: 'We have dispatched an emergency crew to shut off the main valve and initiate repairs. Repair should take 6 hours.',
        createdAt: new Date(Date.now() - 35 * 3600000).toISOString()
      }
    ],
    statusHistory: [
      {
        status: 'reported',
        updatedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        note: 'Initial report submitted with photo and GPS location.',
        updatedBy: 'Winfred Luvai'
      },
      {
        status: 'under_review',
        updatedAt: new Date(Date.now() - 42 * 3600000).toISOString(),
        note: 'NCWSC engineers reviewed and classified as high severity.',
        updatedBy: 'Admin Team'
      },
      {
        status: 'assigned',
        updatedAt: new Date(Date.now() - 36 * 3600000).toISOString(),
        note: 'Assigned to NCWSC Westlands Emergency Repair Crew.',
        updatedBy: 'Admin Team'
      }
    ],
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 3600000).toISOString()
  },
  {
    id: 'rep-102',
    title: 'Exposed High-Voltage Cable Sparking during Rain',
    category: 'electricity',
    description: 'An overhead power line has snapped and fallen near the path leading to Nyali Beach. It is sparking continuously, especially when damp, presenting an extreme electrocution hazard to pedestrians.',
    status: 'reported',
    location: {
      lat: -4.0298,
      lng: 39.7121,
      county: 'Mombasa',
      address: 'Beach Access Road near Nyali Beach Hotel, Nyali'
    },
    reporterId: 'user-002',
    reporterName: 'David Omondi',
    reporterEmail: 'david.omondi@gmail.com',
    reporterRole: 'citizen',
    likes: ['user-001', 'user-003', 'user-004'],
    comments: [],
    statusHistory: [
      {
        status: 'reported',
        updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        note: 'Reported snapping power lines near beach path. Urgent response required.',
        updatedBy: 'David Omondi'
      }
    ],
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: 'rep-103',
    title: 'Severe Potholes causing Accidents on Langata Road',
    category: 'roads',
    description: 'A 20-meter stretch of Langata Road opposite the Galleria Mall has disintegrated into deep potholes. Vehicles are braking suddenly or swerving into oncoming traffic to avoid them, causing minor crashes.',
    status: 'in_progress',
    photoUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=60', // pothole / road construction
    location: {
      lat: -1.3421,
      lng: 36.7645,
      county: 'Nairobi',
      address: 'Langata Road, opposite Galleria Mall'
    },
    reporterId: 'user-003',
    reporterName: 'Amina Kiprop',
    reporterEmail: 'amina.kip@gmail.com',
    reporterRole: 'citizen',
    likes: ['user-001', 'user-002', 'user-005', 'user-006'],
    comments: [
      {
        id: 'c-3',
        authorId: 'user-ngo',
        authorName: 'Kenya Road Watch NGO',
        authorEmail: 'info@roadwatch.or.ke',
        authorRole: 'ngo',
        text: 'We are tracking this report. We have petitioned KeNHA regarding this section of Langata Road, which sees very heavy traffic.',
        createdAt: new Date(Date.now() - 10 * 3600000).toISOString()
      }
    ],
    statusHistory: [
      {
        status: 'reported',
        updatedAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
        note: 'Pothole report logged.',
        updatedBy: 'Amina Kiprop'
      },
      {
        status: 'under_review',
        updatedAt: new Date(Date.now() - 12 * 24 * 3600000).toISOString(),
        note: 'KeNHA confirmed inspection.',
        updatedBy: 'Admin Team'
      },
      {
        status: 'assigned',
        updatedAt: new Date(Date.now() - 8 * 24 * 3600000).toISOString(),
        note: 'Assigned to KURA contractor for emergency patching.',
        updatedBy: 'Admin Team'
      },
      {
        status: 'in_progress',
        updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
        note: 'Contractor is currently on site milling and patching the road surface.',
        updatedBy: 'Kenya Urban Roads Authority'
      }
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    linkedProjectId: 'proj-201'
  },
  {
    id: 'rep-104',
    title: 'Flooded Health Clinic due to Clogged Drainage',
    category: 'infrastructure',
    description: 'The local community health dispensary in Kisumu Central is flooded because the external stormwater drainage channels are fully blocked with plastic wastes and sediment. Patients cannot access treatment.',
    status: 'under_review',
    location: {
      lat: -0.1022,
      lng: 34.7617,
      county: 'Kisumu',
      address: 'Central Health Dispensary, Kisumu Town'
    },
    reporterId: 'user-004',
    reporterName: 'John Kamau',
    reporterEmail: 'kamau.j@outlook.com',
    reporterRole: 'citizen',
    likes: ['user-003'],
    comments: [],
    statusHistory: [
      {
        status: 'reported',
        updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
        note: 'Health clinic flooded from poor storm drainage.',
        updatedBy: 'John Kamau'
      },
      {
        status: 'under_review',
        updatedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        note: 'County engineering team notified to inspect storm drains.',
        updatedBy: 'Admin Team'
      }
    ],
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600000).toISOString()
  }
];

let projects: DevelopmentProject[] = [
  {
    id: 'proj-201',
    title: 'Nairobi Urban Infrastructure Recovery Project',
    description: 'Comprehensive rehabilitation of key transport corridors and stormwater structures in Nairobi, including patching major arterials (Langata Road, Ngong Road) and clearing major blockages.',
    county: 'Nairobi',
    budget: 'KES 24,500,000',
    status: 'ongoing',
    sector: 'roads',
    fundedBy: 'KeNHA & Kenya Urban Roads Authority (KURA)',
    targetCompletionDate: '2026-10-15',
    progress: 40,
    location: {
      lat: -1.3000,
      lng: 36.7800
    },
    reportsLinked: ['rep-103'],
    updates: [
      {
        id: 'u-1',
        title: 'Contractor Mobilization',
        description: 'Contractor moved equipment onto Langata Road and Ngong Road and completed initial site surveys.',
        date: new Date(Date.now() - 10 * 24 * 3600000).toDateString()
      },
      {
        id: 'u-2',
        title: 'Langata Galleria Road Section Repairs',
        description: 'Began scraping and re-asphalting the highly degraded sections opposite Galleria Mall.',
        date: new Date(Date.now() - 2 * 24 * 3600000).toDateString()
      }
    ],
    createdAt: new Date(Date.now() - 15 * 24 * 3600000).toISOString()
  },
  {
    id: 'proj-202',
    title: 'Coastal Clean Water and Sanitation Expansion',
    description: 'Drilling solar-powered community boreholes and repairing critical clean water supply conduits across Mombasa county, prioritizing low-income areas and schools.',
    county: 'Mombasa',
    budget: 'KES 18,000,000',
    status: 'planning',
    sector: 'water',
    fundedBy: 'Red Cross Kenya & World Bank Dev Partner',
    targetCompletionDate: '2027-01-20',
    progress: 10,
    location: {
      lat: -4.0500,
      lng: 39.6500
    },
    reportsLinked: [],
    updates: [
      {
        id: 'u-3',
        title: 'Stakeholder Engagement',
        description: 'Engaged with community leaders in Nyali and Likoni to finalize borehole sites.',
        date: new Date(Date.now() - 5 * 24 * 3600000).toDateString()
      }
    ],
    createdAt: new Date(Date.now() - 8 * 24 * 3600000).toISOString()
  },
  {
    id: 'proj-203',
    title: 'Ukambani Water Pipeline Extension Project',
    description: 'A mega-infrastructure water pipeline project designed to transfer clean water from Mzima Springs and local dams directly to communities in Makueni via Machakos and Kitui counties, addressing historical water shortages in the Ukambani region.',
    county: 'Makueni, Machakos, Kitui',
    budget: 'KES 230,000,000,000',
    status: 'ongoing',
    sector: 'water',
    fundedBy: 'National Government of Kenya & African Development Bank (AfDB)',
    targetCompletionDate: '2029-12-15',
    progress: 25,
    location: {
      lat: -1.5600,
      lng: 37.4500
    },
    reportsLinked: [],
    updates: [
      {
        id: 'u-203-2',
        title: 'Pipe Laying Commencement',
        description: 'Excavation and laying of high-pressure steel pipelines have commenced from the Mzima Springs water source towards Machakos and Kitui bulk distribution tanks.',
        date: new Date(Date.now() - 12 * 24 * 3600000).toDateString()
      },
      {
        id: 'u-203-1',
        title: 'Funding Sign-off & Design Finalization',
        description: 'The KES 230 Billion joint funding was officially signed off by parastatals. The topographical pipeline route across Kitui, Machakos, and Makueni has been finalized.',
        date: new Date(Date.now() - 45 * 24 * 3600000).toDateString()
      }
    ],
    createdAt: new Date(Date.now() - 60 * 24 * 3600000).toISOString()
  }
];

let notifications: AppNotification[] = [
  {
    id: 'not-1',
    userId: 'user-001',
    title: 'Report Assigned',
    message: 'Your report "Burst Main Water Pipe on Ring Road, Westlands" has been assigned to Nairobi Water and Sewerage Company (NCWSC).',
    read: false,
    type: 'status_change',
    linkedId: 'rep-101',
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString()
  },
  {
    id: 'not-2',
    userId: 'user-003',
    title: 'Report Linked to Project',
    message: 'Your road hazard report is now linked to the "Nairobi Urban Infrastructure Recovery Project". Track actual works on the map.',
    read: true,
    type: 'project_link',
    linkedId: 'rep-103',
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
  }
];

// In-memory User Profiles to handle role switching easily in the frontend
let userProfiles: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Winfred Luvai',
    email: 'winfredluvai@gmail.com',
    role: 'citizen',
    county: 'Nairobi',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-agency',
    name: 'NCWSC Engineer',
    email: 'support@nairobiwater.co.ke',
    role: 'agency',
    county: 'Nairobi',
    agencyName: 'Nairobi Water and Sewerage Company (NCWSC)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-ngo',
    name: 'Sarah Mwangi',
    email: 'sarah.m@ngo-watch.org',
    role: 'ngo',
    county: 'Mombasa',
    ngoName: 'Kenya Development Watch NGO',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-admin',
    name: 'CivicLink Admin',
    email: 'admin@civiclink.ke',
    role: 'admin',
    county: 'Nairobi',
    createdAt: new Date().toISOString()
  }
];

// Lazy helper for Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // User Profiles
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(userProfiles);
  });

  app.post('/api/users/profile', (req: Request, res: Response) => {
    const { email, name, role, county, agencyName, ngoName } = req.body;
    let profile = userProfiles.find(u => u.email === email);
    if (profile) {
      profile.name = name || profile.name;
      profile.role = role || profile.role;
      profile.county = county || profile.county;
      if (agencyName) profile.agencyName = agencyName;
      if (ngoName) profile.ngoName = ngoName;
    } else {
      profile = {
        id: `user-${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        role: role || 'citizen',
        county: county || 'Nairobi',
        agencyName,
        ngoName,
        createdAt: new Date().toISOString()
      };
      userProfiles.push(profile);
    }
    res.json(profile);
  });

  // Reports Endpoints
  app.get('/api/reports', (req: Request, res: Response) => {
    res.json(reports);
  });

  app.post('/api/reports', (req: Request, res: Response) => {
    const { title, category, description, photoUrl, videoUrl, location, reporterId, reporterName, reporterEmail, reporterRole } = req.body;
    
    if (!title || !category || !description || !location) {
      res.status(400).json({ error: 'Title, category, description, and location are required.' });
      return;
    }

    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      title,
      category: category as ReportCategory,
      description,
      status: 'reported',
      photoUrl,
      videoUrl,
      location,
      reporterId: reporterId || 'anonymous',
      reporterName: reporterName || 'Anonymous Citizen',
      reporterEmail: reporterEmail || 'anonymous@civiclink.ke',
      reporterRole: (reporterRole as any) || 'citizen',
      likes: [],
      comments: [],
      statusHistory: [
        {
          status: 'reported',
          updatedAt: new Date().toISOString(),
          note: 'Report submitted by citizen.',
          updatedBy: reporterName || 'Citizen'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reports.unshift(newReport);

    // Notify administrators or related agencies
    notifications.push({
      id: `not-${Date.now()}`,
      userId: 'user-admin', // Alert admin
      title: 'New Challenge Reported',
      message: `A new ${category} challenge: "${title}" in ${location.county} county has been reported.`,
      read: false,
      type: 'system',
      linkedId: newReport.id,
      createdAt: new Date().toISOString()
    });

    res.status(201).json(newReport);
  });

  // Update report status
  app.put('/api/reports/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, note, updatedBy } = req.body;

    const reportIndex = reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    const report = reports[reportIndex];
    report.status = status as ReportStatus;
    report.updatedAt = new Date().toISOString();
    report.statusHistory.push({
      status: status as ReportStatus,
      updatedAt: new Date().toISOString(),
      note: note || `Status updated to ${status.replace('_', ' ')}.`,
      updatedBy: updatedBy || 'System'
    });

    // Notify the citizen who reported it
    if (report.reporterId !== 'anonymous') {
      notifications.push({
        id: `not-${Date.now()}`,
        userId: report.reporterId,
        title: 'Report Status Update',
        message: `Your report "${report.title}" status is now: ${status.toUpperCase().replace('_', ' ')}.`,
        read: false,
        type: 'status_change',
        linkedId: report.id,
        createdAt: new Date().toISOString()
      });
    }

    res.json(report);
  });

  // Assign report to agency/department
  app.put('/api/reports/:id/assign', (req: Request, res: Response) => {
    const { id } = req.params;
    const { agencyName, updatedBy } = req.body;

    const report = reports.find(r => r.id === id);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    report.status = 'assigned';
    report.assignedTo = {
      agencyName,
      updatedAt: new Date().toISOString()
    };
    report.updatedAt = new Date().toISOString();
    report.statusHistory.push({
      status: 'assigned',
      updatedAt: new Date().toISOString(),
      note: `Assigned to ${agencyName} for resolution.`,
      updatedBy: updatedBy || 'Admin Team'
    });

    // Notify reporter
    if (report.reporterId !== 'anonymous') {
      notifications.push({
        id: `not-${Date.now()}`,
        userId: report.reporterId,
        title: 'Report Assigned',
        message: `Your report "${report.title}" has been assigned to ${agencyName}.`,
        read: false,
        type: 'status_change',
        linkedId: report.id,
        createdAt: new Date().toISOString()
      });
    }

    res.json(report);
  });

  // Add Comment
  app.post('/api/reports/:id/comments', (req: Request, res: Response) => {
    const { id } = req.params;
    const { authorId, authorName, authorEmail, authorRole, text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Comment text is required.' });
      return;
    }

    const report = reports.find(r => r.id === id);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      authorId: authorId || 'anonymous',
      authorName: authorName || 'Anonymous User',
      authorEmail: authorEmail || '',
      authorRole: authorRole || 'citizen',
      text,
      createdAt: new Date().toISOString()
    };

    report.comments.push(newComment);
    report.updatedAt = new Date().toISOString();

    // Notify reporter if comment from someone else
    if (report.reporterId !== 'anonymous' && report.reporterId !== authorId) {
      notifications.push({
        id: `not-${Date.now()}`,
        userId: report.reporterId,
        title: 'New Comment on Report',
        message: `${authorName} commented on your report: "${text.substring(0, 40)}${text.length > 40 ? '...' : ''}"`,
        read: false,
        type: 'comment',
        linkedId: report.id,
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json(newComment);
  });

  // Toggle Upvote / Like
  app.post('/api/reports/:id/like', (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const report = reports.find(r => r.id === id);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    const likeIndex = report.likes.indexOf(userId);
    if (likeIndex > -1) {
      // Remove upvote
      report.likes.splice(likeIndex, 1);
    } else {
      // Add upvote
      report.likes.push(userId);
    }
    report.updatedAt = new Date().toISOString();

    res.json({ likes: report.likes });
  });

  // Projects Endpoints
  app.get('/api/projects', (req: Request, res: Response) => {
    res.json(projects);
  });

  app.post('/api/projects', (req: Request, res: Response) => {
    const { title, description, county, budget, sector, fundedBy, targetCompletionDate, location } = req.body;

    if (!title || !description || !county || !budget || !sector || !fundedBy || !location) {
      res.status(400).json({ error: 'Required project fields missing' });
      return;
    }

    const newProject: DevelopmentProject = {
      id: `proj-${Date.now()}`,
      title,
      description,
      county,
      budget,
      status: 'planning',
      sector,
      fundedBy,
      targetCompletionDate: targetCompletionDate || new Date(Date.now() + 365 * 24 * 3600000).toISOString().split('T')[0],
      progress: 0,
      location,
      reportsLinked: [],
      updates: [
        {
          id: `pu-${Date.now()}`,
          title: 'Project Planned',
          description: 'Development project has been proposed and listed on CivicLink.',
          date: new Date().toDateString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    projects.unshift(newProject);
    res.status(201).json(newProject);
  });

  // Link report to project
  app.put('/api/projects/:id/link-report', (req: Request, res: Response) => {
    const { id } = req.params;
    const { reportId } = req.body;

    const project = projects.find(p => p.id === id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const report = reports.find(r => r.id === reportId);
    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }

    if (!project.reportsLinked.includes(reportId)) {
      project.reportsLinked.push(reportId);
    }
    report.linkedProjectId = project.id;
    report.status = 'in_progress';
    report.updatedAt = new Date().toISOString();
    report.statusHistory.push({
      status: 'in_progress',
      updatedAt: new Date().toISOString(),
      note: `Linked to active project: "${project.title}" for resolution.`,
      updatedBy: 'Admin Team'
    });

    // Notify citizen
    if (report.reporterId !== 'anonymous') {
      notifications.push({
        id: `not-${Date.now()}`,
        userId: report.reporterId,
        title: 'Report Linked to Project',
        message: `Excellent! Your reported challenge "${report.title}" has been linked to development project "${project.title}".`,
        read: false,
        type: 'project_link',
        linkedId: report.id,
        createdAt: new Date().toISOString()
      });
    }

    res.json({ project, report });
  });

  // Add Project Update
  app.post('/api/projects/:id/updates', (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description, progress, status } = req.body;

    const project = projects.find(p => p.id === id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const newUpdate = {
      id: `pu-${Date.now()}`,
      title,
      description,
      date: new Date().toDateString()
    };

    project.updates.unshift(newUpdate);
    if (typeof progress === 'number') {
      project.progress = Math.min(100, Math.max(0, progress));
    }
    if (status) {
      project.status = status;
    }

    // Auto-update linked reports if status becomes completed
    if (status === 'completed') {
      project.reportsLinked.forEach(repId => {
        const linkedRep = reports.find(r => r.id === repId);
        if (linkedRep && linkedRep.status !== 'resolved') {
          linkedRep.status = 'resolved';
          linkedRep.updatedAt = new Date().toISOString();
          linkedRep.statusHistory.push({
            status: 'resolved',
            updatedAt: new Date().toISOString(),
            note: `Automatically resolved as the linked project "${project.title}" has been completed!`,
            updatedBy: 'Development Partner'
          });

          // Notify reporter
          if (linkedRep.reporterId !== 'anonymous') {
            notifications.push({
              id: `not-${Date.now()}`,
              userId: linkedRep.reporterId,
              title: 'Challenge Resolved!',
              message: `Great news! The linked project "${project.title}" is complete. Your reported issue "${linkedRep.title}" is resolved.`,
              read: false,
              type: 'status_change',
              linkedId: linkedRep.id,
              createdAt: new Date().toISOString()
            });
          }
        }
      });
    }

    res.json(project);
  });

  // Notifications Endpoints
  app.get('/api/notifications/:userId', (req: Request, res: Response) => {
    const { userId } = req.params;
    const userNotifs = notifications.filter(n => n.userId === userId);
    res.json(userNotifs);
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const { id } = req.params;
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      res.json(notif);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  });

  // Clean Notifications
  app.post('/api/notifications/:userId/clear', (req: Request, res: Response) => {
    const { userId } = req.params;
    notifications = notifications.filter(n => n.userId !== userId);
    res.json({ status: 'cleared' });
  });

  // --- Gemini AI Assistant Chat Route ---
  app.post('/api/chat', async (req: Request, res: Response) => {
    const { messages, userProfile, currentReportDraft } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages list is required.' });
      return;
    }

    const client = getGeminiClient();

    if (!client) {
      // Fallback response if API key is not configured yet
      const lastMessage = messages[messages.length - 1]?.text || '';
      res.json({
        reply: `Hello! I am **CivicLink AI Assistant**, designed to help you report challenges in your Kenyan community and link you to county departments, NGOs, and resources. 
        \n\n*(Note: Gemini AI is currently running in **Demo Mode** since process.env.GEMINI_API_KEY is not configured yet. Configure it under the Settings panel to enable fully intelligent chat.)*
        \n\nBased on your message: "${lastMessage}", I recommend contacting the **County Government Urban Planning Department** or logging a formal challenge on our **Reports Dashboard** by clicking the "New Report" tab. Let me know if you would like me to guide you on how to formulate a report!`,
        suggestions: [
          'How do I file a water issue?',
          'What does Nairobi Water handle?',
          'How does CivicLink help county governments?'
        ]
      });
      return;
    }

    try {
      // Build an informative, context-aware prompt about Kenyan civic structures
      const systemInstruction = `You are the "CivicLink Kenya" AI Assistant. Your mission is to help Kenyan citizens report community challenges (like lack of clean water, electricity blackouts, potholes, broken bridges, clogged drainage, flooded dispensaries) and suggest the right government agencies, utilities, county governments, or NGOs to contact.
      
      When citizens chat with you:
      1. Always be polite, supportive, encouraging, and clear.
      2. Ground your knowledge in the Kenyan context (County Governments, Devolution, National Agencies like KeNHA (National Highways), KURA (Urban Roads), KeRRA (Rural Roads), Kenya Power (KPLC), NCWSC (Nairobi Water), Mombasa Water (MOWASSCO), Kisumu Water (KIWASCO), etc.).
      3. Help them draft and structure their report: suggest standard titles, specific details they should include, and correct categories.
      4. Suggest the concrete government department or parastatal responsible:
         - Water/Sewerage: County Water Service Providers (e.g., NCWSC in Nairobi, MOWASSCO in Mombasa).
         - Electricity/Transformers: Kenya Power (KPLC) or Rural Electrification Authority (REA).
         - Major Highways: KeNHA (Kenya National Highways Authority).
         - Urban/County Roads: KURA (Kenya Urban Roads Authority) or County Government Road Department.
         - Rural Roads: KeRRA (Kenya Rural Roads Authority).
         - Health Clinics: County Department of Health.
      5. Offer ideas on how to track progress and hold entities accountable.
      6. Limit responses to a professional, scannable, clean markdown format. Avoid overly verbose text. Use bullet points for steps.

      Current user profile context: ${JSON.stringify(userProfile || { name: 'Citizen', role: 'citizen', county: 'Nairobi' })}.
      If there is a partial draft the user is filling, use it to suggest improvements: ${JSON.stringify(currentReportDraft || {})}.
      `;

      // Convert messages to Gemini SDK format
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      // Add user profile and instruction
      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I apologize, but I couldn't formulate a response. Please try again.";
      
      // Formulate some contextual button suggestions based on the response using a quick secondary logic or keywords
      const lowerReply = replyText.toLowerCase();
      let suggestions = ['How do I report a pothole?', 'Who handles broken sewers?', 'Show active development projects'];
      if (lowerReply.includes('water') || lowerReply.includes('pipe') || lowerReply.includes('sewer')) {
        suggestions = ['How to report broken sewers', 'How long do water repairs take?', 'Water parastatals in Kenya'];
      } else if (lowerReply.includes('power') || lowerReply.includes('kplc') || lowerReply.includes('electricity') || lowerReply.includes('transformer')) {
        suggestions = ['Reporting blackouts to KPLC', 'Dangerous electrical wires guidelines', 'Solar power initiatives'];
      } else if (lowerReply.includes('road') || lowerReply.includes('pothole') || lowerReply.includes('bridge') || lowerReply.includes('kenha')) {
        suggestions = ['Difference between KeNHA and KURA', 'Reporting a missing bridge', 'Who funds county road repairs?'];
      }

      res.json({
        reply: replyText,
        suggestions
      });

    } catch (err: any) {
      console.error('Gemini API Error in Server: ', err);
      res.status(500).json({ 
        error: 'Error generating response from AI assistant.', 
        details: err.message,
        reply: "I ran into an issue communicating with my brain (Gemini API). Please verify your API Key is set correctly in Settings > Secrets or try again shortly!"
      });
    }
  });

  // --- End of API Routes ---

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicLink Kenya server listening on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start CivicLink Kenya Server:', err);
});
