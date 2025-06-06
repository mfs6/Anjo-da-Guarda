"use client";

import React from 'react';
import type { Vaccine, ChildProfile } from "@/lib/types";
import { VaccineCard } from "./VaccineCard";
import { INITIAL_VACCINES, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Syringe } from "lucide-react";
import { addMonths, format, differenceInCalendarDays, parseISO } from 'date-fns';

// Enhanced logic to update vaccine status based on age and due dates
const getUpdatedVaccineStatus = (vaccine: Vaccine, childDob: string): Vaccine => {
  if (!childDob) return vaccine; // if no DOB, return as is

  const ageInMonths = calculateAgeInMonths(childDob);
  
  let dueAgeInMonths: number;
  if (vaccine.ageDue.toLowerCase() === 'ao nascer') {
    dueAgeInMonths = 0;
  } else {
    const match = vaccine.ageDue.match(/(\d+)\s*mes(es)?/);
    dueAgeInMonths = match ? parseInt(match[1], 10) : Infinity;
  }

  const recommendedDate = addMonths(new Date(childDob), dueAgeInMonths);
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize today to start of day
  recommendedDate.setHours(0,0,0,0); // Normalize recommendedDate to start of day


  let currentStatus: Vaccine['status'] = vaccine.status;
  
  if (vaccine.status !== 'administered') {
    if (differenceInCalendarDays(today, recommendedDate) > 30 && ageInMonths > dueAgeInMonths) {
        currentStatus = 'missed';
    } else {
        currentStatus = 'pending';
    }
  }
  
  return {
    ...vaccine,
    status: currentStatus,
    recommendedDate: format(recommendedDate, 'yyyy-MM-dd')
  };
};


export function VaccineList() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  // Initialize vaccines with status calculation
  const [vaccines, setVaccines] = useLocalStorage<Vaccine[]>('userVaccines', () => 
    INITIAL_VACCINES.map(v => getUpdatedVaccineStatus(v, profile.dob || MOCK_CHILD_PROFILE.dob))
  );

  React.useEffect(() => {
    if (profile.dob) {
      // Re-evaluate all vaccine statuses when DOB changes or component mounts with a DOB
      setVaccines(prevVaccines => prevVaccines.map(v => getUpdatedVaccineStatus(v, profile.dob)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.dob]); // Only re-run if DOB changes

  const handleUpdateVaccineStatus = (vaccineId: string, status: Vaccine['status'], date?: string) => {
    setVaccines(prevVaccines =>
      prevVaccines.map(v =>
        v.id === vaccineId ? { ...v, status, administeredDate: status === 'administered' ? date : v.administeredDate } : v // Keep administeredDate if not changing to administered
      ).map(v => getUpdatedVaccineStatus(v, profile.dob)) // Re-evaluate status for all after an update
    );
  };
  
  const pendingVaccines = vaccines.filter(v => v.status === 'pending').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());
  const administeredVaccines = vaccines.filter(v => v.status === 'administered').sort((a,b) => parseISO(b.administeredDate || '0000-01-01').getTime() - parseISO(a.administeredDate || '0000-01-01').getTime());
  const missedVaccines = vaccines.filter(v => v.status === 'missed').sort((a,b) => parseISO(a.recommendedDate || '9999-12-31').getTime() - parseISO(b.recommendedDate || '9999-12-31').getTime());


  return (
    <div className="space-y-8">
      <Alert className="bg-primary/10 border-primary/30">
        <Syringe className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Calendário de Vacinação de {profile.name}</AlertTitle>
        <AlertDescription>
          Acompanhe as vacinas importantes para a saúde do seu filho. Lembre-se de consultar o pediatra para o calendário exato.
        </AlertDescription>
      </Alert>

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

      {vaccines.length === 0 && <p className="text-muted-foreground">Nenhuma vacina para exibir.</p>}
    </div>
  );
}
