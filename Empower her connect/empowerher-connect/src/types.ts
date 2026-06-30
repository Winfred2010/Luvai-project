export type Language = 'en' | 'sw';

export type UserRole = 'mother' | 'trainer' | 'mentor' | 'employer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  location: string;
  bio: string;
  skills: string[];
  swahiliFluent: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'helpline' | 'shelter' | 'police' | 'hospital';
  location: string;
  descriptionEn: string;
  descriptionSw: string;
}

export interface LegalReferral {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  location: string;
  experienceEn: string;
  experienceSw: string;
}

export interface CounselingResource {
  id: string;
  titleEn: string;
  titleSw: string;
  contentEn: string;
  contentSw: string;
  category: 'mental-health' | 'healing' | 'parenting';
}

export interface Course {
  id: string;
  titleEn: string;
  titleSw: string;
  category: string;
  trainerName: string;
  descriptionEn: string;
  descriptionSw: string;
  durationEn: string;
  durationSw: string;
  modulesEn: string[];
  modulesSw: string[];
  enrolledUsers: string[]; // User IDs
  image: string;
}

export interface Job {
  id: string;
  titleEn: string;
  titleSw: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  descriptionEn: string;
  descriptionSw: string;
  requirementsEn: string[];
  requirementsSw: string[];
  postedBy: string; // Employer User ID
  applicants: { userId: string; name: string; resumeUrl?: string; date: string }[];
}

export interface Product {
  id: string;
  titleEn: string;
  titleSw: string;
  price: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  image: string;
  descriptionEn: string;
  descriptionSw: string;
  category: string;
  approved: boolean;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  title: string;
  content: string;
  date: string;
  category: 'healing' | 'skills' | 'legal' | 'parenting' | 'general';
  likes: string[]; // User IDs
  replies: ForumReply[];
}

export interface ForumReply {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  titleEn: string;
  titleSw: string;
  date: string;
  time: string;
  location: string;
  type: 'workshop' | 'support-group' | 'training' | 'webinar';
  descriptionEn: string;
  descriptionSw: string;
}

export interface DonationCamp {
  id: string;
  titleEn: string;
  titleSw: string;
  descriptionEn: string;
  descriptionSw: string;
  goal: number;
  raised: number;
  supporters: number;
  image: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  titleEn: string;
  titleSw: string;
  contentEn: string;
  contentSw: string;
  image: string;
  videoUrl?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface Mentor {
  id: string;
  name: string;
  specialtyEn: string;
  specialtySw: string;
  location: string;
  bioEn: string;
  bioSw: string;
  avatar: string;
  matchingMothers: string[]; // Mother User IDs
}
