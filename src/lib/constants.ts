
import type { Vaccine, Milestone, NutritionTip, ChildProfile, Appointment, MedicalRecordEntry } from './types';
import { CalendarDays, Syringe, Star, Apple, Stethoscope, User, ShieldCheck, Activity, Baby, Users, FileText } from 'lucide-react';

export const APP_NAME = "Anjo da Guarda";
export const DEFAULT_CHILD_ID = "defaultChild";

export const NAV_ITEMS = [
  { title: "Painel", href: "/dashboard", icon: Activity },
  { title: "Vacinas", href: "/vaccines", icon: Syringe },
  { title: "Marcos", href: "/milestones", icon: Star },
  { title: "Nutrição", href: "/nutrition", icon: Apple },
  { title: "Consultas", href: "/appointments", icon: Users },
  { title: "Prontuário", href: "/medical-record", icon: ShieldCheck },
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
];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'social_smile', name: 'Primeiro Sorriso Social', ageRange: '0-2 meses', description: 'Sorri espontaneamente em resposta a estímulos sociais.', achieved: false },
  { id: 'lift_head_briefly', name: 'Levanta a Cabeça Brevemente', ageRange: '0-2 meses', description: 'Quando deitado de bruços, levanta a cabeça por curtos períodos.', achieved: false },
  { id: 'head_control', name: 'Controle da Cabeça', ageRange: '2-4 meses', description: 'Sustenta a cabeça quando de bruços ou sentado com apoio.', achieved: false },
  { id: 'follow_objects', name: 'Segue Objetos com o Olhar', ageRange: '2-4 meses', description: 'Acompanha o movimento de objetos e rostos com os olhos.', achieved: false },
  { id: 'hands_together', name: 'Junta as Mãos', ageRange: '2-4 meses', description: 'Começa a levar as mãos à linha média do corpo e a juntá-las.', achieved: false },
  { id: 'roll_over', name: 'Rolar', ageRange: '4-6 meses', description: 'Consegue rolar da barriga para as costas e vice-versa.', achieved: false },
  { id: 'reach_objects', name: 'Alcança Objetos', ageRange: '4-6 meses', description: 'Estica os braços para pegar objetos de interesse.', achieved: false },
  { id: 'transfer_objects', name: 'Transfere Objetos', ageRange: '4-6 meses', description: 'Passa um objeto de uma mão para a outra.', achieved: false },
  { id: 'sit_unsupported', name: 'Sentar sem Apoio', ageRange: '6-8 meses', description: 'Senta-se por alguns momentos sem precisar de apoio.', achieved: false },
  { id: 'babbling', name: 'Balbuciar Sons', ageRange: '6-8 meses', description: 'Produz sons repetitivos como "mamama", "bababa", "dadada".', achieved: false },
  { id: 'crawl', name: 'Engatinhar', ageRange: '7-10 meses', description: 'Move-se engatinhando, rastejando ou de outra forma coordenada.', achieved: false },
  { id: 'pincer_grasp', name: 'Movimento de Pinça', ageRange: '7-10 meses', description: 'Pega pequenos objetos usando o polegar e o indicador.', achieved: false },
  { id: 'first_words', name: 'Primeiras Palavras com Significado', ageRange: '9-12 meses', description: 'Começa a dizer palavras simples como "mamã" ou "papá" com intenção.', achieved: false },
  { id: 'clap_wave', name: 'Bate Palmas e Acena', ageRange: '9-12 meses', description: 'Bate palmas quando estimulado e pode acenar "tchau".', achieved: false },
  { id: 'walk_unassisted', name: 'Andar Sozinho', ageRange: '12-15 meses', description: 'Dá os primeiros passos sem ajuda e gradualmente anda com mais firmeza.', achieved: false },
  { id: 'scribble', name: 'Rabiscar', ageRange: '12-15 meses', description: 'Faz rabiscos espontâneos com giz de cera ou lápis.', achieved: false },
  { id: 'stack_blocks_2', name: 'Empilha 2 Blocos', ageRange: '12-15 meses', description: 'Consegue empilhar dois blocos um sobre o outro.', achieved: false },
  { id: 'walk_well', name: 'Anda Bem Sozinho', ageRange: '15-18 meses', description: 'Caminha com segurança, raramente caindo.', achieved: false },
  { id: 'point_body_parts', name: 'Aponta Partes do Corpo', ageRange: '15-18 meses', description: 'Aponta para o nariz, olhos, boca quando solicitado.', achieved: false },
  { id: 'use_10_20_words', name: 'Usa 10-20 Palavras', ageRange: '15-18 meses', description: 'Possui um vocabulário de aproximadamente 10 a 20 palavras.', achieved: false },
  { id: 'kick_ball', name: 'Chuta uma Bola', ageRange: '18-24 meses', description: 'Consegue chutar uma bola para frente.', achieved: false },
  { id: 'remove_clothes', name: 'Tira Peças de Roupa', ageRange: '18-24 meses', description: 'Consegue tirar sapatos, meias ou outras peças simples de roupa.', achieved: false },
  { id: 'two_word_phrases', name: 'Frases de Duas Palavras', ageRange: '18-24 meses', description: 'Combina duas palavras para formar frases simples como "quer água", "mais bola".', achieved: false },
  { id: 'show_affection', name: 'Mostra Afeição', ageRange: '18-24 meses', description: 'Demonstra afeto por pessoas familiares com abraços e beijos.', achieved: false },
  { id: 'stairs_alternate_feet', name: 'Sobe/Desce Escadas Alternando Pés', ageRange: '24-36 meses', description: 'Consegue subir e descer escadas segurando no corrimão, alternando os pés.', achieved: false },
  { id: 'turn_pages_one_by_one', name: 'Vira Páginas de Livro (uma por vez)', ageRange: '24-36 meses', description: 'Consegue virar as páginas de um livro uma de cada vez.', achieved: false },
  { id: 'follow_2_3_step_instructions', name: 'Segue Instruções de 2-3 Etapas', ageRange: '24-36 meses', description: 'Compreende e segue instruções simples com duas ou três ações.', achieved: false },
  { id: 'pretend_play', name: 'Brincadeira Imaginativa (Faz de Conta)', ageRange: '24-36 meses', description: 'Participa de brincadeiras de faz de conta, como cuidar de uma boneca ou falar ao telefone de brinquedo.', achieved: false },
];

export const NUTRITION_TIPS: NutritionTip[] = [
  { id: 'tip1', ageGroup: '0-6 meses', title: 'Amamentação Exclusiva ou Fórmula', content: 'O leite materno é o alimento ideal. Na impossibilidade, fórmulas infantis adequadas são indicadas. Ofereça sob livre demanda ou conforme orientação pediátrica.' },
  { id: 'tip1b', ageGroup: '0-6 meses', title: 'Sinais de Fome e Saciedade', content: 'Aprenda a reconhecer os sinais de fome (procurar o peito, choramingar) e saciedade (soltar o peito, relaxar) do bebê.' },
  { id: 'tip2', ageGroup: '0-6 meses', title: 'Vitamina D', content: 'Converse com o pediatra sobre a suplementação de vitamina D, importante para bebês em amamentação exclusiva ou parcial.' },
  { id: 'tip3', ageGroup: '6-12 meses', title: 'Início da Introdução Alimentar', content: 'A partir dos 6 meses, sob orientação pediátrica, inicie a introdução de alimentos complementares de forma gradual, variada e respeitando os sinais de prontidão do bebê.' },
  { id: 'tip4', ageGroup: '6-12 meses', title: 'Texturas e Variedades', content: 'Ofereça frutas, legumes, verduras, cereais, tubérculos, carnes e leguminosas. Comece com texturas amassadas, evoluindo para pedaços pequenos e macios.' },
  { id: 'tip4b', ageGroup: '6-12 meses', title: 'Importância da Água', content: 'Ofereça água filtrada ou fervida nos intervalos das refeições a partir da introdução alimentar.' },
  { id: 'tip4c', ageGroup: '6-12 meses', title: 'Alimentos Ricos em Ferro', content: 'Inclua alimentos como carnes (boi, frango, peixe), leguminosas (feijão, lentilha) e vegetais verde-escuros para prevenir anemia.' },
  { id: 'tip5', ageGroup: '1-2 anos', title: 'Refeições em Família', content: 'Sempre que possível, inclua a criança nas refeições da família, oferecendo os mesmos alimentos (adaptados na textura e sem temperos fortes).' },
  { id: 'tip6', ageGroup: '1-2 anos', title: 'Evite Açúcar e Ultraprocessados', content: 'Limite ao máximo o consumo de alimentos com adição de açúcar, doces, refrigerantes, salgadinhos e outros ultraprocessados.' },
  { id: 'tip6b', ageGroup: '1-2 anos', title: 'Rotina Alimentar', content: 'Estabeleça horários regulares para as refeições e lanches, ajudando a criança a desenvolver hábitos alimentares saudáveis.' },
  { id: 'tip6c', ageGroup: '1-2 anos', title: 'Porções Adequadas', content: 'Ofereça porções pequenas e permita que a criança peça mais se ainda estiver com fome. Respeite a saciedade dela.' },
  { id: 'tip7', ageGroup: '2-3 anos', title: 'Incentive a Autonomia', content: 'Permita que a criança tente se alimentar sozinha, mesmo que faça sujeira. Isso desenvolve a coordenação e a independência.' },
  { id: 'tip8', ageGroup: '2-3 anos', title: 'Lanches Saudáveis', content: 'Entre as refeições principais, ofereça frutas, iogurte natural (sem açúcar), palitos de vegetais ou pequenos sanduíches integrais.' },
  { id: 'tip9', ageGroup: '2-3 anos', title: 'A Importância de Mastigar', content: 'Ofereça alimentos em texturas que incentivem a mastigação, importante para o desenvolvimento oral e digestão.' },
  { id: 'tip10', ageGroup: '2-3 anos', title: 'Lidando com Seletividade Alimentar', content: 'Continue oferecendo uma variedade de alimentos de forma paciente e sem pressão. Às vezes, são necessárias várias tentativas para aceitar um novo sabor.' },
];

export const MOCK_CHILD_PROFILE: ChildProfile = {
  id: DEFAULT_CHILD_ID,
  name: "Rafael Sabino Joviliano de Paula",
  dob: "2023-03-15", // YYYY-MM-DD
  profilePictureUrl: "https://placehold.co/100x100.png"
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);
const lastWeek = new Date(today);
lastWeek.setDate(today.getDate() - 7);
const twoMonthsAgo = new Date(today);
twoMonthsAgo.setMonth(today.getMonth() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(today.getDate() - 3);
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(today.getMonth() -1);


const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt1',
    childId: DEFAULT_CHILD_ID,
    professionalName: 'Dr. Ana Silva',
    specialty: 'Pediatra',
    appointmentDate: formatDate(tomorrow),
    appointmentTime: '10:00',
    status: 'scheduled',
    location: 'Clínica Infantil Bem-Estar, Sala 3',
    notes: 'Consulta de rotina dos 18 meses.'
  },
  {
    id: 'apt2',
    childId: DEFAULT_CHILD_ID,
    professionalName: 'Dra. Carla Mendes',
    specialty: 'Dentista Pediátrico',
    appointmentDate: formatDate(nextMonth),
    appointmentTime: '14:30',
    status: 'scheduled',
    location: 'Sorriso Feliz Odontopediatria',
    notes: 'Primeira consulta odontológica.'
  },
  {
    id: 'apt3',
    childId: DEFAULT_CHILD_ID,
    professionalName: 'Dr. João Santos',
    specialty: 'Oftalmologista',
    appointmentDate: formatDate(lastWeek),
    appointmentTime: '09:00',
    status: 'completed',
    location: 'Visão Kids Oftalmologia',
    notes: 'Teste da visão. Tudo normal.'
  },
  {
    id: 'apt4',
    childId: DEFAULT_CHILD_ID,
    professionalName: 'Dr. Pedro Lima',
    specialty: 'Fisioterapeuta',
    appointmentDate: formatDate(twoMonthsAgo),
    appointmentTime: '16:00',
    status: 'cancelled',
    location: 'Clínica Reabilitar',
    notes: 'Sessão cancelada devido a imprevisto.'
  },
];

export const INITIAL_MEDICAL_RECORD_ENTRIES: MedicalRecordEntry[] = [
  {
    id: 'mr1',
    childId: DEFAULT_CHILD_ID,
    entryType: 'Consulta',
    date: formatDate(lastWeek),
    time: '09:00',
    title: 'Consulta Oftalmológica',
    professionalOrLocation: 'Dr. João Santos - Visão Kids Oftalmologia',
    summary: 'Teste da visão realizado. Acuidade visual normal para a idade. Sem necessidade de correção no momento. Retorno em 1 ano.',
    attachments: [{ name: 'ExameVisual.pdf', url: '#' }]
  },
  {
    id: 'mr2',
    childId: DEFAULT_CHILD_ID,
    entryType: 'Emergência',
    date: formatDate(threeDaysAgo),
    time: '20:30',
    title: 'Febre Alta e Vômito',
    professionalOrLocation: 'PS Infantil Municipal',
    summary: 'Criança chegou com febre de 39.5°C e dois episódios de vômito. Diagnosticado com virose gastrointestinal. Medicado com antitérmico e orientações para hidratação oral. Observar sinais de desidratação.',
  },
  {
    id: 'mr3',
    childId: DEFAULT_CHILD_ID,
    entryType: 'Vacinação',
    date: formatDate(oneMonthAgo),
    title: 'Vacina Pentavalente - Reforço',
    professionalOrLocation: 'Posto de Saúde Central',
    summary: 'Administrada dose de reforço da vacina Pentavalente. Sem reações adversas imediatas.',
  },
   {
    id: 'mr4',
    childId: DEFAULT_CHILD_ID,
    entryType: 'Consulta',
    date: formatDate(twoMonthsAgo),
    time: '15:00',
    title: 'Consulta Pediátrica de Rotina',
    professionalOrLocation: 'Dra. Ana Silva - Clínica Infantil Bem-Estar',
    summary: 'Acompanhamento de desenvolvimento. Peso e altura adequados. Orientações sobre alimentação e sono. Próxima consulta em 3 meses.',
  },
];


// Function to calculate age in months (simplified)
export const calculateAgeInMonths = (dobString: string): number => {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;

  const today = new Date();
  let months = (today.getFullYear() - dob.getFullYear()) * 12;
  months -= dob.getMonth();
  months += today.getMonth();
  
  if (today.getDate() < dob.getDate()) {
    months--;
  }
  
  return months <= 0 ? 0 : months;
};

