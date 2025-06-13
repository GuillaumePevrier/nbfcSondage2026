
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from "@/components/ui/progress";
import { getPlayerResponses } from '@/actions/surveyActions';
import { getAllPlayers } from '@/lib/players'; // Updated import
import type { PlayerResponse } from '@/lib/players';
import { SiteHeader } from '@/components/site-header';
import { CheckCircle2, XCircle, Hourglass, MessageSquare, Users, ThumbsUp, ThumbsDown, Goal, PartyPopper, ShieldCheck } from 'lucide-react';
import CountdownTimer from '@/components/countdown-timer';

const TARGET_DATE_STRING = "2025-06-27T23:59:59";

export default async function ResultsPage() {
  const responses = await getPlayerResponses();
  const allPlayersList = await getAllPlayers(); // Fetch players dynamically
  const responsesArray = Object.values(responses).filter(r => r.surveyCompleted); // Only consider completed surveys for counts

  const totalPlayers = allPlayersList.length;
  const positiveResponsesCount = responsesArray.filter(r => r.continues).length;
  const negativeResponsesCount = responsesArray.filter(r => !r.continues).length;
  const respondedCount = positiveResponsesCount + negativeResponsesCount;
  const pendingResponsesCount = totalPlayers - respondedCount;

  const team1Target = 10;
  const team2Target = 20;

  const progressTeam1 = Math.min((positiveResponsesCount / team1Target) * 100, 100);
  const progressTeam2 = Math.min((positiveResponsesCount / team2Target) * 100, 100);

  let teamFormationMessage = "En route pour la première équipe ! ⚽";
  if (positiveResponsesCount >= team2Target) {
    teamFormationMessage = "Objectif 2 équipes atteint ! Prêts à tout donner ! 🔥🔥";
  } else if (positiveResponsesCount >= team1Target) {
    teamFormationMessage = "Super ! Une équipe au complet. Objectif 2ème équipe ! 💪";
  }

  const displayData = allPlayersList.map(player => {
    const response = responses[player.name];
    return {
      name: player.name,
      status: response?.surveyCompleted 
        ? (response.continues ? 'Continue' : 'Ne continue pas') 
        : 'En attente',
      continues: response?.continues,
      surveyCompleted: response?.surveyCompleted || false,
      motivationalMessage: response?.motivationalMessage,
      timestamp: response?.timestamp ? new Date(response.timestamp).toLocaleDateString('fr-FR') : '-',
    };
  });

  return (
    <>
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <section 
          className="relative w-full py-16 md:py-24 mb-8 rounded-lg shadow-lg"
        >
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary-foreground">
              Aperçu des Décisions de l'Équipe
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/80">
              Voici comment l'équipe se profile pour la prochaine saison.
            </p>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Joueurs</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline">{totalPlayers}</div>
              <p className="text-xs text-muted-foreground">membres dans l'effectif</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réponses "Oui"</CardTitle>
              <ThumbsUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline text-green-500">{positiveResponsesCount}</div>
              <p className="text-xs text-muted-foreground">prêts à chausser les crampons</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réponses "Non"</CardTitle>
              <ThumbsDown className="h-5 w-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline text-red-500">{negativeResponsesCount}</div>
              <p className="text-xs text-muted-foreground">feront une pause cette saison</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Hourglass className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-headline text-yellow-500">{pendingResponsesCount}</div>
              <p className="text-xs text-muted-foreground">réponses attendues</p>
            </CardContent>
          </Card>
        </section>

        <Card className="shadow-xl mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Goal className="h-8 w-8 text-primary" />
              <CardTitle className="font-headline text-3xl">Objectif Équipes !</CardTitle>
            </div>
            <CardDescription>{teamFormationMessage}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <h3 className="text-lg font-medium flex items-center">
                  <ShieldCheck className="h-5 w-5 mr-2 text-blue-500"/> Équipe 1 
                  {positiveResponsesCount >= team1Target && <PartyPopper className="h-5 w-5 ml-2 text-yellow-400"/>}
                </h3>
                <span className="text-sm font-semibold text-muted-foreground">{positiveResponsesCount} / {team1Target} joueurs</span>
              </div>
              <Progress value={progressTeam1} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-400" />
              {positiveResponsesCount < team1Target && <p className="text-xs text-muted-foreground mt-1">Encore {team1Target - positiveResponsesCount} joueur(s) pour former la première équipe.</p>}
            </div>
            {positiveResponsesCount >= team1Target && (
              <div>
                <div className="mb-2 flex justify-between items-center">
                  <h3 className="text-lg font-medium flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500"/>Équipe 2
                    {positiveResponsesCount >= team2Target && <PartyPopper className="h-5 w-5 ml-2 text-yellow-400"/>}
                  </h3>
                  <span className="text-sm font-semibold text-muted-foreground">{positiveResponsesCount} / {team2Target} joueurs</span>
                </div>
                <Progress value={progressTeam2} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-400" />
                {positiveResponsesCount < team2Target && <p className="text-xs text-muted-foreground mt-1">Encore {team2Target - positiveResponsesCount} joueur(s) pour la deuxième équipe.</p>}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Réponses Détaillées</CardTitle>
              <CardDescription>
                Aperçu des décisions des joueurs et messages de motivation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du Joueur</TableHead>
                      <TableHead>Décision</TableHead>
                      <TableHead>Date de Réponse</TableHead>
                      <TableHead>Message de Motivation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayData.map((playerData) => (
                      <TableRow key={playerData.name}>
                        <TableCell className="font-medium">{playerData.name}</TableCell>
                        <TableCell>
                          {!playerData.surveyCompleted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Hourglass className="w-4 h-4 mr-1.5" /> En attente
                            </span>
                          ) : playerData.continues ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Continue
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <XCircle className="w-4 h-4 mr-1.5" /> Ne continue pas
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{playerData.timestamp}</TableCell>
                        <TableCell className="max-w-xs">
                          {playerData.motivationalMessage ? (
                            <div className="flex items-start space-x-2" title={playerData.motivationalMessage}>
                              <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" /> 
                              <span className="italic text-sm text-muted-foreground truncate hover:text-wrap hover:overflow-visible">{playerData.motivationalMessage}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </div>
        </Card>
        <div className="mt-8 text-center">
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/">Retour à l'Accueil</Link>
          </Button>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Planifions ensemble pour une saison plus forte.
          </p>
          <CountdownTimer 
            targetDate={TARGET_DATE_STRING} 
            className="text-muted-foreground" 
            textClassName="text-sm"
            iconClassName="h-4 w-4"
          />
        </div>
      </footer>
    </>
  );
}
