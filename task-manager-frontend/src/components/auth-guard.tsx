'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié côté client
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Si l'utilisateur n'est pas authentifié, ne rien afficher pendant la redirection
  if (typeof window !== 'undefined' && !isAuthenticated()) {
    return null;
  }

  return <>{children}</>;
} 