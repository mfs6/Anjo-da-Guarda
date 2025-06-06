import type { Vaccine, Milestone, NutritionTip } from './types';
import { CalendarDays, Syringe, Star, Apple, Stethoscope, User, ShieldCheck, Activity, Baby, Users } from 'lucide-react';

export const APP_NAME = "Anjo da Guarda";
export const DEFAULT_CHILD_ID = "defaultChild";

export const NAV_ITEMS = [
  { title: "Painel", href: "/dashboard", icon: Activity },
  { title: "Vacinas", href: "/vaccines", icon: Syringe },
  { title: "Marcos", href: "/milestones", icon: Star },
  { title: "Nutrição", href: "/nutrition", icon: Apple },
  { title: "Sintomas", href: "/symptoms", icon: Stethoscope },
  { title: "Perfil", href: "/profile", icon: User },
];

export const INITIAL_VACCINES: Vaccine[] = [
  { id: 'bcg', name: 'BCG (Bacilo Calmette-Guérin)', description: 'Previne formas graves de tuberculose.', ageDue: 'Ao Nascer', status: 'pending' },
  { id: 'hep_b_dose1', name: 'Hepatite B - 1ª dose', description: 'Previne a infecção pelo vírus da hepatite B.', ageDue: 'Ao Nascer', status: 'pending' },
  { id: 'dtpa_dose1', name: 'DTPa/DTPw (Tríplice Bacteriana) - 1ª dose', description: 'Previne difteria, tétano e coqueluche.', ageDue: '2 meses', status: 'pending' },
  { id: 'hib_dose1', name: 'Haemophilus influenzae tipo b (Hib) - 1ª dose', description: 'Previne meningite e outras infecções.', ageDue: '2 meses', status: 'pending' },
  { id: 'polio_dose1', name: 'Poliomielite (VIP/VOP) - 1ª dose', description: 'Previne a paralisia infantil.', ageDue: '2 meses', status: 'pending' },
  { id: 'pneumo_dose1', name: 'Pneumocócica Conjugada - 1ª dose', description: 'Previne pneumonia, meningite e otite.', ageDue: '2 meses', status: 'pending' },
  { id: 'rotavirus_dose1', name: 'Rotavírus - 1ª dose', description: 'Previne diarreia grave por rotavírus.', ageDue: '2 meses', status: 'pending' },
  // Add more vaccines as needed
];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'smile', name: 'Primeiro Sorriso Social', ageRange: '0-2 meses', description: 'Sorri espontaneamente em resposta a estímulos sociais.', achieved: false },
  { id: 'head_control', name: 'Controle da Cabeça', ageRange: '2-4 meses', description: 'Sustenta a cabeça quando de bruços ou sentado com apoio.', achieved: false },
  { id: 'roll_over', name: 'Rolar', ageRange: '4-6 meses', description: 'Consegue rolar da barriga para as costas e vice-versa.', achieved: false },
  { id: 'sit_unsupported', name: 'Sentar sem Apoio', ageRange: '6-8 meses', description: 'Senta-se por alguns momentos sem precisar de apoio.', achieved: false },
  { id: 'crawl', name: 'Engatinhar', ageRange: '7-10 meses', description: 'Move-se engatinhando ou arrastando-se.', achieved: false },
  { id: 'first_words', name: 'Primeiras Palavras', ageRange: '9-12 meses', description: 'Começa a dizer palavras simples como "mamã" ou "papá".', achieved: false },
  { id: 'walk_unassisted', name: 'Andar Sozinho', ageRange: '12-15 meses', description: 'Dá os primeiros passos sem ajuda.', achieved: false },
  // Add more milestones
];

export const NUTRITION_TIPS: NutritionTip[] = [
  { id: 'tip1', ageGroup: '0-6 meses', title: 'Amamentação Exclusiva', content: 'O leite materno é o alimento ideal para o bebê nos primeiros 6 meses. Ofereça sob livre demanda.' },
  { id: 'tip2', ageGroup: '0-6 meses', title: 'Fórmulas Infantis', content: 'Se a amamentação não for possível, utilize fórmulas infantis adequadas sob orientação médica.' },
  { id: 'tip3', ageGroup: '6-12 meses', title: 'Introdução Alimentar', content: 'A partir dos 6 meses, inicie a introdução de alimentos complementares de forma gradual e variada.' },
  { id: 'tip4', ageGroup: '6-12 meses', title: 'Alimentos Amassados', content: 'Ofereça frutas, legumes e verduras amassados ou em pedaços pequenos e macios.' },
  { id: 'tip5', ageGroup: '1-2 anos', title: 'Variedade é a Chave', content: 'Continue oferecendo uma grande variedade de alimentos saudáveis, incluindo todos os grupos alimentares.' },
  { id: 'tip6', ageGroup: '1-2 anos', title: 'Evite Ultraprocessados', content: 'Limite o consumo de alimentos ultraprocessados, ricos em açúcar, sal e gorduras ruins.' },
];

export const MOCK_CHILD_PROFILE = {
  id: DEFAULT_CHILD_ID,
  name: "Bernardo",
  dob: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0], // Approx 1 year old
  profilePictureUrl: "https://placehold.co/100x100.png"
};

// Function to calculate age in months (simplified)
export const calculateAgeInMonths = (dobString: string): number => {
  const dob = new Date(dobString);
  const today = new Date();
  let months = (today.getFullYear() - dob.getFullYear()) * 12;
  months -= dob.getMonth();
  months += today.getMonth();
  return months <= 0 ? 0 : months;
};

