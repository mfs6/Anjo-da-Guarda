
"use client";

import React, { useState } from 'react';
import { useForm, SubmitHandler, useFormContext, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, AlertTriangle, CheckCircle, Info, Loader2, CalendarPlus, ArrowRight } from 'lucide-react';
import { symptomCheckerFlow } from '@/ai/flows/symptomCheckerFlow';
import type { SymptomCheckerResult, ChildProfile, Appointment } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { MOCK_CHILD_PROFILE, calculateAgeInMonths } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Step 1: Symptom Schema
const symptomSchema = z.object({
  symptomsDescription: z.string().min(10, { message: "Descreva os sintomas com pelo menos 10 caracteres." }).max(500, { message: "Limite de 500 caracteres excedido."}),
  additionalSymptoms: z.string().max(500, { message: "Limite de 500 caracteres para sintomas adicionais excedido."}).optional(),
});
type SymptomFormValues = z.infer<typeof symptomSchema>;

// Step 2: Appointment Details Schema
const appointmentDetailsSchema = z.object({
    professionalName: z.string().min(3, "Nome do profissional é obrigatório."),
    specialty: z.string().min(3, "Especialidade é obrigatória."),
    appointmentDate: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), { message: "Data inválida. Use o formato AAAA-MM-DD."}),
    appointmentTime: z.string().refine((time) => /^\d{2}:\d{2}$/.test(time), { message: "Horário inválido. Use o formato HH:MM."}),
    location: z.string().optional(),
    notes: z.string().optional(),
});
type AppointmentFormValues = z.infer<typeof appointmentDetailsSchema>;

const SymptomCheckerForm = ({ onSymptomsChecked }: { onSymptomsChecked: (result: SymptomCheckerResult, symptoms: string) => void }) => {
    const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SymptomFormValues>({
        resolver: zodResolver(symptomSchema),
        defaultValues: { symptomsDescription: "", additionalSymptoms: "" },
    });

    const onSubmit: SubmitHandler<SymptomFormValues> = async (data) => {
        setIsLoading(true);
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

            const allSymptoms = symptomsList.join(', ');
            onSymptomsChecked(aiResult, allSymptoms);
        } catch (e) {
            console.error("Symptom checker error:", e);
            setError("Ocorreu um erro ao processar sua solicitação. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="symptomsDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Principal dos Sintomas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Febre há 2 dias, tosse seca, moleza no corpo..." {...field} />
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
                  <FormLabel>Sintomas Adicionais (opcional, separados por vírgula)</FormLabel>
                  <FormControl>
                   <Input placeholder="Ex: Perda de apetite, dor de cabeça..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
                <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analisando...</> : <><Stethoscope className="mr-2 h-4 w-4" /> Verificar Sintomas</>}
            </Button>
          </form>
        </Form>
    );
};

const TriageResultDisplay = ({ result, onProceed }: { result: SymptomCheckerResult, onProceed: () => void }) => {
    const getResultAlertIcon = () => {
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
        <div className="space-y-4">
            <Alert className={getResultAlertBgClass()}>
                {getResultAlertIcon()}
                <AlertTitle className="font-headline">Resultado da Triagem (Severidade: {result.severity})</AlertTitle>
                <AlertDescription>
                    <p className="font-semibold">{result.suggestion}</p>
                    {result.shouldSeeDoctor && <p className="mt-2"><strong>Recomendação: Procure um médico.</strong></p>}
                    <p className="mt-3 text-xs italic">Lembre-se: esta é uma sugestão baseada em IA e não substitui o diagnóstico de um profissional de saúde.</p>
                </AlertDescription>
            </Alert>
            <Button onClick={onProceed} className="w-full">
                Prosseguir para Agendamento <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
    )
}

const AppointmentDetailsForm = ({ onSchedule, initialNotes }: { onSchedule: SubmitHandler<AppointmentFormValues>, initialNotes: string }) => {
    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentDetailsSchema),
        defaultValues: {
            professionalName: "",
            specialty: "",
            appointmentDate: "",
            appointmentTime: "",
            location: "",
            notes: initialNotes,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSchedule)} className="space-y-4">
                <FormField name="specialty" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Especialidade</FormLabel><FormControl><Input placeholder="Ex: Pediatra" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="professionalName" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Nome do Profissional</FormLabel><FormControl><Input placeholder="Ex: Dr. Ana Silva" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField name="appointmentDate" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Data da Consulta</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField name="appointmentTime" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Horário</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField name="location" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Local (Opcional)</FormLabel><FormControl><Input placeholder="Ex: Clínica Bem-Estar" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField name="notes" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Observações Iniciais</FormLabel><FormControl><Textarea placeholder="Sintomas relatados e outras notas." {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <CalendarPlus className="mr-2 h-4 w-4"/> Agendar Consulta
                </Button>
            </form>
        </Form>
    )
};


interface AppointmentSchedulerProps {
    children: React.ReactNode;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAppointmentScheduled: (data: AppointmentFormValues) => void;
}

export function AppointmentScheduler({ children, isOpen, onOpenChange, onAppointmentScheduled }: AppointmentSchedulerProps) {
    const [step, setStep] = useState<'symptoms' | 'result' | 'details'>('symptoms');
    const [triageResult, setTriageResult] = useState<SymptomCheckerResult | null>(null);
    const [symptomNotes, setSymptomNotes] = useState("");
    
    const handleSymptomsChecked = (result: SymptomCheckerResult, symptoms: string) => {
        setTriageResult(result);
        setSymptomNotes(`Sintomas relatados na triagem: ${symptoms}`);
        setStep('result');
    };
    
    const handleProceedToDetails = () => {
        setStep('details');
    }
    
    const handleSchedule: SubmitHandler<AppointmentFormValues> = (data) => {
        onAppointmentScheduled(data);
        // Reset state and close dialog
        handleClose();
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a short delay to allow dialog to close gracefully
        setTimeout(() => {
            setStep('symptoms');
            setTriageResult(null);
            setSymptomNotes("");
        }, 300);
    }
    
    const getTitle = () => {
        switch(step) {
            case 'symptoms': return 'Passo 1: Triagem de Sintomas';
            case 'result': return 'Passo 2: Resultado da Triagem';
            case 'details': return 'Passo 3: Agendar Consulta';
            default: return 'Agendar Nova Consulta';
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{getTitle()}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    {step === 'symptoms' && <SymptomCheckerForm onSymptomsChecked={handleSymptomsChecked} />}
                    {step === 'result' && triageResult && <TriageResultDisplay result={triageResult} onProceed={handleProceedToDetails} />}
                    {step === 'details' && <AppointmentDetailsForm onSchedule={handleSchedule} initialNotes={symptomNotes} />}
                </div>
            </DialogContent>
        </Dialog>
    );
}

