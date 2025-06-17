import SurveyForm from '@/components/survey/survey-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SurveyPage() {
  return (
    <div className="container mx-auto py-10">
       <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">Sondage de Participation</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Votre avis est important pour la saison prochaine !
          </CardDescription>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <SurveyForm />
        </CardContent>
      </Card>
    </div>
  );
}
