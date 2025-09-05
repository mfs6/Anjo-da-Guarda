
"use client";

import React, { useState, useEffect } from 'react';
import type { Appointment, ChildProfile, DoctorProfile, SymptomCheckerResult } from "@/lib/types";
import { INITIAL_APPOINTMENTS, MOCK_CHILD_PROFILE } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./AppointmentCard";
import { DoctorAppointmentCard } from "./DoctorAppointmentCard";
import { Users, PlusCircle, ArrowRight, ArrowLeft, CalendarDays, UserCheck } from "lucide-react";
import { parseISO, isFuture, isPast } from 'date-fns';
import { AppointmentScheduler } from './AppointmentScheduler';
import { SymptomChecker } from '../symptoms/SymptomChecker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TriageResultAlert } from './TriageResultAlert';

type Persona = 'medico' | 'paciente';

export function AppointmentManager() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('userAppointments', INITIAL_APPOINTMENTS);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<'symptoms' | 'triageResult' | 'schedule'>('symptoms');
  const [symptomResult, setSymptomResult] = useState<SymptomCheckerResult | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);


  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const storedPersona = localStorage.getItem('userPersona') as Persona;
      setPersona(storedPersona);

      if (storedPersona === 'medico') {
        const storedDoctorProfile = localStorage.getItem('doctorProfile');
        if (storedDoctorProfile) {
          setDoctorProfile(JSON.parse(storedDoctorProfile));
        }
      }
    }
  }, []);

  const handleUpdateAppointmentStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };
  
  const handleAppointmentScheduled = (newAppointmentData: Omit<Appointment, 'id' | 'childId' | 'status' | 'patientName'>) => {
    const newAppointment: Appointment = {
        ...newAppointmentData,
        id: `apt_${Date.now()}`,
        childId: profile.id,
        status: 'scheduled',
        patientName: profile.name,
    };
    setAppointments(prev => [newAppointment, ...prev]);
    handleCloseModal(); // Close and reset modal
  };
  
  const handleSymptomCheckComplete = (result: SymptomCheckerResult) => {
    setSymptomResult(result);
    setStep('triageResult');
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset state after a short delay to allow closing animation
    setTimeout(() => {
      setStep('symptoms');
      setSymptomResult(null);
    }, 300);
  }

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


  const renderPatientView = () => (
    <>
      <Alert className="bg-primary/10 border-primary/30">
        <Users className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Consultas Médicas de {profile.name}</AlertTitle>
        <AlertDescription>
          Acompanhe as consultas agendadas e o histórico de visitas. Para agendar, faça uma triagem de sintomas primeiro.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
         <Dialog open={isModalOpen} onOpenChange={(open) => {
            if (!open) {
                handleCloseModal();
            } else {
                setIsModalOpen(true);
            }
         }}>
             <DialogTrigger asChild>
                <Button onClick={() => setIsModalOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Agendar Consulta
                </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-lg">
                {step === 'symptoms' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Passo 1: Triagem de Sintomas</DialogTitle>
                        </DialogHeader>
                        <SymptomChecker onCheckComplete={handleSymptomCheckComplete} isModalVersion={true} />
                    </>
                )}
                {step === 'triageResult' && symptomResult && (
                    <>
                         <DialogHeader>
                            <DialogTitle>Passo 2: Resultado da Triagem</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                           <TriageResultAlert result={symptomResult} />
                        </div>
                        <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setStep('symptoms')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Button>
                            <Button onClick={() => setStep('schedule')}>
                                Prosseguir para Agendamento
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </>
                )}
                {step === 'schedule' && (
                    <>
                         <DialogHeader>
                            <DialogTitle>Passo 3: Agendar Consulta</DialogTitle>
                        </DialogHeader>
                        <AppointmentScheduler 
                            onAppointmentScheduled={handleAppointmentScheduled} 
                            onCancel={() => setStep('triageResult')}
                         />
                    </>
                )}
             </DialogContent>
         </Dialog>
      </div>
    </>
  );

  const renderDoctorView = () => (
     <>
        {doctorProfile && (
           <Alert className="bg-primary/10 border-primary/30">
             <UserCheck className="h-5 w-5 text-primary" />
             <AlertTitle className="font-headline text-primary">Boas-vindas, {doctorProfile.name}!</AlertTitle>
             <AlertDescription>
                Especialidade: {doctorProfile.specialty}. Visualize suas consultas agendadas e o histórico.
             </AlertDescription>
           </Alert>
        )}
        <Alert className="bg-primary/10 border-primary/30">
            <CalendarDays className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Agenda de Consultas</AlertTitle>
            <AlertDescription>
            Visualize todas as consultas agendadas e o histórico. O status pode ser atualizado para manter os registros em dia.
            </AlertDescription>
        </Alert>
     </>
  );

  return (
    <div className="space-y-8">
      {persona === 'paciente' ? renderPatientView() : renderDoctorView()}

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Próximas Consultas</TabsTrigger>
          <TabsTrigger value="history">Histórico de Consultas</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-6">
              {upcomingAppointments.map(apt => (
                persona === 'medico' ? 
                <DoctorAppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateAppointmentStatus} /> :
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
                persona === 'medico' ?
                <DoctorAppointmentCard key={apt.id} appointment={apt} onUpdateStatus={handleUpdateAppointmentStatus} /> :
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
    
