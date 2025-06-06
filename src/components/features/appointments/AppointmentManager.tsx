
"use client";

import React, { useState, useEffect } from 'react';
import type { Appointment, ChildProfile } from "@/lib/types";
import { INITIAL_APPOINTMENTS, MOCK_CHILD_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./AppointmentCard";
import { Users, PlusCircle } from "lucide-react";
import { parseISO, isFuture, isPast } from 'date-fns';

export function AppointmentManager() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('userAppointments', INITIAL_APPOINTMENTS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleUpdateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
    // In a real app, you might want to add more logic here, e.g., if cancelled, clear date/time for rescheduling.
  };

  const handleAddAppointment = () => {
    // Placeholder for adding a new appointment - will likely open a modal/dialog
    alert("Funcionalidade de adicionar nova consulta a ser implementada.");
  };

  const upcomingAppointments = appointments.filter(apt => {
    if (apt.status !== 'scheduled') return false;
    if (!isClient) return true; // During SSR or before client hydration, assume it's upcoming if scheduled
    const appointmentDateTime = parseISO(`${apt.appointmentDate}T${apt.appointmentTime}:00`);
    return isFuture(appointmentDateTime);
  }).sort((a, b) => parseISO(`${a.appointmentDate}T${a.appointmentTime}:00`).getTime() - parseISO(`${b.appointmentDate}T${b.appointmentTime}:00`).getTime());

  const pastAppointments = appointments.filter(apt => {
    if (apt.status === 'completed' || apt.status === 'cancelled') return true;
    if (apt.status === 'scheduled') {
      if (!isClient) return false; // During SSR or before client hydration, don't prematurely mark as past
      const appointmentDateTime = parseISO(`${apt.appointmentDate}T${apt.appointmentTime}:00`);
      // If it's past and still scheduled, we can consider it 'missed' implicitly for history
      return isPast(appointmentDateTime); 
    }
    return false;
  }).sort((a, b) => parseISO(`${b.appointmentDate}T${b.appointmentTime}:00`).getTime() - parseISO(`${a.appointmentDate}T${a.appointmentTime}:00`).getTime());


  return (
    <div className="space-y-8">
      <Alert className="bg-primary/10 border-primary/30">
        <Users className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Consultas Médicas de {profile.name}</AlertTitle>
        <AlertDescription>
          Acompanhe as consultas agendadas e o histórico de visitas a profissionais de saúde.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button onClick={handleAddAppointment} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Adicionar Nova Consulta
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Próximas Consultas</TabsTrigger>
          <TabsTrigger value="history">Histórico de Consultas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-6">
              {upcomingAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateAppointmentStatus} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhuma consulta futura agendada.</p>
          )}
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          {pastAppointments.length > 0 ? (
            <div className="space-y-6">
              {pastAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateAppointmentStatus} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Nenhuma consulta no histórico.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
