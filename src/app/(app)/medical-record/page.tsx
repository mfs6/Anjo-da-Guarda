
import { MedicalRecordManager } from '@/components/features/medical-record/MedicalRecordManager';

export default function MedicalRecordPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Prontuário Médico</h1>
      <MedicalRecordManager />
    </div>
  );
}
