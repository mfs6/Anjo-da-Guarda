
"use client";

import React, { useState, useEffect } from 'react';
import type { Vaccine, ChildProfile } from "@/lib/types";
import { VaccineCard } from "./VaccineCard";
import { INITIAL_VACCINES, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Syringe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addMonths, format, differenceInCalendarDays, parseISO } from 'date-fns';

// Enhanced logic to update vaccine status based on age and due dates
const getUpdatedVaccineStatus = (vaccine: Vaccine, childDob: string): Vaccine => {
  // If childDob is not available (e.g., profile not loaded yet), return vaccine with its current status
  // or default recommendedDate to undefined if not already set.
  if (!childDob) {
    return { ...vaccine, recommendedDate: vaccine.recommendedDate || undefined };
  }

  const ageInMonths = calculateAgeInMonths(childDob); // Uses client's new Date()
  
  let dueAgeInMonths: number;
  if (vaccine.ageDue.toLowerCase() === 'ao nascer') {
    dueAgeInMonths = 0;
  } else {
    const match = vaccine.ageDue.match(/(\d+)\s*mes(es)?/);
    // Ensure match and match[1] are valid before parsing, default to a very large number if not parseable
    dueAgeInMonths = (match && match[1]) ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
  }

  let recommendedDateDt = new Date(childDob); // Default to DOB if dueAgeInMonths is not finite
  if (isFinite(dueAgeInMonths)) {
      recommendedDateDt = addMonths(new Date(childDob), dueAgeInMonths);
  }
  
  const today = new Date(); // Uses client's new Date()
  today.setHours(0,0,0,0); // Normalize today to start of day
  recommendedDateDt.setHours(0,0,0,0); // Normalize recommendedDate to start of day

  let currentStatus: Vaccine['status'] = vaccine.status;
  
  // Only update status from 'pending' to 'missed' or keep as 'pending'.
  // 'administered' status is set by user action and should persist.
  if (vaccine.status !== 'administered') {
    if (isFinite(dueAgeInMonths) && differenceInCalendarDays(today, recommendedDateDt) > 30 && ageInMonths > dueAgeInMonths) {
        currentStatus = 'missed';
    } else {
        // If not missed, and not administered, it's pending.
        // This also handles cases where dueAgeInMonths might be MAX_SAFE_INTEGER (effectively always pending until administered)
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
  // storedVaccines holds data from localStorage or INITIAL_VACCINES. This is the source of truth for persistence.
  const [storedVaccines, setAndPersistVaccines] = useLocalStorage<Vaccine[]>('userVaccines', INITIAL_VACCINES);

  // renderableVaccines is what's actually displayed. Initialized with static data for SSR and first client paint.
  const [renderableVaccines, setRenderableVaccines] = useState<Vaccine[]>(INITIAL_VACCINES.map(v => ({...v, recommendedDate: undefined})));
  const [isClientMounted, setIsClientMounted] = useState(false);

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    // This effect runs when the component has mounted on the client and when relevant data changes.
    if (isClientMounted) {
      const dobToUse = profile.dob; // Use the current profile's DOB (from localStorage or MOCK)
      
      // Process the vaccines based on data from localStorage (storedVaccines).
      // This uses getUpdatedVaccineStatus which relies on the client's current date.
      const processed = storedVaccines.map(v => {
        const initialStaticData = INITIAL_VACCINES.find(iv => iv.id === v.id) || {};
        // Merge with stored data (respecting user-set statuses like 'administered')
        // and then update dynamic fields like status (pending/missed) and recommendedDate.
        return getUpdatedVaccineStatus({ ...initialStaticData, ...v }, dobToUse);
      });
      setRenderableVaccines(processed);
    } else {
      // For server-side rendering or before client mount, prepare renderableVaccines
      // with deterministic recommendedDate calculation if possible, but static status.
      const dobToUseForSSR = profile.dob || MOCK_CHILD_PROFILE.dob;
      const ssrProcessedVaccines = INITIAL_VACCINES.map(v => {
        let recDate: string | undefined = undefined;
        if (dobToUseForSSR) {
            let dueMonths = 0;
            if (v.ageDue.toLowerCase() === 'ao nascer') {
                dueMonths = 0;
            } else {
                const match = v.ageDue.match(/(\d+)\s*mes(es)?/);
                dueMonths = (match && match[1]) ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
            }
            if(isFinite(dueMonths)) {
                const rDate = addMonths(new Date(dobToUseForSSR), dueMonths);
                recDate = format(rDate, 'yyyy-MM-dd');
            }
        }
        return { ...v, status: v.status, recommendedDate: recDate }; // Use status from INITIAL_VACCINES
      });
      setRenderableVaccines(ssrProcessedVaccines);
    }
  // profile.dob and storedVaccines are dependencies to re-run processing if they change on the client.
  }, [isClientMounted, profile.dob, storedVaccines]);

  const handleUpdateVaccineStatus = (vaccineId: string, newStatus: Vaccine['status'], date?: string) => {
    setAndPersistVaccines(currentStoredVaccines =>
      currentStoredVaccines.map(v =>
        v.id === vaccineId 
        ? { ...v, status: newStatus, administeredDate: newStatus === 'administered' ? date : v.administeredDate } 
        : v
      )
    );
    // The useEffect listening to storedVaccines will trigger a re-processing and update renderableVaccines.
  };
  
  const pendingVaccines = renderableVaccines.filter(v => v.status === 'pending').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());
  const administeredVaccines = renderableVaccines.filter(v => v.status === 'administered').sort((a,b) => parseISO(b.administeredDate || '0000-01-01').getTime() - parseISO(a.administeredDate || '0000-01-01').getTime());
  const missedVaccines = renderableVaccines.filter(v => v.status === 'missed').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());

  if (!isClientMounted && renderableVaccines.every(v => v.recommendedDate === undefined)) {
    // Optional: Show a loading state or basic version while client is mounting and processing
    // This helps if recommendedDate calculation for SSR is too complex or profile.dob isn't ready for SSR logic
    // For this fix, we primarily rely on INITIAL_VACCINES structure for the very first paint.
  }

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

      <div className="flex justify-end my-4">
        <Button onClick={handleGenerateReport} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
       {(missedVaccines.length === 0 && pendingVaccines.length === 0 && administeredVaccines.length === 0 && renderableVaccines.length > 0) && (
        <p className="text-muted-foreground text-center py-4">Todas as vacinas estão em dia ou foram administradas!</p>
      )}
    </div>
  );
}

    