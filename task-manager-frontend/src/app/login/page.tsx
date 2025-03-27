import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte',
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Bienvenue</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour vous connecter
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 