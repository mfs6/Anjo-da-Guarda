"use client";

import type { Milestone } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Video, CheckCircle2 } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MilestoneItemProps {
  milestone: Milestone;
  onToggleAchieved: (milestoneId: string, achieved: boolean, date?: string) => void;
  onUploadVideo: (milestoneId: string, videoFile: File) => void; // Placeholder for actual upload
}

export function MilestoneItem({ milestone, onToggleAchieved, onUploadVideo }: MilestoneItemProps) {
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCheckedChange = (checked: boolean | 'indeterminate') => {
    if (typeof checked === 'boolean') {
      const date = checked ? format(new Date(), 'yyyy-MM-dd') : undefined;
      onToggleAchieved(milestone.id, checked, date);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleVideoSubmit = () => {
    if (selectedFile) {
      onUploadVideo(milestone.id, selectedFile); // In a real app, this would trigger an upload process
      alert(`Vídeo "${selectedFile.name}" para "${milestone.name}" pronto para envio (simulado).`);
      setShowVideoUpload(false);
      setSelectedFile(null);
    }
  };

  return (
    <Card className={`shadow-md hover:shadow-xl transition-all duration-300 ${milestone.achieved ? 'bg-green-500/10 border-green-500/30' : 'bg-background'}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className={`font-headline text-lg flex items-center gap-2 ${milestone.achieved ? 'text-green-700' : 'text-accent'}`}>
            {milestone.achieved ? <CheckCircle2 /> : <Star />}
            {milestone.name}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`milestone-${milestone.id}`}
              checked={milestone.achieved}
              onCheckedChange={handleCheckedChange}
              aria-labelledby={`label-milestone-${milestone.id}`}
              className={milestone.achieved ? "data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" : "data-[state=checked]:bg-accent data-[state=checked]:border-accent"}
            />
            <Label htmlFor={`milestone-${milestone.id}`} id={`label-milestone-${milestone.id}`} className="text-sm">
              {milestone.achieved ? "Alcançado" : "Marcar"}
            </Label>
          </div>
        </div>
        <CardDescription>Faixa Etária Esperada: {milestone.ageRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{milestone.description}</p>
        {milestone.achieved && milestone.achievedDate && (
          <p className="text-sm text-green-600 mt-2">
            Alcançado em: {format(parseISO(milestone.achievedDate), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        )}
        {milestone.videoUrl && (
            <p className="text-sm text-blue-600 mt-2">Vídeo salvo: <a href={milestone.videoUrl} target="_blank" rel="noopener noreferrer" className="underline">{milestone.videoUrl}</a></p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-4">
        {!milestone.achieved && (
             <Button variant="outline" size="sm" onClick={() => setShowVideoUpload(!showVideoUpload)} className="w-full sm:w-auto">
             <Video className="mr-2 h-4 w-4" />
             {showVideoUpload ? "Cancelar Vídeo" : "Adicionar Vídeo"}
           </Button>
        )}
        {showVideoUpload && !milestone.achieved && (
          <div className="w-full space-y-2 mt-2 sm:mt-0 border-t pt-4 sm:border-t-0 sm:pt-0">
            <Input type="file" accept="video/*" onChange={handleFileChange} className="w-full" data-ai-hint="child video"/>
            {selectedFile && <Button size="sm" onClick={handleVideoSubmit} className="w-full bg-primary hover:bg-primary/90">Enviar Vídeo (Simulado)</Button>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
