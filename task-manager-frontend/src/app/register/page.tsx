import { RegisterForm } from '@/components/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inscription',
  description: 'Créez un nouveau compte',
};

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">
            Remplissez le formulaire ci-dessous pour créer votre compte
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 