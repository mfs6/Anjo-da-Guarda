// IMPORTANT: This is a placeholder/mock as per instructions.
// The actual AI flow is assumed to be pre-existing and should not be modified here.
// This file ensures the application can import `symptomCheckerFlow` without breaking.

import type { SymptomCheckerInput, SymptomCheckerResult } from '@/lib/types';

/**
 * Mock Symptom Checker Flow.
 * In a real scenario, this would call the Genkit AI flow.
 */
export async function symptomCheckerFlow(input: SymptomCheckerInput): Promise<SymptomCheckerResult> {
  console.log("Mock symptomCheckerFlow called with input:", input);

  // Simulate some delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  let suggestion = "Com base nos sintomas e idade, parece ser uma condição leve.";
  let severity: SymptomCheckerResult['severity'] = 'low';
  let shouldSeeDoctor = false;

  if (input.symptoms.some(s => s.toLowerCase().includes("febre alta"))) {
    suggestion = "Febre alta pode indicar uma infecção. Recomenda-se monitorar e, se persistir ou piorar, consultar um médico.";
    severity = 'medium';
    shouldSeeDoctor = true;
  } else if (input.symptoms.some(s => s.toLowerCase().includes("dificuldade para respirar"))) {
    suggestion = "Dificuldade para respirar é um sintoma preocupante. Procure atendimento médico imediatamente.";
    severity = 'critical';
    shouldSeeDoctor = true;
  } else if (input.symptoms.some(s => s.toLowerCase().includes("tosse")) && input.symptoms.some(s => s.toLowerCase().includes("coriza"))) {
    suggestion = "Pode ser um resfriado comum. Mantenha a criança hidratada e observe os sintomas.";
    severity = 'low';
    shouldSeeDoctor = false;
  } else if (input.symptoms.length === 0 || (input.symptoms.length === 1 && input.symptoms[0].trim() === "")) {
    suggestion = "Por favor, descreva os sintomas da criança para uma avaliação.";
    severity = 'low';
    shouldSeeDoctor = false;
  }


  return {
    suggestion,
    severity,
    shouldSeeDoctor,
  };
}
