"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Syringe, Star, CalendarCheck2 } from "lucide-react";
import type { Vaccine, Milestone, ChildProfile } from "@/lib/types";
import { INITIAL_VACCINES, INITIAL_MILESTONES, MOCK_CHILD_PROFILE, calculateAgeInMonths } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Helper function to get upcoming items
const getUpcomingItems = (vaccines: Vaccine[], milestones: Milestone[], childAgeInMonths: number) => {
  const upcomingVaccines = vaccines
    .filter(v => v.status === 'pending')
    .map(v => ({ ...v, type: 'vaccine', dateLabel: v.ageDue, sortKey: v.ageDue.includes('meses') ? parseInt(v.ageDue) : 0  })) // Simple sort key
    .slice(0, 3); // Show next 3

  const upcomingMilestones = milestones
    .filter(m => !m.achieved)
    .map(m => ({ ...m, type: 'milestone', dateLabel: m.ageRange, sortKey: m.ageRange.includes('meses') ? parseInt(m.ageRange) : 0 }))
    .slice(0, 3); // Show next 3

  return [...upcomingVaccines, ...upcomingMilestones]
    .sort((a, b) => a.sortKey - b.sortKey) // Basic sort
    .slice(0, 5); // Show top 5 combined
};

export function InteractiveTimeline() {
  const [profile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const [vaccines] = useLocalStorage<Vaccine[]>('userVaccines', INITIAL_VACCINES);
  const [milestones] = useLocalStorage<Milestone[]>('userMilestones', INITIAL_MILESTONES);
  const [upcomingItems, setUpcomingItems] = useState<(any)[]>([]);
  const [childAgeInMonths, setChildAgeInMonths] = useState(0);

  useEffect(() => {
    if (profile.dob) {
      const age = calculateAgeInMonths(profile.dob);
      setChildAgeInMonths(age);
      const items = getUpcomingItems(vaccines, milestones, age);
      setUpcomingItems(items);
    }
  }, [profile, vaccines, milestones]);

  const getIcon = (type: string) => {
    if (type === 'vaccine') return <Syringe className="h-5 w-5 text-primary" />;
    if (type === 'milestone') return <Star className="h-5 w-5 text-accent" />;
    return <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Próximos Eventos para {profile.name}</CardTitle>
          <CardDescription>Idade atual: {childAgeInMonths} meses. Acompanhe as próximas vacinas e marcos importantes.</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingItems.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {upcomingItems.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={item.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      {getIcon(item.type)}
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">({item.type === 'vaccine' ? 'Vacina' : 'Marco'}) - {item.dateLabel}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-foreground mb-2">{item.description}</p>
                    <Button variant="link" asChild className="p-0 h-auto text-primary">
                       <Link href={item.type === 'vaccine' ? '/vaccines' : '/milestones'}>
                        Ver mais detalhes
                       </Link>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">Nenhum evento futuro encontrado ou tudo está em dia!</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary flex items-center gap-2"><Syringe /> Resumo de Vacinação</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-2">
              {vaccines.filter(v => v.status === 'administered').length} de {vaccines.length} vacinas administradas.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/vaccines">Gerenciar Vacinas</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><Star /> Resumo de Marcos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground mb-2">
              {milestones.filter(m => m.achieved).length} de {milestones.length} marcos alcançados.
            </p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/milestones">Acompanhar Marcos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
