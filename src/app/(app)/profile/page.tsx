import { ProfileEditor } from '@/components/features/profile/ProfileEditor';

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-3xl font-headline font-bold text-primary mb-6 sr-only">Gerenciamento de Perfil</h1>
      <ProfileEditor />
    </div>
  );
}
