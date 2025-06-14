
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from 'emailjs-com';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Player, SurveyFormData as ActionSurveyFormData } from '@/lib/players';
import { getAIMotivationalMessageAction, finalizeSurveyAction } from '@/actions/surveyActions';
import { PlayCircle, ChevronLeft, ChevronRight, Send, Loader2, Smile, Frown } from 'lucide-react';
import Image from 'next/image';

const formSchema = z.object({
  playerName: z.string().min(1, 'Le nom du joueur est requis.'),
  willContinue: z.enum(['yes', 'no'], { required_error: 'Veuillez sélectionner une option.' }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'welcome', title: 'Bienvenue !' },
  { id: 'decision', title: 'Vos Projets ?' },
  { id: 'motivation', title: 'Un Petit Coup de Pouce !' },
  { id: 'complete', title: 'Merci !' },
];

const slideVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? '100%' : '-100%',
  }),
  visible: {
    opacity: 1,
    x: '0%',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? '100%' : '-100%',
    transition: { duration: 0.5, ease: 'easeInOut' },
  }),
};

interface SurveyFormProps {
  players: Player[]; // Player list from Firestore
}

export function SurveyForm({ players }: SurveyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState<string | null>(null);
  
  const prefilledPlayerName = searchParams.get('playerName');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerName: prefilledPlayerName || '',
      willContinue: undefined,
    },
  });

  useEffect(() => {
    if (prefilledPlayerName) {
      form.setValue('playerName', prefilledPlayerName);
    }
  }, [prefilledPlayerName, form]);

  const handleNext = async () => {
    setDirection(1);
    if (currentStep === 1) { // Decision step
      const isValid = await form.trigger(['playerName', 'willContinue']);
      if (!isValid) return;

      setIsLoading(true);
      try {
        const playerNameValue = form.getValues('playerName');
        const willContinueValue = form.getValues('willContinue') === 'yes';
        const message = await getAIMotivationalMessageAction(playerNameValue, willContinueValue);
        setMotivationalMessage(message);
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de récupérer le message de motivation.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let finalMotivationalMessage = motivationalMessage;

    setIsSubmitting(true);
    // Ensure motivational message is generated if not already
    if (!finalMotivationalMessage && data.willContinue) {
        setIsLoading(true); // Show loading for AI message generation
        try {
            finalMotivationalMessage = await getAIMotivationalMessageAction(data.playerName, data.willContinue === 'yes');
            setMotivationalMessage(finalMotivationalMessage); // Store it
        } catch (error) {
            toast({ title: 'Erreur de Motivation', description: 'Impossible de générer le message IA. Utilisation d\'un message par défaut.', variant: 'default' });
            finalMotivationalMessage = data.willContinue === 'yes' ? "Super nouvelle ! Préparez-vous pour une saison incroyable." : "Merci pour votre participation ! Nous vous souhaitons le meilleur.";
        } finally {
            setIsLoading(false);
        }
    }
    
    // Fallback if message is still null (should not happen if logic above is correct)
    if (!finalMotivationalMessage) {
        finalMotivationalMessage = data.willContinue === 'yes' ? "Message positif par défaut." : "Message de remerciement par défaut.";
    }

    try {
      // The server action `finalizeSurveyAction` now expects `playerName` and `willContinue`
      const surveyPayload: ActionSurveyFormData = {
        playerName: data.playerName,
        willContinue: data.willContinue === 'yes',
      };
      
      const result = await finalizeSurveyAction(surveyPayload, finalMotivationalMessage);

      if (result.success && result.data) {
        const emailParams = {
          to_name: 'Manager de l\'équipe',
          from_name: data.playerName,
          player_name: data.playerName,
          decision: data.willContinue === 'yes' ? 'Continue la saison prochaine' : 'Ne continue pas la saison prochaine',
          motivational_message: finalMotivationalMessage,
          reply_to: 'no-reply@futsalfuture.com',
        };
        
        const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
        const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
        const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';

        if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
           console.warn("EmailJS non configuré. Veuillez définir NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, et NEXT_PUBLIC_EMAILJS_PUBLIC_KEY dans votre fichier .env ou .env.local.");
           toast({ title: 'Sondage Soumis (Email non envoyé)', description: 'Réponse enregistrée. EmailJS non configuré.' });
        } else {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams, EMAILJS_PUBLIC_KEY);
            toast({ title: 'Sondage Soumis !', description: 'Votre réponse a été enregistrée et un email envoyé.' });
        }
        router.refresh(); // Refresh data on other pages
        setCurrentStep((prev) => prev + 1); // Move to complete step
      } else {
        toast({ title: 'Échec de la Soumission', description: result.error || 'Impossible d\'enregistrer votre réponse.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Erreur de soumission:', error);
      toast({ title: 'Erreur de Soumission', description: 'Une erreur inattendue est survenue.', variant: 'destructive' });
    } finally {
      setIsLoading(false); 
      setIsSubmitting(false);
    }
  };
  
  const currentStepDetails = useMemo(() => steps[currentStep], [currentStep]);

  return (
    <Card className="w-full shadow-2xl bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.png" alt="Logo du Club" width={60} height={60} />
        </div>
        <CardTitle className="font-headline text-4xl">{currentStepDetails.title}</CardTitle>
        {currentStep === 0 && <CardDescription className="text-lg">Aidez-nous à planifier une prochaine saison incroyable !</CardDescription>}
      </CardHeader>
      <CardContent className="min-h-[280px] flex items-center justify-center overflow-hidden p-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {currentStep === 0 && ( 
                  <div className="text-center space-y-6">
                    <p className="text-xl">
                      Votre avis est crucial pour le succès de notre équipe. Ce rapide sondage nous aidera à comprendre votre disponibilité pour la prochaine saison de Futsal.
                    </p>
                  </div>
                )}

                {currentStep === 1 && ( 
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="playerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium">Nom du Joueur</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Sélectionnez votre nom" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {players.map((player) => (
                              <SelectItem key={player.id} value={player.name} className="text-base">
                                {player.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="willContinue"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-medium">Êtes-vous avec nous pour la saison prochaine ?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 pt-2"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" id="willContinue-yes"/>
                              </FormControl>
                              <Label htmlFor="willContinue-yes" className="font-normal text-base flex items-center cursor-pointer"><Smile className="mr-2 h-5 w-5 text-green-500"/>Oui, je suis partant !</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" id="willContinue-no"/>
                              </FormControl>
                              <Label htmlFor="willContinue-no" className="font-normal text-base flex items-center cursor-pointer"><Frown className="mr-2 h-5 w-5 text-red-500"/>Non, je ne serai pas là cette fois.</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>  
                )}

                {currentStep === 2 && ( 
                  <div className="text-center space-y-6 p-4 border border-primary/50 rounded-lg bg-primary/10">
                     <p className="text-xl font-semibold text-primary-foreground bg-primary p-3 rounded-md shadow-md">{isLoading ? "Génération du message..." : motivationalMessage}</p>
                    <p className="text-muted-foreground">Prêt à officialiser ?</p>
                  </div>
                )}

                {currentStep === 3 && ( 
                   <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold font-headline text-primary">Sondage Terminé !</h2>
                    <p className="text-xl">Merci pour votre temps et votre précieuse contribution. Nous avons enregistré votre réponse.</p>
                    <Button onClick={() => router.push('/results')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Voir les Réponses de l'Équipe
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      </CardContent>
      <CardFooter className="flex justify-between pt-6">
        {currentStep > 0 && currentStep < 3 && (
          <Button variant="outline" onClick={handleBack} disabled={isLoading || isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
        )}
        {currentStep === 0 && (
           <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            C'est Parti ! <PlayCircle className="ml-2 h-5 w-5" />
          </Button>
        )}
        {currentStep === 1 && (
          <Button onClick={handleNext} disabled={isLoading || isSubmitting} className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            Suivant
          </Button>
        )}
        {currentStep === 2 && (
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting || isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Soumettre & Terminer
          </Button>
        )}
        {currentStep === 3 && <div className="h-10"></div> /* Placeholder for consistent footer height */} 
      </CardFooter>
    </Card>
  );
}
