import DashboardContent from '@/components/dashboard/dashboard-content';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">Tableau de Bord des Réponses</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Suivez en temps réel la participation pour la saison prochaine.
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <DashboardContent />
        </CardContent>
      </Card>
    </div>
  );
}
