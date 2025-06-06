
import { AppointmentManager } from '@/components/features/appointments/AppointmentManager';

export default function AppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Gerenciamento de Consultas</h1>
      <AppointmentManager />
    </div>
  );
}
