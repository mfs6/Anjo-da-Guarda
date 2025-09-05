
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DoctorProfile } from '@/lib/types';
import { UserCircle2, ShieldCheck, BriefcaseMedical, ClipboardPlus, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function DoctorProfileDisplay() {
  const [profile, setProfile] = useLocalStorage<DoctorProfile | null>('doctorProfile', null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !profile) {
    return (
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Carregando Perfil...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Aguarde enquanto as informações do perfil são carregadas.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
        <Alert className="bg-primary/10 border-primary/30">
            <UserCircle2 className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Boas-vindas, {profile.name}!</AlertTitle>
            <AlertDescription>
            Este é o seu painel de perfil. Aqui você pode ver suas informações e acessar rapidamente as principais áreas do sistema.
            </AlertDescription>
        </Alert>

      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader className="items-center text-center">
            <Avatar className="w-32 h-32 border-4 border-primary shadow-md mb-4">
                <AvatarImage src={profile.profilePictureUrl || "https://placehold.co/200x200.png"} alt={profile.name} data-ai-hint="doctor photo" />
                <AvatarFallback className="text-4xl">{profile.name?.[0]?.toUpperCase() ?? 'D'}</AvatarFallback>
            </Avatar>
          <CardTitle className="font-headline text-2xl text-primary">
            {profile.name}
          </CardTitle>
          <CardDescription>Suas informações profissionais cadastradas no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
            <div className="flex items-center gap-4">
                <BriefcaseMedical className="h-6 w-6 text-muted-foreground" />
                <p><strong className="font-semibold">CRM:</strong> {profile.crm}</p>
            </div>
            <div className="flex items-center gap-4">
                <ClipboardPlus className="h-6 w-6 text-muted-foreground" />
                <p><strong className="font-semibold">Especialidade:</strong> {profile.specialty}</p>
            </div>
        </CardContent>
         <CardFooter>
            {/* Future edit button can go here */}
         </CardFooter>
      </Card>

       <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4">
                 <Link href="/appointments" className="flex flex-col gap-2 items-center">
                    <Users className="h-8 w-8" />
                    <span className="font-semibold">Ver Agenda</span>
                 </Link>
            </Button>
             <Button asChild variant="outline" className="h-auto py-4">
                 <Link href="/medical-record" className="flex flex-col gap-2 items-center">
                    <ShieldCheck className="h-8 w-8" />
                    <span className="font-semibold">Ver Prontuários</span>
                 </Link>
            </Button>
        </CardContent>
       </Card>
    </div>
  );
}
