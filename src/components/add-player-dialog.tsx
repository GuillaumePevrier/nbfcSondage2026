
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { addNewPlayerAction } from '@/actions/playerActions';
import { UserPlus, Loader2 } from 'lucide-react';

const addPlayerSchema = z.object({
  playerName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères.'),
});

type AddPlayerFormValues = z.infer<typeof addPlayerSchema>;

interface AddPlayerDialogProps {
  onPlayerAdded?: () => void; 
  triggerButtonVariant?: "ghost" | "outline" | "default" | "secondary" | "link" | "destructive";
  triggerButtonClassName?: string;
  isMobile?: boolean;
}

export function AddPlayerDialog({ 
  onPlayerAdded, 
  triggerButtonVariant = "ghost", 
  triggerButtonClassName, 
  isMobile = false 
}: AddPlayerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AddPlayerFormValues>({
    resolver: zodResolver(addPlayerSchema),
    defaultValues: {
      playerName: '',
    },
  });

  const onSubmit: SubmitHandler<AddPlayerFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await addNewPlayerAction(data.playerName);
      if (result.success) {
        toast({
          title: 'Joueur Ajouté !',
          description: `${data.playerName} a été ajouté à la liste.`,
        });
        form.reset();
        setIsOpen(false);
        if (onPlayerAdded) {
          onPlayerAdded();
        }
        router.refresh(); 
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Impossible d'ajouter le joueur.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur Inattendue',
        description: "Une erreur s'est produite lors de l'ajout du joueur.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerContent = isMobile ? (
    <>
      <UserPlus className="h-5 w-5 text-muted-foreground" />
      <span>Ajouter Joueur</span>
    </>
  ) : (
    <>
      <UserPlus className="mr-2 h-5 w-5" />
      Ajouter un Joueur
    </>
  );
  
  const commonButtonClasses = "flex items-center rounded-md hover:bg-muted w-full text-left";

  const triggerElement = isMobile ? (
     <DialogTrigger asChild>
        <button className={`${commonButtonClasses} ${triggerButtonClassName || 'space-x-3 p-2'}`}>
         {triggerContent}
        </button>
    </DialogTrigger>
  ) : (
    <DialogTrigger asChild>
      <Button variant={triggerButtonVariant} className={triggerButtonClassName}>
        {triggerContent}
      </Button>
    </DialogTrigger>
  );


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerElement}
      <DialogContent className="sm:max-w-[425px] bg-card border-card-foreground/20">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Ajouter un Nouveau Joueur</DialogTitle>
          <DialogDescription>
            Entrez le nom du nouveau joueur. Il sera ajouté à la liste et pourra répondre au sondage.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="playerName" className="text-base">Nom du Joueur</Label>
            <Input
              id="playerName"
              {...form.register('playerName')}
              placeholder="Ex: Kylian Mbappé"
              className={`text-base ${form.formState.errors.playerName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            />
            {form.formState.errors.playerName && (
              <p className="text-sm text-destructive pt-1">
                {form.formState.errors.playerName.message}
              </p>
            )}
          </div>
          <DialogFooter className="sm:justify-between gap-2 pt-2">
             <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting} size="lg">
                Annuler
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90" size="lg">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              Ajouter le Joueur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
