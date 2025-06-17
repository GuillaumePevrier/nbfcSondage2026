
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSurveyStore } from "@/store/survey";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { SurveyResponse } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Smile, Frown, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  playerId: z.string().min(1, "Veuillez sélectionner votre nom."),
  participating: z.boolean(),
});

type SurveyFormValues = z.infer<typeof formSchema>;

export default function SurveyForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { players, addResponse, responses } = useSurveyStore();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerId: "",
      participating: false, // "Non" par défaut
    },
  });

  const respondedPlayerIds = new Set(responses.map(r => r.playerId));
  const availablePlayers = players.filter(p => !respondedPlayerIds.has(p.id));

  useEffect(() => {
    if (selectedPlayerId) {
      form.setValue("playerId", selectedPlayerId);
    }
  }, [selectedPlayerId, form]);
  
  useEffect(() => {
    if (availablePlayers.length === 0 && players.length > 0) {
      toast({
        title: "Sondage Terminé",
        description: "Tous les joueurs ont répondu. Merci!",
        variant: "default"
      });
    }
  }, [availablePlayers, players, router, toast]);


  function onSubmit(values: SurveyFormValues) {
    const player = players.find(p => p.id === values.playerId);
    if (!player) {
      toast({
        title: "Erreur",
        description: "Joueur non trouvé.",
        variant: "destructive",
      });
      return;
    }

    const response: SurveyResponse = {
      id: crypto.randomUUID(),
      playerId: player.id,
      playerName: player.name,
      participating: values.participating,
      submissionTime: new Date().toISOString(),
    };
    addResponse(response);
    setIsParticipating(values.participating);
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
      router.push("/dashboard");
      toast({
        title: "Réponse Enregistrée!",
        description: `Merci ${player.name} pour votre réponse.`,
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
    }, 3000);
  }

  if (showConfirmation) {
    return (
      <Alert variant={isParticipating ? "default" : "default"} className={`border-2 ${isParticipating ? 'border-green-500' : 'border-accent'} bg-card text-center p-8 rounded-lg shadow-lg`}>
        {isParticipating ? <Smile className="h-16 w-16 mx-auto mb-4 text-green-500" /> : <Frown className="h-16 w-16 mx-auto mb-4 text-accent" />}
        <AlertTitle className="text-3xl font-headline mb-2">
          {isParticipating ? "Merci pour votre engagement !" : "Merci pour votre réponse !"}
        </AlertTitle>
        <AlertDescription className="text-lg">
          {isParticipating 
            ? "Votre énergie est précieuse pour l'équipe ! Préparez-vous pour une saison incroyable. Nous sommes ravis de vous compter parmi nous !" 
            : "Nous respectons votre décision. Votre contribution passée a été grandement appréciée. Nous vous souhaitons le meilleur !"}
        </AlertDescription>
        <p className="mt-6 text-sm text-muted-foreground">Vous allez être redirigé vers le tableau de bord...</p>
      </Alert>
    );
  }
  
  if (availablePlayers.length === 0 && players.length > 0) {
    return (
       <Alert variant="default" className="border-primary bg-card text-center p-8 rounded-lg shadow-lg">
        <Info className="h-16 w-16 mx-auto mb-4 text-primary" />
        <AlertTitle className="text-3xl font-headline mb-2">Sondage Complet!</AlertTitle>
        <AlertDescription className="text-lg">
          Tous les joueurs ont soumis leur réponse. Merci à tous pour votre participation !
        </AlertDescription>
        <Button onClick={() => router.push('/dashboard')} className="mt-6 font-headline text-lg">
          Voir le Tableau de Bord
        </Button>
      </Alert>
    )
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-2 sm:p-6">
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-headline text-primary">Nom du Joueur</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                setSelectedPlayerId(value);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-lg h-12 rounded-md border-input focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Sélectionnez votre nom dans la liste" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-card text-foreground">
                  {availablePlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id} className="text-lg hover:bg-muted focus:bg-muted cursor-pointer">
                      {player.name}
                    </SelectItem>
                  ))}
                  {availablePlayers.length === 0 && players.length > 0 && (
                    <SelectItem value="no-players" disabled>
                      Tous les joueurs ont répondu
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participating"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-xl font-headline text-primary">Votre décision pour la saison prochaine :</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={String(field.value)}
                  className="space-y-3"
                >
                  <FormItem className="rounded-md border border-input p-4 shadow-sm hover:shadow-md transition-shadow has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10">
                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="true" id="participating-yes" />
                      </FormControl>
                      <FormLabel htmlFor="participating-yes" className="text-lg font-normal text-foreground cursor-pointer flex-1">
                        Oui, je continue le futsal l'année prochaine
                      </FormLabel>
                    </div>
                  </FormItem>
                  <FormItem className="rounded-md border border-input p-4 shadow-sm hover:shadow-md transition-shadow has-[[data-state=checked]]:border-accent has-[[data-state=checked]]:bg-accent/10">
                    <div className="flex items-center space-x-3">
                      <FormControl>
                        <RadioGroupItem value="false" id="participating-no" />
                      </FormControl>
                      <FormLabel htmlFor="participating-no" className="text-lg font-normal text-foreground cursor-pointer flex-1">
                        Non, je ne continue pas le futsal l'année prochaine
                      </FormLabel>
                    </div>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full font-headline text-2xl py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-101" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Envoi en cours..." : "Valider ma Réponse"}
        </Button>
      </form>
    </Form>
  );
}

