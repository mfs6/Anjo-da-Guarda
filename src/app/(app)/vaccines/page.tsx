import { VaccineList } from '@/components/features/vaccines/VaccineList';

export default function VaccinesPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Rastreamento de Vacinas</h1>
      <VaccineList />
    </div>
  );
}
