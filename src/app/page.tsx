
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { ArrowRight, Stethoscope, Baby, KeyRound, Undo2, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { MOCK_DOCTOR_PROFILES, MOCK_CHILD_PROFILES } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function WelcomePage() {
  const [selectedPersona, setSelectedPersona] = useState<'paciente' | 'medico' | null>(null);
  const [cpf, setCpf] = useState("");
  const [crm, setCrm] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter();


  const handlePersonaSelect = (persona: 'paciente' | 'medico') => {
    setLoginError(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPersona', persona);
    }
    setSelectedPersona(persona);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    if (selectedPersona === 'medico') {
        const doctorProfile = MOCK_DOCTOR_PROFILES.find(doc => doc.crm === crm);
        if (doctorProfile) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('doctorProfile', JSON.stringify(doctorProfile));
            }
            router.push('/appointments');
        } else {
            setLoginError('CRM não encontrado. Por favor, verifique o número e tente novamente.');
        }
    } else {
        const childProfile = MOCK_CHILD_PROFILES.find(child => child.cpf === cpf);
        if (childProfile) {
             if (typeof window !== 'undefined') {
                localStorage.setItem('childProfile', JSON.stringify(childProfile));
            }
            router.push('/dashboard');
        } else {
            setLoginError('CPF não encontrado. Por favor, verifique o número e tente novamente.');
        }
    }
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, ''); 
    setter(numericValue);
  };
  
  const renderContent = () => {
    if (selectedPersona === 'paciente') {
      return (
        <div className="text-center">
            <div className="p-4 bg-accent/20 rounded-full mb-4 inline-block">
                <Baby className="h-12 w-12 text-accent" />
            </div>
          <h2 className="text-2xl font-headline font-bold text-accent mb-4">Acesso do Paciente</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
             {loginError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro de Acesso</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="cpf" className="sr-only">CPF</Label>
              <Input 
                id="cpf" 
                placeholder="Digite seu CPF (Apenas Números)" 
                className="text-center"
                minLength={11}
                maxLength={11}
                required
                value={cpf}
                onChange={(e) => handleNumericInput(e, setCpf)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                 <Button type="submit"
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                  disabled={cpf.length !== 11}
                  >
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
          <form onSubmit={handleFormSubmit} className="space-y-4">
             {loginError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro de Acesso</AlertTitle>
                <AlertDescription>{loginError}</AlertDescription>
              </Alert>
            )}
            <div>
              <Label htmlFor="crm" className="sr-only">CRM</Label>
              <Input 
                id="crm" 
                placeholder="Digite seu CRM (Apenas Números)" 
                className="text-center"
                minLength={5}
                maxLength={5}
                required
                value={crm}
                onChange={(e) => handleNumericInput(e, setCrm)}
              />
            </div>
             <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button type="submit" className="w-full" disabled={crm.length !== 5}>
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
        <Card className="text-center hover:shadow-lg hover:border-accent transition-all duration-300 cursor-pointer flex flex-col h-full" onClick={() => handlePersonaSelect('paciente')}>
          <CardHeader className="items-center">
            <div className="p-4 bg-accent/20 rounded-full mb-4">
              <Baby className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="font-headline text-2xl text-accent">Sou Paciente</CardTitle>
            <CardDescription>
              Acompanhe o calendário vacinal, marcos, nutrição e consultas do seu filho.
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
        <Card className="text-center hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col h-full" onClick={() => handlePersonaSelect('medico')}>
          <CardHeader className="items-center">
            <div className="p-4 bg-primary/20 rounded-full mb-4">
              <Stethoscope className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl text-primary">Sou Médico</CardTitle>
            <CardDescription>
              Visualize o prontuário completo de seus pacientes e adicione novas entradas.
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
