export interface Location {
  lat: number;
  lng: number;
  county: string;
  address: string;
}

export type ReportCategory = 'water' | 'electricity' | 'roads' | 'infrastructure' | 'health' | 'other';

export type ReportStatus = 'reported' | 'under_review' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: UserRole;
  text: string;
  createdAt: string;
}

export interface StatusHistoryEntry {
  status: ReportStatus;
  updatedAt: string;
  note: string;
  updatedBy: string; // Name of user or agency
}

export interface CommunityReport {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  photoUrl?: string; // Base64 or placeholder
  videoUrl?: string; // Base64 or placeholder
  location: Location;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterRole: UserRole;
  likes: string[]; // List of userIds who upvoted
  assignedTo?: {
    agencyName: string;
    assigneeId?: string;
    updatedAt: string;
  };
  comments: Comment[];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
  linkedProjectId?: string; // If an NGO or Gov project is addressing this
}

export type ProjectStatus = 'planning' | 'ongoing' | 'completed' | 'suspended';
export type ProjectSector = 'water' | 'energy' | 'roads' | 'health' | 'education' | 'other';

export interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface DevelopmentProject {
  id: string;
  title: string;
  description: string;
  county: string;
  budget: string; // e.g. "KES 12,500,000"
  status: ProjectStatus;
  sector: ProjectSector;
  fundedBy: string; // e.g. "Nairobi County", "World Bank", "Safaricom Foundation"
  targetCompletionDate: string;
  progress: number; // 0 - 100
  location: {
    lat: number;
    lng: number;
  };
  reportsLinked: string[]; // Linked report IDs
  updates: ProjectUpdate[];
  createdAt: string;
}

export type UserRole = 'citizen' | 'agency' | 'ngo' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  county: string;
  agencyName?: string; // Optional (only if role is agency)
  ngoName?: string; // Optional (only if role is ngo)
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'status_change' | 'comment' | 'project_link' | 'system';
  linkedId?: string; // ID of report or project
  createdAt: string;
}
