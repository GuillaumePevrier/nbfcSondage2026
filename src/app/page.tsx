import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPlayerResponses } from '@/actions/surveyActions';
import { players, type Player } from '@/lib/players';
import { SiteHeader } from '@/components/site-header';
import { CheckCircle2, XCircle, Hourglass, Edit3 } from 'lucide-react';
import Image from 'next/image';

export default async function HomePage() {
  const responses = await getPlayerResponses();
  const allPlayers = players; 

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section 
          className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1920x1080.png')" }}
          data-ai-hint="futsal stadium lights"
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-primary-foreground">
                Avenir Futsal : Votre Avis Compte !
              </h1>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Aidez-nous à planifier la prochaine saison. Faites-nous savoir si vous continuez avec l'équipe.
              </p>
              <div className="space-x-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/survey">Participer au Sondage</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/results">Voir les Réponses</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Liste de l'Équipe & Statut du Sondage</CardTitle>
                <CardDescription>
                  Vérifiez qui a répondu au sondage. Cliquez sur le nom d'un joueur pour commencer ou voir son sondage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Nom du Joueur</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPlayers.map((player: Player) => {
                        const response = responses[player.name];
                        const hasResponded = response?.surveyCompleted;
                        const continues = response?.continues;
                        return (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>
                              {hasResponded ? (
                                continues ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Continue
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                    <XCircle className="w-4 h-4 mr-1.5" /> Ne continue pas
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                  <Hourglass className="w-4 h-4 mr-1.5" /> En attente
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/survey?playerName=${encodeURIComponent(player.name)}`}>
                                  <Edit3 className="w-4 h-4 mr-1.5" />
                                  {hasResponded ? 'Voir/Modifier' : 'Commencer'}
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Construit pour l'amour du Futsal. © {new Date().getFullYear()} NBFC Futsal Club
          </p>
        </div>
      </footer>
    </>
  );
}
