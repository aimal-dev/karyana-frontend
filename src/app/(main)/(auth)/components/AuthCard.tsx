import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export default function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-md p-8 md:p-12 bg-card/80 backdrop-blur-xl border border-border rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-primary/5", className)}>
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/15 transition-all duration-700" />
      <div className="absolute -bottom-24 -left-24 size-48 bg-primary/5 rounded-full blur-[100px]" />
      
      {/* Content */}
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-medium tracking-tighter uppercase font-subheading-main bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">{title}</h2>
          <p className="text-muted-foreground text-[10px] font-medium tracking-[0.2em] uppercase font-subheading">{subtitle}</p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto mt-4 rounded-full" />
        </div>
        
        {children}
      </div>
    </div>
  );
}
