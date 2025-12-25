"use client"

import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useState, useEffect } from "react";
import Honey from '../../../public/honey.svg'

export default function DealSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Mock target date: 5 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-accent/20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group flex justify-center">
             <div className="relative aspect-square w-full max-w-md">
                <Image 
                  src={Honey} 
                  alt="Deal Product" 
                  fill
                  className="object-contain"
                />
             </div>
          </div>

          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-primary font-medium font-black tracking-[0.2em] uppercase text-[16px] flex items-center gap-2 justify-center lg:justify-start">
                 <span className="w-8 h-px bg-primary" /> Todays Hot Deals
              </h2>
              <h3 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight uppercase font-subheading-main">
                ORIGINAL STOCK<br />
                <span className="text-primary font-subheading-main italic">HONEY COMBO PACKAGE</span>
              </h3>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              {[
                { label: "DAYS", value: timeLeft.days },
                { label: "HRS", value: timeLeft.hours },
                { label: "MINS", value: timeLeft.minutes },
                { label: "SECS", value: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center size-20 rounded-full bg-background border border-border shadow-sm">
                  <span className="text-2xl font-black leading-none tabular-nums">{item.value < 10 ? `0${item.value}` : item.value}</span>
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mt-1">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button size="lg" className="h-12 px-10 gap-3 group font-black text-xs tracking-[0.2em] rounded-full">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
