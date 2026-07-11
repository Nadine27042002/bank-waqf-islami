export type Page = 'home' | 'waqf' | 'invest' | 'projects' | 'culture' | 'contact' | 'dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  preferredWaqf: string;
  monthlyGoal: number;
}

export interface UserDonation {
  id: string;
  projectTitle: string;
  waqfTarget: string;
  amount: number;
  donorName: string;
  email: string;
  phone: string;
  isAnonymous: boolean;
  timestamp: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'educational' | 'health' | 'social' | 'agricultural';
  targetAmount: number;
  currentAmount: number;
  donorCount: number;
  image: string;
}

export interface WaqfTypeDetail {
  id: string;
  name: string;
  shortDef: string;
  evidence: string;
  evidenceSource: string;
  examples: string[];
  icon: string;
}

export interface ContributionData {
  fullName: string;
  phone: string;
  email: string;
  waqfType: string;
  amount: number;
  paymentMethod: string;
  isAnonymous: boolean;
}

export interface QuranVerse {
  text: string;
  source: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
