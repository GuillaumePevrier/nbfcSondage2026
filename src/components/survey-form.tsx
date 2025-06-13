
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
import { players, type SurveyFormData } from '@/lib/players';
import { getAIMotivationalMessageAction, finalizeSurveyAction } from '@/actions/surveyActions';
import { Dribbble, PlayCircle, ChevronLeft, ChevronRight, Send, Loader2, Smile, Frown } from 'lucide-react';

const formSchema = z.object({
  playerName: z.string().min(1, 'Player name is required.'),
  willContinue: z.enum(['yes', 'no'], { required_error: 'Please select an option.' }),
});

type FormValues = z.infer<typeof formSchema>;

const steps = [
  { id: 'welcome', title: 'Welcome!' },
  { id: 'decision', title: 'Your Plans?' },
  { id: 'motivation', title: 'A Little Boost!' },
  { id: 'complete', title: 'Thank You!' },
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

export function SurveyForm() {
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

  useEffect(()_ => {
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
        const playerName = form.getValues('playerName');
        const willContinue = form.getValues('willContinue') === 'yes';
        const message = await getAIMotivationalMessageAction(playerName, willContinue);
        setMotivationalMessage(message);
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        toast({ title: 'Error', description: 'Could not fetch motivational message.', variant: 'destructive' });
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
    if (!motivationalMessage) {
      toast({ title: 'Error', description: 'Motivational message not generated yet.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const surveyData: SurveyFormData = {
        playerName: data.playerName,
        willContinue: data.willContinue === 'yes',
      };
      const result = await finalizeSurveyAction(surveyData, motivationalMessage);

      if (result.success && result.data) {
        const emailParams = {
          to_name: 'Team Manager',
          from_name: data.playerName,
          player_name: data.playerName,
          decision: data.willContinue === 'yes' ? 'Continuing next season' : 'Not continuing next season',
          motivational_message: motivationalMessage,
          reply_to: 'no-reply@futsalfuture.com',
        };
        
        const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_EMAILJS_SERVICE_ID';
        const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_EMAILJS_TEMPLATE_ID';
        const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_EMAILJS_PUBLIC_KEY';

        if (EMAILJS_SERVICE_ID === 'YOUR_EMAILJS_SERVICE_ID' || EMAILJS_TEMPLATE_ID === 'YOUR_EMAILJS_TEMPLATE_ID' || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
           console.warn("EmailJS not configured. Please set NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY in your .env.local file.");
           toast({ title: 'Survey Submitted (Email Skipped)', description: 'Response saved. EmailJS not configured.' });
        } else {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams, EMAILJS_PUBLIC_KEY);
            toast({ title: 'Survey Submitted!', description: 'Your response has been recorded and an email sent.' });
        }
        
        setCurrentStep((prev) => prev + 1);
      } else {
        toast({ title: 'Submission Failed', description: result.error || 'Could not save your response.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast({ title: 'Submission Error', description: 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const currentStepDetails = useMemo(() => steps[currentStep], [currentStep]);

  return (
    <Card className="w-full shadow-2xl bg-card/90 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Dribbble className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-4xl">{currentStepDetails.title}</CardTitle>
        {currentStep === 0 && <CardDescription className="text-lg">Help us plan for an amazing next season!</CardDescription>}
      </CardHeader>
      <CardContent className="min-h-[300px] flex items-center justify-center overflow-hidden p-6">
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
                      Your input is crucial for our team's success. This quick survey will help us understand your availability for the upcoming Futsal season.
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
                        <FormLabel className="text-lg font-medium">Player Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="text-base">
                              <SelectValue placeholder="Select your name" />
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
                        <FormLabel className="text-lg font-medium">Are you with us for the next season?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal text-base flex items-center"><Smile className="mr-2 h-5 w-5 text-green-500"/>Yes, I'm in!</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal text-base flex items-center"><Frown className="mr-2 h-5 w-5 text-red-500"/>No, I'm out this time.</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>  
                )}

                {currentStep === 2 && motivationalMessage && ( 
                  <div className="text-center space-y-6 p-4 border border-primary rounded-lg bg-primary/10">
                    <p className="text-xl font-semibold text-primary-foreground bg-primary p-3 rounded-md shadow-md">{motivationalMessage}</p>
                    <p className="text-muted-foreground">Ready to make it official?</p>
                  </div>
                )}

                {currentStep === 3 && ( 
                   <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold font-headline text-primary">Survey Complete!</h2>
                    <p className="text-xl">Thank you for your time and valuable input. We've recorded your response.</p>
                    <Button onClick={() => router.push('/results')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      See Team Responses
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
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {currentStep === 0 && (
           <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Let's Go! <PlayCircle className="ml-2 h-5 w-5" />
          </Button>
        )}
        {currentStep === 1 && (
          <Button onClick={handleNext} disabled={isLoading} className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ChevronRight className="mr-2 h-4 w-4" />}
            Next
          </Button>
        )}
        {currentStep === 2 && (
          <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit & Finish
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
