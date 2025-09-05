
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { DoctorProfile } from '@/lib/types';
import { UserCircle2, Shield, Activity } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-3">
            <Shield />
            Informações do Perfil
          </CardTitle>
          <CardDescription>Suas informações profissionais cadastradas no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
            <div className="flex items-center gap-4">
                <UserCircle2 className="h-6 w-6 text-muted-foreground" />
                <p><strong>Nome:</strong> {profile.name}</p>
            </div>
            <div className="flex items-center gap-4">
                <Activity className="h-6 w-6 text-muted-foreground" />
                <p><strong>CRM:</strong> {profile.crm}</p>
            </div>
            <div className="flex items-center gap-4">
                <Shield className="h-6 w-6 text-muted-foreground" />
                <p><strong>Especialidade:</strong> {profile.specialty}</p>
            </div>
        </CardContent>
      </Card>

       <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-auto py-4">
                 <Link href="/appointments" className="flex flex-col gap-2">
                    <UserCircle2 className="h-8 w-8" />
                    <span className="font-semibold">Ver Agenda</span>
                 </Link>
            </Button>
             <Button asChild variant="outline" className="h-auto py-4">
                 <Link href="/medical-record" className="flex flex-col gap-2">
                    <Shield className="h-8 w-8" />
                    <span className="font-semibold">Ver Prontuários</span>
                 </Link>
            </Button>
        </CardContent>
       </Card>
    </div>
  );
}
