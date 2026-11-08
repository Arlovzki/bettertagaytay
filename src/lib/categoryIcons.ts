import {
  Book,
  Building2,
  ChartBar,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  MapPin,
  MessagesSquare,
  Newspaper,
  Shield,
  Trash2,
  TreePine,
  Users,
  Wheat,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

// Explicit imports keep the full icon catalogue out of the initial bundle.
const icons: Record<string, LucideIcon> = {
  Book,
  Building2,
  ChartBar,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  MapPin,
  MessagesSquare,
  Newspaper,
  Shield,
  Trash2,
  TreePine,
  Users,
  Wheat,
  Wrench,
};

export function getCategoryIcon(name?: string): LucideIcon {
  return (name && icons[name]) || FileText;
}
