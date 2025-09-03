
'use server';
/**
 * @fileOverview A symptom checker AI flow for pediatric assistance.
 *
 * This file defines a Genkit flow that takes a child's symptoms and age
 * as input and returns a preliminary triage assessment, including a suggestion,
 * severity level, and a recommendation on whether to see a doctor.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type {SymptomCheckerInput, SymptomCheckerResult} from '@/lib/types';

// Define the Zod schema for the flow's input
const SymptomCheckerInputSchema = z.object({
  symptoms: z.array(z.string()).describe('A list of symptoms reported by the user.'),
  ageInMonths: z.number().describe("The child's age in months."),
});

// Define the Zod schema for the flow's structured output
const SymptomCheckerOutputSchema = z.object({
  suggestion: z
    .string()
    .describe(
      'A concise, helpful suggestion in Portuguese for the parents based on the symptoms. This should be empathetic and clear.'
    ),
  severity: z
    .enum(['Baixa', 'Média', 'Alta', 'Crítica'])
    .describe(
      'An assessment of the severity of the symptoms. Use "Crítica" for emergencies like difficulty breathing.'
    ),
  shouldSeeDoctor: z
    .boolean()
    .describe(
      'A boolean flag indicating whether a doctor consultation is recommended.'
    ),
});

/**
 * An asynchronous function that invokes the symptom checker AI flow.
 * It serves as a server-side action that can be called from client components.
 *
 * @param {SymptomCheckerInput} input - The symptoms and age of the child.
 * @returns {Promise<SymptomCheckerResult>} The AI-generated triage assessment.
 */
export async function symptomCheckerFlow(
  input: SymptomCheckerInput
): Promise<SymptomCheckerResult> {
  // Execute the Genkit flow and return its output.
  // The schema validation for input and output is handled automatically.
  return await symptomCheckerAIFlow(input);
}

// Define the AI prompt using the structured schemas.
const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},

  // System prompt to set the persona and context for the AI
  system: `Você é um assistente de IA pediátrico chamado "Anjo da Guarda". Sua função é fornecer uma triagem inicial e sugestões para pais preocupados com base nos sintomas de seus filhos. Você deve ser tranquilizador, mas claro e direto. Baseie sua análise na idade da criança e nos sintomas fornecidos. Sempre enfatize que suas sugestões não substituem o diagnóstico de um profissional de saúde. Responda sempre em português do Brasil.`,

  // User prompt template using Handlebars syntax
  prompt: `
    Por favor, analise os seguintes sintomas para uma criança com {{ageInMonths}} meses de idade.

    Sintomas relatados:
    {{#each symptoms}}
    - {{this}}
    {{/each}}

    Com base nesses dados, forneça uma avaliação concisa.
    - Se os sintomas incluirem "dificuldade para respirar", "convulsão", ou "não reage", a severidade DEVE ser 'Crítica' e shouldSeeDoctor DEVE ser true.
    - Se houver febre alta (acima de 38.5°C) por mais de 2 dias, a severidade deve ser 'Alta'.
    - Febre moderada ou sintomas persistentes devem ter severidade 'Média'.
    - Sintomas de resfriado comum (tosse, coriza) sem febre devem ter severidade 'Baixa'.

    Gere a resposta no formato JSON especificado.
  `,
});

// Define the main Genkit flow.
const symptomCheckerAIFlow = ai.defineFlow(
  {
    name: 'symptomCheckerAIFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async (input: SymptomCheckerInput): Promise<SymptomCheckerResult> => {
    // Generate content using the defined prompt.
    const {output} = await symptomCheckerPrompt(input);

    // The output is already validated against the Zod schema.
    // The non-null assertion (!) is safe here because a valid output is expected.
    return output!;
  }
);
