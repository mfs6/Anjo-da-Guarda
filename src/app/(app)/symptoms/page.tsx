
"use client";

import { SymptomChecker } from '@/components/features/symptoms/SymptomChecker';
import { useRouter } from 'next/navigation';

export default function SymptomsPage() {
    const router = useRouter();

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Verificador de Sintomas</h1>
            <SymptomChecker />
        </div>
    );
}
