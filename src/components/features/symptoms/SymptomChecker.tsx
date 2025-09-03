
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, AlertTriangle, CheckCircle, Info, Loader2, HeartPulse } from 'lucide-react';
import { symptomCheckerFlow } from '@/ai/flows/symptomCheckerFlow';
import type { SymptomCheckerResult, ChildProfile } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_CHILD_PROFILE, calculateAgeInMonths } from '@/lib/constants';
import { Label } from '@/components/ui/label';

const schema = z.object({
  symptomsDescription: z.string().min(10, { message: "Por favor, descreva os sintomas com mais detalhes (mínimo 10 caracteres)." }),
  additionalSymptoms: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SymptomCheckerProps {
  onCheckComplete?: (result: SymptomCheckerResult) => void;
  isModalVersion?: boolean;
}

export function SymptomChecker({ onCheckComplete, isModalVersion = false }: SymptomCheckerProps) {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomCheckerResult | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const childAgeInMonths = calculateAgeInMonths(profile.dob);
      const symptomsList = [data.symptomsDescription];
      if (data.additionalSymptoms && data.additionalSymptoms.trim() !== '') {
        symptomsList.push(...data.additionalSymptoms.split(',').map(s => s.trim()).filter(Boolean));
      }

      const aiResult = await symptomCheckerFlow({
        symptoms: symptomsList,
        ageInMonths: childAgeInMonths,
      });

      setResult(aiResult);
      if (onCheckComplete) {
        onCheckComplete(aiResult);
      }
    } catch (e) {
      console.error("Symptom checker error:", e);
      setError("Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.");
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

  const MainContent = () => (
    <>
      <Card className="shadow-none border-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 !p-0">
            <div>
              <Label htmlFor="symptomsDescription" className="font-semibold">Descrição Principal dos Sintomas</Label>
              <Textarea
                id="symptomsDescription"
                placeholder="Ex: Febre há 2 dias, tosse seca, moleza no corpo..."
                {...register("symptomsDescription")}
                className={`mt-1 ${errors.symptomsDescription ? 'border-destructive' : ''}`}
              />
              {errors.symptomsDescription && <p className="text-sm text-destructive mt-1">{errors.symptomsDescription.message}</p>}
            </div>
            <div>
              <Label htmlFor="additionalSymptoms" className="font-semibold">Sintomas Adicionais (opcional, separados por vírgula)</Label>
              <Input
                id="additionalSymptoms"
                placeholder="Ex: Perda de apetite, dor de cabeça..."
                {...register("additionalSymptoms")}
                className="mt-1"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch space-y-4 !p-0 pt-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : "Verificar Sintomas"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && !onCheckComplete && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Resultado da Triagem</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={getResultAlertBgClass()}>
              {getResultAlertIcon()}
              <AlertTitle className="font-headline">Sugestão (Severidade: {result.severity})</AlertTitle>
              <AlertDescription>
                <p className="font-semibold">{result.suggestion}</p>
                {result.shouldSeeDoctor && <p className="mt-2"><strong>Recomendação: Procure um médico.</strong></p>}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </>
  );

  if (isModalVersion) {
    return <MainContent />;
  }

  return (
    <div className="space-y-8">
        <Alert className="bg-primary/10 border-primary/30">
            <HeartPulse className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Triagem de Sintomas com IA</AlertTitle>
            <AlertDescription>
              Descreva os sintomas de {profile.name} para receber uma sugestão inicial gerada por IA.
              <strong>Lembre-se: este recurso não substitui uma consulta médica.</strong>
            </AlertDescription>
        </Alert>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope/> Relatar Sintomas</CardTitle>
                <CardDescription>
                    Quanto mais detalhes você fornecer, mais precisa será a sugestão da IA.
                    Idade atual: {calculateAgeInMonths(profile.dob)} meses.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <MainContent />
            </CardContent>
        </Card>
    </div>
  );
}
