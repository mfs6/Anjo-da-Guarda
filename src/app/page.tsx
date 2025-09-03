
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { ArrowRight, Stethoscope, Baby, KeyRound, Undo2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WelcomePage() {
  const [selectedPersona, setSelectedPersona] = useState<'paciente' | 'medico' | null>(null);

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  };

  const renderContent = () => {
    if (selectedPersona === 'paciente') {
      return (
        <div className="text-center">
            <div className="p-4 bg-accent/20 rounded-full mb-4 inline-block">
                <Baby className="h-12 w-12 text-accent" />
            </div>
          <h2 className="text-2xl font-headline font-bold text-accent mb-4">Acesso do Paciente</h2>
          <form action="/dashboard" className="space-y-4">
            <div>
              <Label htmlFor="cpf" className="sr-only">CPF</Label>
              <Input 
                id="cpf" 
                placeholder="Digite seu CPF (Apenas Números)" 
                className="text-center"
                maxLength={11}
                minLength={11}
                required
                onChange={handleNumericInput}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                 <Button type="submit" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                    <KeyRound className="mr-2 h-4 w-4" /> Acessar com CPF
                 </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedPersona(null)}>
                    <Undo2 className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>
          </form>
        </div>
      );
    }

    if (selectedPersona === 'medico') {
      return (
         <div className="text-center">
            <div className="p-4 bg-primary/20 rounded-full mb-4 inline-block">
                <Stethoscope className="h-12 w-12 text-primary" />
            </div>
          <h2 className="text-2xl font-headline font-bold text-primary mb-4">Acesso Médico</h2>
          <form action="/dashboard" className="space-y-4">
            <div>
              <Label htmlFor="crm" className="sr-only">CRM</Label>
              <Input 
                id="crm" 
                placeholder="Digite seu CRM (Apenas Números)" 
                className="text-center"
                maxLength={5}
                minLength={5}
                required
                onChange={handleNumericInput}
              />
            </div>
             <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button type="submit" className="w-full">
                    <KeyRound className="mr-2 h-4 w-4" /> Acessar com CRM
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedPersona(null)}>
                    <Undo2 className="mr-2 h-4 w-4" /> Voltar
                </Button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Persona: Paciente */}
        <Card className="text-center hover:shadow-lg hover:border-accent transition-all duration-300 cursor-pointer flex flex-col h-full" onClick={() => setSelectedPersona('paciente')}>
          <CardHeader className="items-center">
            <div className="p-4 bg-accent/20 rounded-full mb-4">
              <Baby className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="font-headline text-2xl text-accent">Sou Paciente</CardTitle>
            <CardDescription>
              Acompanhe vacinas, marcos, consultas e a saúde do seu filho.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button variant="ghost" className="text-accent hover:text-accent">
              Acessar painel do paciente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>

        {/* Persona: Médico */}
        <Card className="text-center hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col h-full" onClick={() => setSelectedPersona('medico')}>
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/20 rounded-full mb-4">
              <Stethoscope className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl text-primary">Sou Médico</CardTitle>
            <CardDescription>
              Visualize o prontuário de seus pacientes e adicione novas entradas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-end justify-center">
            <Button variant="ghost" className="text-primary hover:text-primary">
              Acessar portal médico
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <header className="text-center mb-12">
        <AppLogo size={64} className="mb-8 justify-center" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Bem-vindo ao Anjo da Guarda!
        </h1>
        <p className="text-lg text-foreground max-w-2xl">
          {selectedPersona ? 'Preencha suas credenciais para continuar.' : 'Selecione seu perfil para acessar a plataforma de acompanhamento de saúde infantil.'}
        </p>
      </header>

      <main className="w-full flex justify-center">
        {renderContent()}
      </main>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        Feito com <span className="text-red-500">❤️</span> para cuidar de quem você ama.
      </footer>
    </div>
  );
}
