import { DoctorProfileDisplay } from '@/components/features/profile/DoctorProfileDisplay';

export default function DoctorProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Perfil Médico</h1>
      <DoctorProfileDisplay />
    </div>
  );
}
