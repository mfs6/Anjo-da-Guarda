
"use client";

import type { Appointment } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2, XCircle, Clock, MapPin, Edit3, User, History } from "lucide-react";
import { format, parseISO, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DoctorAppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus: (appointmentId: string, newStatus: Appointment['status']) => void;
}

export function DoctorAppointmentCard({ appointment, onUpdateStatus }: DoctorAppointmentCardProps) {
  const isAppointmentPast = isPast(parseISO(`${appointment.appointmentDate}T${appointment.appointmentTime}:00`));
  const effectiveStatus = (appointment.status === 'scheduled' && isAppointmentPast) ? 'missed' : appointment.status;

  const getStatusBadge = () => {
    switch (effectiveStatus) {
      case "scheduled":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white"><Clock className="mr-1 h-4 w-4" />Agendada</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="mr-1 h-4 w-4" />Concluída</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600"><XCircle className="mr-1 h-4 w-4" />Cancelada</Badge>;
      case "missed":
        return <Badge variant="outline" className="bg-yellow-500 border-yellow-600 text-white hover:bg-yellow-600"><History className="mr-1 h-4 w-4" />Não Realizada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleMarkAsCompleted = () => {
    onUpdateStatus(appointment.id, 'completed');
  };

  const handleCancel = () => {
    onUpdateStatus(appointment.id, 'cancelled');
  };
  
  const handleEdit = () => {
    alert(`Funcionalidade de editar a consulta ${appointment.id} para o paciente ${appointment.patientName} a ser implementada.`);
  }

  const formattedDate = format(parseISO(`${appointment.appointmentDate}T${appointment.appointmentTime}`), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg flex items-center gap-2">
                <User className="text-primary" />
                Paciente: {appointment.patientName}
            </CardTitle>
            {getStatusBadge()}
        </div>
        <CardDescription className="flex flex-col gap-1 pt-2">
            <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" /> {appointment.specialty} em {formattedDate}
            </span>
             {appointment.location && (
                <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" /> {appointment.location}
                </span>
            )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointment.notes && (
          <div>
            <h4 className="text-sm font-semibold text-foreground">Observações:</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{appointment.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
        {effectiveStatus === 'scheduled' && (
          <>
            <Button size="sm" onClick={handleMarkAsCompleted} className="bg-green-500 hover:bg-green-600 text-white">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar como Concluída
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel} className="text-red-600 border-red-600 hover:text-red-700 hover:border-red-700 hover:bg-red-50">
              <XCircle className="mr-2 h-4 w-4" /> Cancelar Consulta
            </Button>
          </>
        )}
        <Button variant="outline" size="sm" onClick={handleEdit} className="text-blue-600 border-blue-600 hover:bg-blue-50">
          <Edit3 className="mr-2 h-4 w-4" /> Editar
        </Button>
      </CardFooter>
    </Card>
  );
}
