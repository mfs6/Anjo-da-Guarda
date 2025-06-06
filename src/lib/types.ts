
export interface ChildProfile {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD for simplicity
  profilePictureUrl?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  ageDue: string; // e.g., "Ao Nascer", "2 meses"
  recommendedDate?: string; // Calculated based on DOB
  status: 'pending' | 'administered' | 'missed';
  administeredDate?: string;
}

export interface Milestone {
  id: string;
  name: string;
  ageRange: string; // e.g., "0-2 meses"
  description: string;
  achieved: boolean;
  achievedDate?: string;
  videoUrl?: string; // For uploaded video
}

export interface NutritionTip {
  id: string;
  ageGroup: string; // e.g., "0-6 meses", "6-12 meses"
  title: string;
  content: string;
}

export interface SymptomCheckerInput {
  symptoms: string[];
  ageInMonths: number;
}

export interface SymptomCheckerResult {
  suggestion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  shouldSeeDoctor: boolean;
}

export interface Appointment {
  id: string;
  childId: string;
  professionalName: string;
  specialty: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  location?: string;
  notes?: string;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
};
