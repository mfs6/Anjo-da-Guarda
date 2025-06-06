"use client";

import React from 'react';
import type { Milestone, ChildProfile } from "@/lib/types";
import { MilestoneItem } from "./MilestoneItem";
import { INITIAL_MILESTONES, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Helper to determine if a milestone is age-appropriate
const isMilestoneAgeAppropriate = (milestone: Milestone, childAgeInMonths: number): boolean => {
  const ageRangeParts = milestone.ageRange.match(/(\d+)-(\d+)\s*meses/);
  if (ageRangeParts) {
    const minAge = parseInt(ageRangeParts[1], 10);
    const maxAge = parseInt(ageRangeParts[2], 10);
    return childAgeInMonths >= minAge && childAgeInMonths <= maxAge;
  }
  return true; // Default to true if parsing fails
};

export function MilestoneTracker() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [milestones, setMilestones] = useLocalStorage<Milestone[]>('userMilestones', INITIAL_MILESTONES);
  const [childAgeInMonths, setChildAgeInMonths] = React.useState(0);

  React.useEffect(() => {
    if (profile.dob) {
      setChildAgeInMonths(calculateAgeInMonths(profile.dob));
    }
  }, [profile.dob]);

  const handleToggleAchieved = (milestoneId: string, achieved: boolean, date?: string) => {
    setMilestones(prevMilestones =>
      prevMilestones.map(m =>
        m.id === milestoneId ? { ...m, achieved, achievedDate: date } : m
      )
    );
  };

  const handleUploadVideo = (milestoneId: string, videoFile: File) => {
    // Simulate video upload: In a real app, upload to a service and get a URL.
    // For now, store a placeholder or use object URL (though object URL is temporary).
    const pseudoUrl = `simulated_video_path/${videoFile.name}`;
    setMilestones(prevMilestones =>
      prevMilestones.map(m =>
        m.id === milestoneId ? { ...m, videoUrl: pseudoUrl } : m
      )
    );
    console.log(`Simulated upload for ${milestoneId}: ${videoFile.name}. URL: ${pseudoUrl}`);
  };
  
  const achievedCount = milestones.filter(m => m.achieved).length;
  const totalCount = milestones.length;
  const progressPercentage = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

  const ageAppropriateMilestones = milestones.filter(m => isMilestoneAgeAppropriate(m, childAgeInMonths) && !m.achieved);
  const upcomingMilestones = milestones.filter(m => !isMilestoneAgeAppropriate(m, childAgeInMonths) && !m.achieved && childAgeInMonths < (parseInt(m.ageRange.match(/(\d+)-(\d+)\s*meses/)?.[1] || '0')) );
  const achievedMilestones = milestones.filter(m => m.achieved).sort((a,b) => new Date(b.achievedDate || 0).getTime() - new Date(a.achievedDate || 0).getTime());


  return (
    <div className="space-y-8">
      <Alert className="bg-accent/10 border-accent/30">
        <Star className="h-5 w-5 text-accent" />
        <AlertTitle className="font-headline text-accent">Marcos de Desenvolvimento de {profile.name}</AlertTitle>
        <AlertDescription>
          Acompanhe o progresso do seu filho. Cada criança se desenvolve em seu próprio ritmo.
          Idade atual: {childAgeInMonths} meses.
        </AlertDescription>
      </Alert>

      <div>
        <h3 className="text-lg font-semibold mb-2">Progresso Geral dos Marcos</h3>
        <Progress value={progressPercentage} className="w-full [&>div]:bg-accent" />
        <p className="text-sm text-muted-foreground mt-1">{achievedCount} de {totalCount} marcos alcançados.</p>
      </div>

      {ageAppropriateMilestones.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-primary mb-4">Marcos para a Idade Atual ({childAgeInMonths} meses)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ageAppropriateMilestones.map(milestone => (
              <MilestoneItem key={milestone.id} milestone={milestone} onToggleAchieved={handleToggleAchieved} onUploadVideo={handleUploadVideo} />
            ))}
          </div>
        </div>
      )}

      {upcomingMilestones.length > 0 && (
         <div>
         <h2 className="text-2xl font-headline font-semibold text-primary/80 mb-4">Próximos Marcos</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {upcomingMilestones.map(milestone => (
             <MilestoneItem key={milestone.id} milestone={milestone} onToggleAchieved={handleToggleAchieved} onUploadVideo={handleUploadVideo} />
           ))}
         </div>
       </div>
      )}
      
      {achievedMilestones.length > 0 && (
        <div>
          <h2 className="text-2xl font-headline font-semibold text-green-600 mb-4">Marcos Alcançados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievedMilestones.map(milestone => (
              <MilestoneItem key={milestone.id} milestone={milestone} onToggleAchieved={handleToggleAchieved} onUploadVideo={handleUploadVideo} />
            ))}
          </div>
        </div>
      )}
      
      {milestones.length === 0 && <p className="text-muted-foreground">Nenhum marco para exibir.</p>}
      {(ageAppropriateMilestones.length === 0 && upcomingMilestones.length === 0 && achievedMilestones.length < totalCount) && (
         <p className="text-muted-foreground text-center py-4">Parece que não há marcos ativos para a idade atual, mas ainda há marcos futuros ou todos já foram alcançados!</p>
      )}
    </div>
  );
}
