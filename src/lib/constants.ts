
import type { Vaccine, Milestone, NutritionTip, ChildProfile } from './types';
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
  name: "Luís Marinho",
  dob: "2023-03-15", // Static DOB for consistency
  profilePictureUrl: "https://placehold.co/100x100.png"
};

// Function to calculate age in months (simplified)
export const calculateAgeInMonths = (dobString: string): number => {
  if (!dobString) return 0; // Handle cases where dobString might be undefined or empty
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0; // Handle invalid date strings

  const today = new Date();
  let months = (today.getFullYear() - dob.getFullYear()) * 12;
  months -= dob.getMonth();
  months += today.getMonth();
  
  // Adjust if the current day of the month is before the DOB day of the month
  // This handles cases where the month difference is calculated but the full month hasn't passed yet.
  // For example, DOB is 2023-03-15, today is 2024-03-10. This is 11 full months, not 12.
  if (today.getDate() < dob.getDate()) {
    months--;
  }
  
  return months <= 0 ? 0 : months;
};

