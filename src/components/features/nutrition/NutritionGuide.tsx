"use client";

import React from 'react';
import type { NutritionTip, ChildProfile } from "@/lib/types";
import { NutritionCard } from "./NutritionCard";
import { NUTRITION_TIPS, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Apple } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function to get relevant tips for child's age
const getRelevantTips = (allTips: NutritionTip[], childAgeInMonths: number): NutritionTip[] => {
  return allTips.filter(tip => {
    const ageGroupParts = tip.ageGroup.match(/(\d+)-(\d+)\s*meses/);
    if (ageGroupParts) {
      const minAge = parseInt(ageGroupParts[1], 10);
      const maxAge = parseInt(ageGroupParts[2], 10);
      return childAgeInMonths >= minAge && childAgeInMonths <= maxAge;
    }
     const ageGroupPartsYears = tip.ageGroup.match(/(\d+)-(\d+)\s*anos/);
     if (ageGroupPartsYears) {
      const minAgeYears = parseInt(ageGroupPartsYears[1], 10);
      const maxAgeYears = parseInt(ageGroupPartsYears[2], 10);
      return childAgeInMonths >= (minAgeYears * 12) && childAgeInMonths <= (maxAgeYears * 12);
    }
    return false; 
  });
};

export function NutritionGuide() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [childAgeInMonths, setChildAgeInMonths] = React.useState(0);
  
  React.useEffect(() => {
    if (profile.dob) {
      setChildAgeInMonths(calculateAgeInMonths(profile.dob));
    }
  }, [profile.dob]);

  const ageGroups = React.useMemo(() => {
    const groups = new Set(NUTRITION_TIPS.map(tip => tip.ageGroup));
    return Array.from(groups).sort((a, b) => { 
        const numA = parseInt(a.split('-')[0]); // Get first number for sorting
        const numB = parseInt(b.split('-')[0]);
        const unitA = a.includes('anos') ? 12 : 1;
        const unitB = b.includes('anos') ? 12 : 1;
        return (numA * unitA) - (numB * unitB);
    });
  }, []);

  // Determine default tab based on child's age
  const relevantGroupForAge = React.useMemo(() => {
    const relevant = getRelevantTips(NUTRITION_TIPS, childAgeInMonths);
    return relevant.length > 0 ? relevant[0].ageGroup : ageGroups[0];
  }, [childAgeInMonths, ageGroups]);


  return (
    <div className="space-y-8">
      <Alert className="bg-primary/10 border-primary/30">
        <Apple className="h-5 w-5 text-primary" />
        <AlertTitle className="font-headline text-primary">Guia Nutricional para {profile.name}</AlertTitle>
        <AlertDescription>
          Dicas de nutrição adaptadas para a idade do seu filho ({childAgeInMonths} meses). Alimentação saudável é fundamental para o crescimento.
        </AlertDescription>
      </Alert>

      {ageGroups.length > 0 ? (
        <Tabs defaultValue={relevantGroupForAge} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-2 mb-4 overflow-x-auto pb-2">
            {ageGroups.map(group => (
              <TabsTrigger key={group} value={group} className="text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {group}
              </TabsTrigger>
            ))}
          </TabsList>
          {ageGroups.map(group => (
            <TabsContent key={group} value={group}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {NUTRITION_TIPS.filter(tip => tip.ageGroup === group).map(tip => (
                  <NutritionCard key={tip.id} tip={tip} />
                ))}
                {NUTRITION_TIPS.filter(tip => tip.ageGroup === group).length === 0 && (
                   <p className="text-muted-foreground col-span-full text-center py-4">Nenhuma dica disponível para esta faixa etária.</p>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
         <p className="text-muted-foreground text-center py-4">Nenhuma dica de nutrição cadastrada.</p>
      )}
    </div>
  );
}
