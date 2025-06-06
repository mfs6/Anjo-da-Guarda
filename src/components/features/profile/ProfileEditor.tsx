"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { ChildProfile } from '@/lib/types';
import { MOCK_CHILD_PROFILE } from '@/lib/constants';
import { Save, UserCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const profileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  dob: z.string().refine((date) => /^\d{4}-\d{2}-\d{2}$/.test(date), { message: "Data de nascimento inválida. Use o formato AAAA-MM-DD."}),
  profilePictureUrl: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileEditor() {
  const [profile, setProfile] = useLocalStorage<ChildProfile>('childProfile', MOCK_CHILD_PROFILE);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(profile.profilePictureUrl || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Default values are set in useEffect to correctly reflect localStorage state
  });
  
  useEffect(() => {
    form.reset({
      name: profile.name || '',
      dob: profile.dob || '',
      profilePictureUrl: profile.profilePictureUrl || '',
    });
    setPreviewImage(profile.profilePictureUrl || null);
  }, [profile, form]);


  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        // For demo, store base64. In production, upload then set URL.
        form.setValue('profilePictureUrl', result, { shouldValidate: true }); 
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    setProfile(prev => ({
      ...prev,
      ...data,
      // If previewImage is a base64 string (from file upload), use it.
      // Otherwise, use the URL from the form field (which might have been manually entered or is the old one).
      profilePictureUrl: previewImage && previewImage.startsWith('data:image') ? previewImage : data.profilePictureUrl,
    }));
    toast({
      title: "Perfil Atualizado!",
      description: "As informações do perfil foram salvas com sucesso.",
      variant: "default",
      className: "bg-green-500 border-green-500 text-white"
    });
  };

  return (
    <div className="space-y-6">
       <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><UserCircle2 /> Editar Perfil de {form.watch('name') || "Criança"}</CardTitle>
          <CardDescription>Atualize as informações da criança.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-md">
                  <AvatarImage src={previewImage || "https://placehold.co/200x200.png"} alt={profile.name} data-ai-hint="child avatar" />
                  <AvatarFallback className="text-4xl">{form.watch('name')?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="profilePictureUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="profilePictureUrl-input">URL da Foto de Perfil</FormLabel>
                       <FormControl>
                        <Input
                          id="profilePictureUrl-input"
                          placeholder="https://example.com/image.png"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value && e.target.value.startsWith('http')) {
                                setPreviewImage(e.target.value);
                            } else if (!e.target.value) {
                                setPreviewImage(null);
                            }
                          }}
                          className="focus:ring-accent"
                        />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="w-full">
                  <Label htmlFor="picture-upload" className="text-sm font-medium">Ou Enviar Nova Foto</Label>
                  <Input
                    id="picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:ring-accent"
                    data-ai-hint="child photo"
                  />
                   <p className="text-xs text-muted-foreground mt-1">O envio de arquivo armazenará a imagem como base64 (para fins de demonstração).</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Nome da Criança</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Nome completo" {...field} className="focus:ring-accent"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dob">Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input id="dob" type="date" {...field} className="focus:ring-accent"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" /> Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
