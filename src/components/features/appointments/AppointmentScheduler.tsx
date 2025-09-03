
"use client";

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CalendarPlus } from 'lucide-react';
import type { Appointment, SymptomCheckerResult } from '@/lib/types';
import { TriageResultAlert } from './TriageResultAlert';

type AppointmentFormValues = Omit<Appointment, 'id' | 'childId' | 'status'>;

const appointmentSchema = z.object({
  professionalName: z.string().min(3, { message: 'Nome do profissional é obrigatório.' }),
  specialty: z.string().min(3, { message: 'Especialidade é obrigatória.' }),
  appointmentDate: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), { message: 'Data inválida. Use o formato AAAA-MM-DD.' }),
  appointmentTime: z.string().refine((time) => /^\d{2}:\d{2}$/.test(time), { message: 'Horário inválido. Use o formato HH:MM.' }),
  location: z.string().optional(),
  notes: z.string().optional(),
});

interface AppointmentSchedulerProps {
  onAppointmentScheduled: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  triageResult: SymptomCheckerResult | null;
}

export function AppointmentScheduler({
  onAppointmentScheduled,
  onCancel,
  triageResult,
}: AppointmentSchedulerProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      professionalName: '',
      specialty: '',
      appointmentDate: '',
      appointmentTime: '',
      location: '',
      notes: triageResult?.suggestion || '',
    },
  });
  
  useEffect(() => {
    // If triageResult changes, update the notes field.
    // This handles the case where the component is already mounted when the result arrives.
    if(triageResult?.suggestion) {
        form.setValue('notes', `Triagem: ${triageResult.suggestion}`);
    }
  }, [triageResult, form]);


  const onSubmit: SubmitHandler<AppointmentFormValues> = (data) => {
    onAppointmentScheduled(data);
    form.reset();
  };

  return (
        <div>
        {triageResult && (
            <div className="mb-4">
                <TriageResultAlert result={triageResult} isSchedulingView={true}/>
            </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pediatra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Profissional</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dr. Ana Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Consulta</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Clínica Bem-Estar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o motivo da consulta aqui..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
                 <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Agendar Consulta
              </Button>
            </div>
          </form>
        </Form>
        </div>
  );
}
