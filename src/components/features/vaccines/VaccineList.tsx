
"use client";

import React, { useState, useEffect } from 'react';
import type { Vaccine, ChildProfile } from "@/lib/types";
import { VaccineCard } from "./VaccineCard";
import { INITIAL_VACCINES, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Syringe, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMonths, format, differenceInCalendarDays, parseISO } from 'date-fns';
import Link from 'next/link';

// Enhanced logic to update vaccine status based on age and due dates
const getUpdatedVaccineStatus = (vaccine: Vaccine, childDob: string): Vaccine => {
  if (!childDob) {
    return { ...vaccine, recommendedDate: vaccine.recommendedDate || undefined, status: vaccine.status };
  }

  const ageInMonths = calculateAgeInMonths(childDob); 
  
  let dueAgeInMonths: number;
  if (vaccine.ageDue.toLowerCase() === 'ao nascer') {
    dueAgeInMonths = 0;
  } else {
    const match = vaccine.ageDue.match(/(\d+)\s*mes(es)?/);
    dueAgeInMonths = (match && match[1]) ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  let recommendedDateDt = new Date(childDob); 
  if (isFinite(dueAgeInMonths)) {
      recommendedDateDt = addMonths(new Date(childDob), dueAgeInMonths);
  }
  
  const today = new Date(); 
  today.setHours(0,0,0,0); 
  recommendedDateDt.setHours(0,0,0,0); 

  let currentStatus: Vaccine['status'] = vaccine.status;
  
  if (vaccine.status !== 'administered') {
    if (isFinite(dueAgeInMonths) && differenceInCalendarDays(today, recommendedDateDt) > 30 && ageInMonths > dueAgeInMonths) {
        currentStatus = 'missed';
    } else {
        currentStatus = 'pending';
    }
  }
  
  return {
    ...vaccine,
    status: currentStatus,
    recommendedDate: format(recommendedDateDt, 'yyyy-MM-dd')
  };
};


export function VaccineList() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [storedVaccines, setAndPersistVaccines] = useLocalStorage<Vaccine[]>('userVaccines', INITIAL_VACCINES);

  // Initialize with a basic version of INITIAL_VACCINES for SSR and initial client render
  const [renderableVaccines, setRenderableVaccines] = useState<Vaccine[]>(
    () => INITIAL_VACCINES.map(v => ({ ...v, status: v.status, recommendedDate: undefined }))
  );
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (isClientMounted) {
      const dobToUse = profile.dob; 
      
      const processed = storedVaccines.map(v => {
        // Find corresponding initial static data (like description, ageDue)
        const initialStaticData = INITIAL_VACCINES.find(iv => iv.id === v.id);
        // Merge stored data (user-set status, administeredDate) with static data,
        // then update dynamic fields (status based on age, recommendedDate).
        return getUpdatedVaccineStatus({ ...initialStaticData, ...v }, dobToUse);
      });
      setRenderableVaccines(processed);
    }
    // When not client mounted, renderableVaccines remains as initialized by useState.
    // This ensures server and client initial render are based on the same simple data structure.
  }, [isClientMounted, profile.dob, storedVaccines]);

  const handleUpdateVaccineStatus = (vaccineId: string, newStatus: Vaccine['status'], date?: string) => {
    setAndPersistVaccines(currentStoredVaccines =>
      currentStoredVaccines.map(v =>
        v.id === vaccineId 
        ? { ...v, status: newStatus, administeredDate: newStatus === 'administered' ? date : v.administeredDate } 
        : v
      )
    );
  };
  
  const pendingVaccines = renderableVaccines.filter(v => v.status === 'pending').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());
  const administeredVaccines = renderableVaccines.filter(v => v.status === 'administered').sort((a,b) => parseISO(b.administeredDate || '0000-01-01').getTime() - parseISO(a.administeredDate || '0000-01-01').getTime());
  const missedVaccines = renderableVaccines.filter(v => v.status === 'missed').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());


  const handleGenerateReport = () => {
    alert("Simulando geração de relatório PDF das vacinas. Esta funcionalidade será implementada futuramente com a listagem das vacinas administradas.");
  };

  return (
    <div className="space-y-8">
      <Alert className="bg-primary/10 border-primary/30">
        <Syringe className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Calendário de Vacinação de {profile.name}</AlertTitle>
        <AlertDescription>
          Acompanhe as vacinas importantes para a saúde do seu filho. Lembre-se de consultar o pediatra para o calendário exato.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row justify-end items-center gap-2 my-4">
        <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="https://typebot.co/gotinhabot" target="_blank">
                <Bot className="mr-2 h-5 w-5" />
                Tirar Dúvidas com IA
            </Link>
        </Button>
        <Button onClick={handleGenerateReport} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
          <FileText className="mr-2 h-5 w-5" />
          Gerar Relatório PDF
        </Button>
      </div>

      {missedVaccines.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-destructive mb-4">Vacinas Atrasadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missedVaccines.map(vaccine => (
              <VaccineCard key={vaccine.id} vaccine={vaccine} onUpdateStatus={handleUpdateVaccineStatus} />
            ))}
          </div>
        </div>
      )}

      {pendingVaccines.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">Vacinas Pendentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingVaccines.map(vaccine => (
              <VaccineCard key={vaccine.id} vaccine={vaccine} onUpdateStatus={handleUpdateVaccineStatus} />
            ))}
          </div>
        </div>
      )}
      
      {administeredVaccines.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-green-600 mb-4">Vacinas Administradas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {administeredVaccines.map(vaccine => (
              <VaccineCard key={vaccine.id} vaccine={vaccine} onUpdateStatus={handleUpdateVaccineStatus} />
            ))}
          </div>
        </div>
      )}

      {renderableVaccines.length === 0 && <p className="text-muted-foreground">Nenhuma vacina para exibir.</p>}
       {(missedVaccines.length === 0 && pendingVaccines.length === 0 && administeredVaccines.length === 0 && renderableVaccines.length > 0 && isClientMounted) && (
        <p className="text-muted-foreground text-center py-4">Todas as vacinas estão em dia ou foram administradas!</p>
      )}
       {/* Show a generic message or loading state if not client mounted and lists are empty, 
           as full processing hasn't happened yet. This prevents showing "All up to date" prematurely. */}
       {(missedVaccines.length === 0 && pendingVaccines.length === 0 && administeredVaccines.length === 0 && !isClientMounted) && (
        <p className="text-muted-foreground text-center py-4">Carregando informações das vacinas...</p>
      )}
    </div>
  );
}
