import React from 'react';
import {
  Coins,
  Building,
  Sprout,
  GraduationCap,
  HeartPulse,
  Users,
  Home,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Award,
  FileText,
  Heart,
  ShieldCheck,
  Search,
  TrendingUp,
  DollarSign,
  BookOpen
} from 'lucide-react';

const iconMap = {
  Coins,
  Building,
  Sprout,
  GraduationCap,
  HeartPulse,
  Users,
  Home,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Printer,
  Share2,
  Award,
  FileText,
  Heart,
  ShieldCheck,
  Search,
  TrendingUp,
  DollarSign,
  BookOpen
};

export type IconName = keyof typeof iconMap;

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number | string;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ name, className = '', size }) => {
  const IconComponent = iconMap[name as IconName] || HelpCircleFallback;
  return <IconComponent className={className} size={size} />;
};

const HelpCircleFallback = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
