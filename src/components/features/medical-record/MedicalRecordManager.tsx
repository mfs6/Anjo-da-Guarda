
"use client";

import React from 'react';
import type { MedicalRecordEntry, ChildProfile } from "@/lib/types";
import { INITIAL_MEDICAL_RECORD_ENTRIES, MOCK_CHILD_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MedicalRecordEntryCard } from "./MedicalRecordEntryCard";
import { ShieldCheck, PlusCircle, FileText, Info } from "lucide-react";
import { parseISO } from 'date-fns';

export function MedicalRecordManager() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [entries, setEntries] = useLocalStorage<MedicalRecordEntry[]>('userMedicalRecord', INITIAL_MEDICAL_RECORD_ENTRIES);

  const handleAddEntry = () => {
    alert("Funcionalidade de adicionar nova entrada ao prontuário a ser implementada.");
  };

  const handleExportPdf = () => {
    alert("Funcionalidade de exportar prontuário como PDF a ser implementada. Este PDF incluiria todas as entradas listadas.");
  };

  const sortedEntries = [...entries].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime());

  return (
    <div className="space-y-8">
      <Alert className="bg-primary/10 border-primary/30">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Prontuário Médico de {profile.name}</AlertTitle>
        <AlertDescription>
          Este é um registro de eventos médicos importantes. Lembre-se que o acesso a este prontuário por profissionais de saúde deve ser feito com sua permissão.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button onClick={handleAddEntry} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
          <PlusCircle className="mr-2 h-5 w-5" />
          Adicionar Nova Entrada
        </Button>
        <Button onClick={handleExportPdf} variant="outline" className="w-full sm:w-auto">
          <FileText className="mr-2 h-5 w-5" />
          Exportar Prontuário (PDF)
        </Button>
      </div>

      {sortedEntries.length > 0 ? (
        <div className="space-y-6">
          {sortedEntries.map(entry => (
            <MedicalRecordEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <Alert>
          <Info className="h-5 w-5" />
          <AlertTitle>Nenhuma Entrada no Prontuário</AlertTitle>
          <AlertDescription>
            Ainda não há entradas no prontuário médico. Use o botão "Adicionar Nova Entrada" para começar.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
