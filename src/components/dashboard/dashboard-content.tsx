
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSurveyStore } from "@/store/survey";
import type { SurveyResponse, SurveySummary, Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle, HelpCircle, Users, ShieldCheck, ShieldOff, Info, Loader2, RefreshCw } from "lucide-react";
import AudioSummary from "./audio-summary";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


const StatCard = ({ title, value, icon, color, description }: { title: string; value: string | number; icon: React.ElementType; color?: string; description?: string }) => {
  const IconComponent = icon;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <IconComponent className={`h-6 w-6 ${color || 'text-primary'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-headline text-primary">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};


export default function DashboardContent() {
  const { 
    getSummary, 
    responses, 
    players, 
    resetResponses, 
    isLoadingPlayers, 
    isLoadingResponses,
    fetchPlayers,
    fetchResponses,
    initStore
  } = useSurveyStore();
  const [summary, setSummary] = useState<SurveySummary | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateSummary = useCallback(() => {
    setSummary(getSummary());
  }, [getSummary]);

  useEffect(() => {
    setIsMounted(true);
    // initStore(); // L'initialisation est maintenant globale dans le store
    updateSummary(); // Initial summary calculation

    const unsubscribe = useSurveyStore.subscribe(
      (currentState) => {
        setSummary(currentState.getSummary());
      }
    );
    return () => unsubscribe();
  }, [updateSummary, initStore]);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    toast({ title: "Rafraîchissement...", description: "Mise à jour des données du sondage."});
    await fetchPlayers();
    await fetchResponses();
    updateSummary(); // Make sure summary is updated after fetching
    setIsRefreshing(false);
    toast({ title: "Données à jour!", description: "Les informations du sondage ont été actualisées."});
  };

  const handleReset = async () => {
    if(confirm("Êtes-vous sûr de vouloir réinitialiser toutes les réponses ? Cette action est irréversible et supprimera les données de la base de données.")) {
      setIsResetting(true);
      try {
        await resetResponses();
        toast({
          title: "Réponses Réinitialisées",
          description: "Toutes les réponses au sondage ont été effacées.",
        });
        updateSummary(); // Update summary after reset
      } catch (error) {
        console.error("Error resetting responses:", error);
        toast({
          title: "Erreur de Réinitialisation",
          description: "Impossible de réinitialiser les réponses.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }
  };


  if (!isMounted || isLoadingPlayers || isLoadingResponses && !summary ) {
    return (
      <div className="space-y-8">
         <div className="flex justify-center items-center h-64">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <p className="ml-4 text-2xl text-muted-foreground">Chargement des données du tableau de bord...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                <div className="h-6 w-6 bg-muted rounded-full animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-10 bg-muted rounded w-1/4 animate-pulse mb-2"></div>
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!summary) { // Handle case where summary is null after loading
     return (
      <div className="text-center py-10">
        <Info className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg text-muted-foreground">Aucune donnée de résumé disponible.</p>
        <Button onClick={handleRefreshData} className="mt-4" disabled={isRefreshing}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Rafraîchir les données
        </Button>
      </div>
     );
  }
  
  const respondedPercentage = summary.totalPlayers > 0 ? ((summary.yes + summary.no) / summary.totalPlayers) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button onClick={handleRefreshData} variant="outline" disabled={isRefreshing || isLoadingPlayers || isLoadingResponses}>
          {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Rafraîchir les Données
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Réponses 'Oui'" value={summary.yes} icon={ShieldCheck} color="text-green-500" description="Joueurs confirmés" />
        <StatCard title="Réponses 'Non'" value={summary.no} icon={ShieldOff} color="text-red-500" description="Joueurs non partants" />
        <StatCard title="En Attente" value={summary.pending} icon={HelpCircle} color="text-yellow-500" description="Réponses manquantes" />
        <StatCard title="Équipes Formables" value={summary.teams} icon={Users} description={`Basé sur ${summary.yes} 'Oui' / 10 joueurs`} />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Progression des Réponses</CardTitle>
          <CardDescription>{summary.yes + summary.no} sur {summary.totalPlayers} joueurs ont répondu.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={respondedPercentage} className="w-full h-4 rounded-full" aria-label={`${respondedPercentage.toFixed(0)}% des réponses reçues`} />
          <p className="text-right text-sm text-muted-foreground mt-2">{respondedPercentage.toFixed(0)}%</p>
        </CardContent>
      </Card>

      <AudioSummary surveySummary={summary} />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Détail des Réponses</CardTitle>
          <CardDescription>Liste des joueurs et leurs décisions.</CardDescription>
        </CardHeader>
        <CardContent>
          {players.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="font-headline text-primary">Nom du Joueur</TableHead>
                    <TableHead className="text-center font-headline text-primary">Statut</TableHead>
                    <TableHead className="text-right font-headline text-primary">Date de Réponse</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {players.map((player) => {
                    const response = responses.find(r => r.playerId === player.id);
                    return (
                      <TableRow key={player.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell className="text-center">
                          {response ? (
                            response.participating ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle2 className="mr-1.5 h-4 w-4 text-green-500" /> Oui
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <XCircle className="mr-1.5 h-4 w-4 text-red-500" /> Non
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <HelpCircle className="mr-1.5 h-4 w-4 text-yellow-500" /> En attente
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {response ? new Date(response.submissionTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
             <div className="text-center py-10">
                <Info className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg text-muted-foreground">Aucun joueur configuré.</p>
                <p className="text-sm text-muted-foreground">Veuillez vérifier la liste des joueurs ou rafraîchir.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8 flex justify-end">
        <Button variant="destructive" onClick={handleReset} className="font-headline" disabled={isResetting}>
          {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Réinitialiser les Réponses
        </Button>
      </div>
    </div>
  );
}
