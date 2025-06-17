"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { summarizeSurveyResults } from '@/ai/flows/summarize-survey-results';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Play, Pause, RotateCcw, AlertTriangle, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SurveySummary } from '@/types';

interface AudioSummaryProps {
  surveySummary: SurveySummary; // Pass summary to potentially include in prompt if needed or display context
}

export default function AudioSummary({ surveySummary }: AudioSummaryProps) {
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setAudioDataUri(null); // Clear previous audio
    try {
      // The current summarizeSurveyResults flow doesn't use input based on the provided .ts file.
      // If it were to use the surveySummary, it would be passed here.
      const result = await summarizeSurveyResults({}); 
      if (result.audioDataUri) {
        setAudioDataUri(result.audioDataUri);
        toast({
          title: "Résumé Audio Généré",
          description: "Le résumé audio des résultats est prêt.",
        });
      } else {
        throw new Error("Aucune donnée audio retournée par le service.");
      }
    } catch (err) {
      console.error("Failed to generate audio summary:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
      setError(`Erreur lors de la génération du résumé : ${errorMessage}`);
      toast({
        title: "Erreur de Génération",
        description: `Impossible de générer le résumé audio. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.error("Error playing audio:", e);
          toast({ title: "Erreur de lecture", description: "Impossible de lire l'audio.", variant: "destructive"});
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  };
  
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioDataUri]);


  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary flex items-center">
          <Volume2 className="mr-3 h-7 w-7" />
          Résumé Audio des Résultats
        </CardTitle>
        <CardDescription>
          Écoutez un résumé rapide des statistiques actuelles du sondage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateSummary}
          disabled={isLoading}
          className="w-full font-headline text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Volume2 className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Génération en cours...' : 'Générer le Résumé Audio'}
        </Button>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-md flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {audioDataUri && (
          <div className="mt-4 p-4 border rounded-md bg-muted/50 space-y-3">
            <audio ref={audioRef} src={audioDataUri} className="hidden" />
            <div className="flex items-center justify-center space-x-3">
              <Button onClick={togglePlayPause} variant="outline" size="icon" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button onClick={restartAudio} variant="outline" size="icon" aria-label="Restart Audio">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
             <p className="text-xs text-center text-muted-foreground">Résumé audio prêt à être écouté.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
