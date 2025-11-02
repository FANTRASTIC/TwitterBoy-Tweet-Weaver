import { Feather } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2" aria-label="Tweet Weaver">
      <div className="p-1.5 bg-primary/20 rounded-lg">
        <Feather className="h-5 w-5 text-primary" />
      </div>
      <h1 className="font-headline text-xl font-bold text-foreground">
        Tweet Weaver
      </h1>
    </div>
  );
}
