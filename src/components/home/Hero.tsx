"use client"

import { Button } from "@/components/ui/Button";
import { MoveRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden selection:bg-primary/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-primary/5 -skew-x-12 translate-x-32 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0%,transparent_70%)] z-0" />
      
      {/* Ticker Bar */}
      <div className="absolute top-0 left-0 w-full bg-primary py-3 overflow-hidden whitespace-nowrap z-30 shadow-xl border-b border-white/10">
         <div className="flex animate-marquee gap-12 items-center">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="text-[11px] font-black uppercase tracking-[0.4em] text-primary-foreground flex items-center gap-6">
                 <span className="size-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                 FRESH GROCERIES • ORGANIC PRODUCE • FAST DELIVERY • PREMIUM QUALITY • DAILY DEALS
              </span>
            ))}
         </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-20 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Text Content */}
          <div className="space-y-12 order-2 lg:order-1">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-black tracking-[0.4em] uppercase shadow-sm">
                <span className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                ESTABLISHED 2024 • PREMIUM GRADE
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-[100px] leading-[0.85] tracking-tighter uppercase">
                THE FUTURE <br />
                <span className="text-primary italic relative inline-block">
                  OF FRESH
                  <span className="absolute -bottom-4 left-0 w-full h-3 bg-primary/10 -skew-x-12" />
                </span> <br />
                IS HERE
              </h1>

              <p className="text-muted-foreground text-sm md:text-base max-w-lg leading-relaxed font-black uppercase tracking-[0.15em] opacity-70">
                Experience surgical precision in grocery delivery. Artfully selected, farm-fresh produce delivered directly to your modern lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/shop">
                <Button size="lg" className="h-16 px-12 gap-4 group font-black text-[11px] tracking-[0.4em] rounded-2xl shadow-2xl shadow-primary/30 uppercase transition-all hover:scale-105 active:scale-95">
                  START SHOPPING <MoveRight className="size-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="h-16 px-12 border-border font-black text-[11px] tracking-[0.4em] rounded-2xl uppercase hover:bg-muted/50 transition-all border-2">
                  OUR STORY
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex gap-16 pt-12 border-t border-border/50">
               {[
                 { label: "Satisfied Users", val: "40K+" },
                 { label: "Premium Items", val: "1.5K+" },
                 { label: "Dispatch Points", val: "220+" }
               ].map((s, i) => (
                 <div key={i} className="space-y-2">
                    <p className="text-3xl font-black tracking-tighter font-subheading leading-none">{s.val}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 leading-none">{s.label}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* 3D Visual Area */}
          <div className="relative order-1 lg:order-2 perspective-[2500px]">
            <div className="relative transform-gpu rotate-y-[-20deg] rotate-x-[15deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] group">
              {/* Main Image Holder */}
              <div className="relative aspect-[4/5] md:aspect-square rounded-[3.5rem] overflow-hidden border-[15px] border-card shadow-[40px_40px_100px_rgba(0,0,0,0.2)] dark:shadow-[40px_40px_100px_rgba(0,0,0,0.5)] bg-muted group-hover:shadow-[0px_30px_80px_rgba(34,197,94,0.15)] transition-all">
                 <Image 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop" 
                    alt="Fresh Groceries" 
                    fill 
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms] ease-out"
                    priority
                 />
                 <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-white/10 opacity-60" />
                 
                 {/* Internal Glassmorphism Label */}
                 <div className="absolute bottom-10 left-10 right-10 p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-white space-y-2 translate-y-20 group-hover:translate-y-0 transition-transform duration-700 opacity-0 group-hover:opacity-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground">Season Special</p>
                    <h4 className="text-2xl font-black tracking-tighter uppercase font-subheading">Winter Harvest Collection</h4>
                 </div>
              </div>

              {/* Floating Widgets */}
              <div className="absolute -top-12 -right-12 p-8 rounded-[2.5rem] bg-background border-4 border-primary/20 shadow-3xl space-y-3 transform translate-z-50 animate-bounce-slow hover:scale-110 transition-transform cursor-pointer">
                 <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                       <span className="text-white text-2xl">⚡</span>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-none">Flash Deal</p>
                       <h5 className="font-black text-lg uppercase font-subheading leading-none mt-1">SAVE 40%</h5>
                    </div>
                 </div>
              </div>

              <div className="absolute -bottom-16 -left-16 p-10 rounded-[3rem] bg-card/95 backdrop-blur-2xl border-2 border-border shadow-3xl space-y-6 transform hover:scale-105 transition-transform duration-700 max-w-[240px]">
                 <div className="flex -space-x-4 mb-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="size-10 rounded-full border-4 border-card overflow-hidden bg-muted transition-transform hover:-translate-y-2">
                        <Image src={`https://i.pravatar.cc/100?img=${i+20}`} alt="user" width={40} height={40} />
                      </div>
                    ))}
                    <div className="size-10 rounded-full border-4 border-card bg-primary flex items-center justify-center text-[11px] font-black text-white">
                      +12k
                    </div>
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-[0.1em] leading-relaxed text-muted-foreground">
                   JOIN <span className="text-primary">12,000+ PREMIUM</span> MEMBERS WHO ENJOY DAILY FARM-TO-DOOR FRESHNESS.
                 </p>
              </div>

              {/* Orbital Glow */}
              <div className="absolute -z-10 -top-20 -left-20 size-[500px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
              <div className="absolute -z-10 -bottom-20 -right-20 size-[500px] bg-primary/5 rounded-full blur-[150px]" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
