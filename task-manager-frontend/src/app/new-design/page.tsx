import { NewDesign } from '@/components/new-design';
import { getCurrentUser } from '@/lib/auth';

export default function NewPage() {
  const currentUser = getCurrentUser()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-2">Bienvenue</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Gerez vos taches
        </p>
        <NewDesign currentUserId={currentUser?.id || ''} />
      </div>
    </div>
  );
}