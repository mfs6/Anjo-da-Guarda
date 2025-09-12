
"use client";

import type { Vaccine } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Clock, Syringe } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface VaccineCardProps {
  vaccine: Vaccine;
  onUpdateStatus: (vaccineId: string, status: 'administered' | 'pending' | 'missed', date?: string) => void;
}

export function VaccineCard({ vaccine, onUpdateStatus }: VaccineCardProps) {
  const getStatusBadge = () => {
    switch (vaccine.status) {
      case "administered":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="mr-1 h-4 w-4" />Administrada</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white"><Clock className="mr-1 h-4 w-4" />Pendente</Badge>;
      case "missed":
        return <Badge variant="destructive"><AlertCircle className="mr-1 h-4 w-4" />Atrasada</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleAdminister = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    onUpdateStatus(vaccine.id, 'administered', today);
  };
  
  const handleMarkAsPending = () => {
    onUpdateStatus(vaccine.id, 'pending');
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg flex items-center gap-2"><Syringe className="text-primary" />{vaccine.name}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>Recomendada: {vaccine.ageDue}
        {vaccine.recommendedDate && ` (Aprox. ${format(parseISO(vaccine.recommendedDate), 'dd/MM/yyyy', {locale: ptBR})})`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{vaccine.description}</p>
        {vaccine.status === 'administered' && vaccine.administeredDate && (
          <p className="text-sm text-green-600 mt-2">
            Administrada em: {format(parseISO(vaccine.administeredDate), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4">
        {vaccine.status === 'pending' && (
          <Button size="sm" onClick={handleAdminister} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar como Administrada
          </Button>
        )}
        {vaccine.status === 'administered' && (
           <Button size="sm" variant="outline" onClick={handleMarkAsPending} className="w-full sm:w-auto">
             Marcar como Pendente
           </Button>
        )}
         {vaccine.status === 'missed' && (
          <Button size="sm" onClick={handleAdminister} className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
            Registrar Administração
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
