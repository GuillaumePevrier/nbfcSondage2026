import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPlayerResponses } from '@/actions/surveyActions';
import { players as allPlayersList, type PlayerResponse } from '@/lib/players';
import { SiteHeader } from '@/components/site-header';
import { CheckCircle2, XCircle, Hourglass, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default async function ResultsPage() {
  const responses = await getPlayerResponses();

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
          className="relative w-full py-16 md:py-24 bg-cover bg-center mb-8 rounded-lg shadow-lg"
          style={{ backgroundImage: "url('https://placehold.co/1200x400.png')" }}
          data-ai-hint="futsal tactics board"
        >
          <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary-foreground">
              Aperçu des Décisions de l'Équipe
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/80">
              Voici comment l'équipe se profile pour la prochaine saison.
            </p>
          </div>
        </section>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Réponses au Sondage</CardTitle>
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
        </div>
      </footer>
    </>
  );
}
