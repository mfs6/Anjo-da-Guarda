import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/AppLogo';
import { ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8 text-center">
      <AppLogo size={64} className="mb-8" />
      <h1 className="text-4xl font-headline font-bold text-primary mb-4">
        Bem-vindo ao Anjo da Guarda!
      </h1>
      <p className="text-lg text-foreground mb-8 max-w-md">
        Seu companheiro digital para acompanhar o desenvolvimento e a saúde do seu filho com facilidade e carinho.
      </p>
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="/dashboard">
          Acessar Painel
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <footer className="absolute bottom-8 text-sm text-muted-foreground">
        Feito com <span className="text-red-500">❤️</span> para cuidar de quem você ama.
      </footer>
    </div>
  );
}
