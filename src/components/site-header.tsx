import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dribbble } from 'lucide-react'; // Using Dribbble as a Futsal/Soccer ball icon

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Dribbble className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block text-lg">
            Futsal Future Survey
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/survey">Start Survey</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/results">View Results</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
