import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export default function AuthCard({ children, title, subtitle, className }: AuthCardProps) {
  return (
    <div className={cn("w-full max-w-md p-8 md:p-12 bg-black border border-white/10 rounded-[2.5rem] relative overflow-hidden group", className)}>
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 size-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors" />
      
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{title}</h2>
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">{subtitle}</p>
          <div className="w-12 h-1 bg-primary mx-auto mt-4" />
        </div>
        
        {children}
      </div>
    </div>
  );
}
