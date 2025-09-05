
"use client";

import type { MedicalRecordEntry } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Stethoscope, AlertTriangle, FileText, Syringe, Edit3, Trash2, Paperclip, Tag } from "lucide-react";

interface MedicalRecordEntryCardProps {
  entry: MedicalRecordEntry;
  onEdit: (entry: MedicalRecordEntry) => void;
  onDelete: (entryId: string) => void;
  persona: 'medico' | 'paciente' | null;
}

export function MedicalRecordEntryCard({ entry, onEdit, onDelete, persona }: MedicalRecordEntryCardProps) {
  const getEntryIcon = () => {
    switch (entry.entryType) {
      case "Consulta":
        return <Stethoscope className="h-5 w-5 text-blue-500" />;
      case "Emergência":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "Exame":
        return <FileText className="h-5 w-5 text-green-500" />;
      case "Vacinação":
        return <Syringe className="h-5 w-5 text-purple-500" />;
      case "Observação":
        return <Tag className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formattedDate = format(parseISO(entry.date), "dd/MM/yyyy", { locale: ptBR });
  const dateTimeString = entry.time ? `${formattedDate} às ${entry.time}` : formattedDate;

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            {getEntryIcon()}
            {entry.title}
          </CardTitle>
          <Badge variant="outline" className="text-sm">{entry.entryType}</Badge>
        </div>
        <CardDescription>
          {dateTimeString}
          {entry.professionalOrLocation && ` - ${entry.professionalOrLocation}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Resumo:</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{entry.summary || "Nenhum resumo adicionado."}</p>
        </div>
        {entry.attachments && entry.attachments.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground">Anexos:</h4>
            <ul className="list-none p-0 space-y-1">
              {entry.attachments.map((att, index) => (
                <li key={index} className="text-sm">
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    <Paperclip className="h-4 w-4" />
                    {att.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {persona === 'medico' && (
         <CardFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
            <Edit3 className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Excluir
            </Button>
         </CardFooter>
      )}
    </Card>
  );
}
