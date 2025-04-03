'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { register as registerUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(data.name, data.email, data.password, data.password_confirmation);
      router.push('');
      router.refresh();
    } catch (err: any) {
      if (err.message) {
        setError(err.message);
      } else if (err.errors) {
        // Récupérer le premier message d'erreur
        const firstErrorKey = Object.keys(err.errors)[0];
        setError(err.errors[firstErrorKey][0]);
      } else {
        setError('Une erreur est survenue lors de l\'inscription');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Inscription</CardTitle>
        <CardDescription>
          Créez un compte pour commencer à utiliser l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-destructive">
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              {...register('name', { required: 'Le nom est requis' })}
              placeholder="Votre nom"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'L\'email est requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide'
                }
              })}
              placeholder="exemple@email.com"
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères'
                }
              })}
              placeholder="••••••••"
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
            <Input
              id="password_confirmation"
              type="password"
              {...register('password_confirmation', { 
                required: 'Veuillez confirmer votre mot de passe',
                validate: value => value === password || 'Les mots de passe ne correspondent pas'
              })}
              placeholder="••••••••"
              aria-invalid={!!errors.password_confirmation}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-destructive">{errors.password_confirmation.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Vous avez déjà un compte?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
} 