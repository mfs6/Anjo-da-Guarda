
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Ban } from 'lucide-react';
import type { MedicalRecordEntry, MedicalRecordEntryType } from '@/lib/types';

type MedicalRecordFormValues = Omit<MedicalRecordEntry, 'id' | 'childId'>;

const entryTypes: MedicalRecordEntryType[] = ['Consulta', 'Emergência', 'Exame', 'Vacinação', 'Observação'];

const medicalRecordSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  entryType: z.enum(entryTypes, { required_error: 'O tipo de entrada é obrigatório.' }),
  date: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), { message: 'Data inválida.' }),
  time: z.string().regex(/^\d{2}:\d{2}$/, { message: 'Horário inválido. Use o formato HH:MM.' }),
  professionalOrLocation: z.string().min(1, { message: 'O profissional ou local é obrigatório.' }),
  summary: z.string().optional(),
  attachments: z.any().optional(), // Simplificado por enquanto
});

interface NewMedicalRecordEntryFormProps {
  onSubmit: (data: MedicalRecordFormValues) => void;
  onCancel: () => void;
}

export function NewMedicalRecordEntryForm({
  onSubmit,
  onCancel,
}: NewMedicalRecordEntryFormProps) {
  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      title: '',
      entryType: 'Consulta',
      date: new Date().toISOString().split('T')[0], // Default to today
      time: '',
      professionalOrLocation: '',
      summary: '',
    },
  });

  const handleSubmit: SubmitHandler<MedicalRecordFormValues> = (data) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="entryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Entrada</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entryTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Consulta de Rotina" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

         <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
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
          name="professionalOrLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissional ou Local</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Dr. Ana Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumo / Detalhes (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva os detalhes da consulta, diagnóstico, tratamento, etc." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <Ban className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Salvar Entrada
          </Button>
        </div>
      </form>
    </Form>
  );
}
