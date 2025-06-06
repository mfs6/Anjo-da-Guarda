"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { symptomCheckerFlow } from '@/ai/flows/symptomCheckerFlow'; 
import type { SymptomCheckerResult, ChildProfile } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_CHILD_PROFILE, calculateAgeInMonths } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';


const symptomSchema = z.object({
  symptomsDescription: z.string().min(10, { message: "Descreva os sintomas com pelo menos 10 caracteres." }).max(500, { message: "Limite de 500 caracteres excedido."}),
  additionalSymptoms: z.string().max(500, { message: "Limite de 500 caracteres para sintomas adicionais excedido."}).optional(),
});

type SymptomFormValues = z.infer<typeof symptomSchema>;

export function SymptomChecker() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      symptomsDescription: "",
      additionalSymptoms: "",
    },
  });

  const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const childAgeInMonths = calculateAgeInMonths(profile.dob);
      const symptomsList = [data.symptomsDescription];
      if (data.additionalSymptoms && data.additionalSymptoms.trim() !== "") {
        symptomsList.push(...data.additionalSymptoms.split(',').map(s => s.trim()).filter(s => s !== ""));
      }

      const aiResult = await symptomCheckerFlow({
        symptoms: symptomsList,
        ageInMonths: childAgeInMonths,
      });
      setResult(aiResult);
    } catch (e) {
      console.error("Symptom checker error:", e);
      setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getResultAlertIcon = () => {
    if (!result) return <Info className="h-4 w-4" />;
    switch (result.severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive-foreground" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />; 
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

   const getResultAlertTitleClass = () => {
    if (!result) return "";
    switch (result.severity) {
      case 'critical':
      case 'high':
        return "text-destructive-foreground";
      case 'medium':
        return "text-yellow-800 dark:text-yellow-200";
      case 'low':
        return "text-green-800 dark:text-green-200";
      default:
        return "";
    }
  };

  const getResultAlertBgClass = () => {
    if (!result) return "bg-blue-500/10 border-blue-500/30";
    switch (result.severity) {
      case 'critical':
      case 'high':
        return "bg-destructive border-destructive/50 text-destructive-foreground";
      case 'medium':
        return "bg-yellow-500/10 border-yellow-500/30";
      case 'low':
        return "bg-green-500/10 border-green-500/30";
      default:
        return "bg-blue-500/10 border-blue-500/30";
    }
  };


  return (
    <div className="space-y-6">
      <Alert className="bg-primary/10 border-primary/30">
        <Stethoscope className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Triagem de Sintomas para {profile.name}</AlertTitle>
        <AlertDescription>
          Descreva os sintomas da criança para receber uma orientação. <strong>Este recurso não substitui uma consulta médica.</strong> Em caso de emergência, procure um médico imediatamente.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Relatar Sintomas</CardTitle>
          <CardDescription>Forneça o máximo de detalhes possível.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="symptomsDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="symptomsDescription">Descrição Principal dos Sintomas</FormLabel>
                    <FormControl>
                      <Textarea
                        id="symptomsDescription"
                        placeholder="Ex: Febre há 2 dias, tosse seca, moleza no corpo..."
                        rows={4}
                        {...field}
                        className="focus:ring-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="additionalSymptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="additionalSymptoms">Sintomas Adicionais (opcional, separados por vírgula)</FormLabel>
                    <FormControl>
                       <Input
                        id="additionalSymptoms"
                        placeholder="Ex: Perda de apetite, dor de cabeça, irritabilidade"
                        {...field}
                        className="focus:ring-accent"
                      />
                    </FormControl>
                    <FormDescription>Liste outros sintomas que a criança possa estar apresentando.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Verificar Sintomas
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
         <Alert className={getResultAlertBgClass()}>
         {getResultAlertIcon()}
         <AlertTitle className={`${getResultAlertTitleClass()} font-headline`}>
           Resultado da Triagem (Severidade: {result.severity})
         </AlertTitle>
         <AlertDescription className={result.severity === 'critical' || result.severity === 'high' ? 'text-destructive-foreground' : ''}>
           <p className="font-semibold">{result.suggestion}</p>
           {result.shouldSeeDoctor && (
             <p className="mt-2"><strong>Recomendação: Procure um médico.</strong></p>
           )}
            <p className="mt-3 text-xs italic">Lembre-se: esta é uma sugestão baseada em IA e não substitui o diagnóstico de um profissional de saúde.</p>
         </AlertDescription>
       </Alert>
      )}
    </div>
  );
}
