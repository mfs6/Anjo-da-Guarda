
"use client";

import React from 'react';
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
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import type { Appointment } from '@/lib/types';

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
}

export function AppointmentScheduler({
  onAppointmentScheduled,
  onCancel,
}: AppointmentSchedulerProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      professionalName: '',
      specialty: '',
      appointmentDate: '',
      appointmentTime: '',
      location: '',
      notes: '',
    },
  });

  const onSubmit: SubmitHandler<AppointmentFormValues> = (data) => {
    onAppointmentScheduled(data);
    form.reset();
  };

  return (
        <div>
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
                    <FormLabel>Horário (24h)</FormLabel>
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
                    <Textarea placeholder="Adicione notas ou o motivo da consulta aqui..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between pt-4">
                 <Button type="button" variant="outline" onClick={onCancel}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                 </Button>
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
