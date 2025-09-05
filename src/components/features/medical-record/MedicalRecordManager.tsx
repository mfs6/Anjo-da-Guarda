
"use client";

import React, { useState, useEffect } from 'react';
import type { MedicalRecordEntry, ChildProfile, MedicalRecordEntryType } from "@/lib/types";
import { INITIAL_MEDICAL_RECORD_ENTRIES, MOCK_CHILD_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MedicalRecordEntryCard } from "./MedicalRecordEntryCard";
import { ShieldCheck, FileText, Info, PlusCircle, Filter } from "lucide-react";
import { parseISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NewMedicalRecordEntryForm } from './NewMedicalRecordEntryForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

type Persona = 'medico' | 'paciente';

const entryTypes: MedicalRecordEntryType[] = ['Consulta', 'Emergência', 'Exame', 'Vacinação', 'Observação'];


export function MedicalRecordManager() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [entries, setEntries] = useLocalStorage<MedicalRecordEntry[]>('userMedicalRecord', INITIAL_MEDICAL_RECORD_ENTRIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [filterType, setFilterType] = useState<MedicalRecordEntryType | 'all'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem('userPersona') as Persona;
      setPersona(storedPersona);
    }
  }, []);

  const handleExportPdf = () => {
    alert("Funcionalidade de exportar prontuário como PDF a ser implementada. Este PDF incluiria todas as entradas listadas, com detalhes sobre recomendações médicas e remédios a serem administrados, conforme registrado.");
  };

  const handleAddEntry = (newEntryData: Omit<MedicalRecordEntry, 'id' | 'childId'>) => {
    const newEntry: MedicalRecordEntry = {
      ...newEntryData,
      id: `mr_${Date.now()}`,
      childId: profile.id, // Assuming the doctor is adding to the current patient's profile
    };
    setEntries(prev => [newEntry, ...prev]);
    setIsModalOpen(false); // Close modal on successful submission
  };

  const sortedEntries = [...entries]
    .sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());
    
  const filteredAndSortedEntries = sortedEntries.filter(entry => 
    filterType === 'all' || entry.entryType === filterType
  );


  const renderPatientAlert = () => (
    <Alert className="bg-primary/10 border-primary/30">
      <ShieldCheck className="h-5 w-5 text-primary" />
      <AlertTitle className="font-headline text-primary">Seu Prontuário Médico</AlertTitle>
      <AlertDescription>
        Este é um registro de seus eventos médicos importantes. As entradas são adicionadas por profissionais de saúde.
      </AlertDescription>
    </Alert>
  );

  const renderDoctorAlert = () => (
     <Alert className="bg-primary/10 border-primary/30">
      <ShieldCheck className="h-5 w-5 text-primary" />
      <AlertTitle className="font-headline text-primary">Prontuário Médico de {profile.name}</AlertTitle>
      <AlertDescription>
        Visualize o histórico completo, filtre por tipo de entrada e adicione novos registros ao prontuário do paciente.
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-8">
      {persona === 'paciente' ? renderPatientAlert() : renderDoctorAlert()}

      <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
        {persona === 'medico' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
             <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Adicionar Entrada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nova Entrada no Prontuário</DialogTitle>
                </DialogHeader>
                <NewMedicalRecordEntryForm
                  onSubmit={handleAddEntry}
                  onCancel={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                 <Label htmlFor="filter-select" className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filtrar por</Label>
                 <Select
                   value={filterType}
                   onValueChange={(value) => setFilterType(value as MedicalRecordEntryType | 'all')}
                 >
                   <SelectTrigger id="filter-select" className="w-full sm:w-[180px]">
                     <SelectValue placeholder="Filtrar por tipo..." />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">Todos os Tipos</SelectItem>
                     {entryTypes.map(type => (
                       <SelectItem key={type} value={type}>{type}</SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
            </div>
          </div>
        )}
        <Button onClick={handleExportPdf} variant="outline" className="w-full sm:w-auto">
          <FileText className="mr-2 h-5 w-5" />
          Exportar (PDF)
        </Button>
      </div>

      {filteredAndSortedEntries.length > 0 ? (
        <div className="space-y-6">
          {filteredAndSortedEntries.map(entry => (
            <MedicalRecordEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Alert>
          <Info className="h-5 w-5" />
          <AlertTitle>Nenhuma Entrada Encontrada</AlertTitle>
          <AlertDescription>
            {filterType === 'all'
              ? 'Ainda não há entradas no prontuário médico.'
              : `Não foram encontradas entradas do tipo "${filterType}".`}
            {persona === 'medico' && ' Use o botão acima para adicionar uma nova entrada.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
