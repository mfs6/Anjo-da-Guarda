
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  const [entryToEdit, setEntryToEdit] = useState<MedicalRecordEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem('userPersona') as Persona;
      setPersona(storedPersona);
    }
  }, []);

  const handleExportPdf = () => {
    alert("Funcionalidade de exportar prontuário como PDF a ser implementada. Este PDF incluiria todas as entradas listadas, com detalhes sobre recomendações médicas e remédios a serem administrados, conforme registrado.");
  };

  const handleOpenEditModal = (entry: MedicalRecordEntry) => {
    setEntryToEdit(entry);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEntryToEdit(null);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEntryToEdit(null);
  }

  const handleDelete = () => {
    if (entryToDelete) {
        setEntries(prev => prev.filter(entry => entry.id !== entryToDelete));
        setEntryToDelete(null);
    }
  }


  const handleFormSubmit = (formData: Omit<MedicalRecordEntry, 'id' | 'childId'>) => {
    if (entryToEdit) { // Editing existing entry
      const updatedEntry: MedicalRecordEntry = {
        ...formData,
        id: entryToEdit.id,
        childId: profile.id,
      };
      setEntries(prev => prev.map(entry => entry.id === entryToEdit.id ? updatedEntry : entry));
    } else { // Adding new entry
      const newEntry: MedicalRecordEntry = {
        ...formData,
        id: `mr_${Date.now()}`,
        childId: profile.id,
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    handleCloseModal();
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

       <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); else setIsModalOpen(true); }}>
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
              {persona === 'medico' && (
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Button onClick={handleOpenAddModal} className="w-auto">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Adicionar Entrada
                    </Button>
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
               <Button onClick={handleExportPdf} variant="outline" className="w-full sm:w-auto ml-auto">
                <FileText className="mr-2 h-5 w-5" />
                Exportar (PDF)
              </Button>
          </div>
        </div>
        
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{entryToEdit ? 'Editar Entrada no Prontuário' : 'Nova Entrada no Prontuário'}</DialogTitle>
          </DialogHeader>
          <NewMedicalRecordEntryForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            existingEntry={entryToEdit}
          />
        </DialogContent>
      </Dialog>
      

      {filteredAndSortedEntries.length > 0 ? (
        <div className="space-y-6">
          {filteredAndSortedEntries.map(entry => (
            <MedicalRecordEntryCard 
              key={entry.id} 
              entry={entry} 
              onEdit={handleOpenEditModal}
              onDelete={() => setEntryToDelete(entry.id)}
              persona={persona}
              />
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

      <AlertDialog open={!!entryToDelete} onOpenChange={() => setEntryToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a entrada do prontuário.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
