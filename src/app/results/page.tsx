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
        ? (response.continues ? 'Continuing' : 'Not Continuing') 
        : 'Pending',
      continues: response?.continues,
      surveyCompleted: response?.surveyCompleted || false,
      motivationalMessage: response?.motivationalMessage,
      timestamp: response?.timestamp ? new Date(response.timestamp).toLocaleDateString() : '-',
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
              Team Decisions Overview
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/80">
              Here's how the team is shaping up for the next season.
            </p>
          </div>
        </section>
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Survey Responses</CardTitle>
            <CardDescription>
              Overview of player decisions and motivational messages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player Name</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Date Responded</TableHead>
                    <TableHead>Motivational Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayData.map((playerData) => (
                    <TableRow key={playerData.name}>
                      <TableCell className="font-medium">{playerData.name}</TableCell>
                      <TableCell>
                        {!playerData.surveyCompleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Hourglass className="w-4 h-4 mr-1.5" /> Pending
                          </span>
                        ) : playerData.continues ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Continuing
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-4 h-4 mr-1.5" /> Not Continuing
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{playerData.timestamp}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {playerData.motivationalMessage ? (
                          <div className="flex items-center" title={playerData.motivationalMessage}>
                            <MessageSquare className="w-4 h-4 mr-1.5 text-muted-foreground flex-shrink-0" /> 
                            <span className="italic text-sm text-muted-foreground">"{playerData.motivationalMessage}"</span>
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
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Planning together for a stronger season.
          </p>
        </div>
      </footer>
    </>
  );
}
