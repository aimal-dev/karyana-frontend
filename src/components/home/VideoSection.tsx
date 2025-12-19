import { Play } from "lucide-react";
import Image from "next/image";

export default function VideoSection() {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-border group cursor-pointer shadow-2xl">
          <Image 
            src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=2000&auto=format&fit=crop" 
            alt="Farming Video" 
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative">
                <div className="absolute -inset-10 bg-primary/30 rounded-full blur-[40px] animate-pulse"></div>
                <button className="relative size-20 md:size-28 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg shadow-primary/20">
                   <Play className="size-8 md:size-12 fill-current ml-1.5" />
                </button>
             </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black via-black/40 to-transparent">
             <div className="space-y-2 max-w-2xl">
                <h4 className="text-primary font-black tracking-[0.4em] uppercase text-[10px] font-subheading">ORGANIC FARMING</h4>
                <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight uppercase">
                  HOW WE GROW & HARVEST YOUR <span className="text-primary italic">FAVORITE VEGETABLES</span>
                </h3>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
