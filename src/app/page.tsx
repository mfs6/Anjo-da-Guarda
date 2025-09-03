
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { ArrowRight, Stethoscope, Baby } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center mb-12">
        <AppLogo size={64} className="mb-8 justify-center" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Bem-vindo ao Anjo da Guarda!
        </h1>
        <p className="text-lg text-foreground max-w-2xl">
          Selecione seu perfil para acessar a plataforma de acompanhamento de saúde infantil.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Persona: Paciente */}
        <Link href="/dashboard" className="h-full">
            <Card className="text-center hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col h-full">
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
        </Link>
        
        {/* Persona: Médico */}
        <Link href="/dashboard" className="h-full">
             <Card className="text-center hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer flex flex-col h-full">
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
        </Link>
      </div>

      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        Feito com <span className="text-red-500">❤️</span> para cuidar de quem você ama.
      </footer>
    </div>
  );
}

