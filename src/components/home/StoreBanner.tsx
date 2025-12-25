"use client"

import { Button } from "@/components/ui/Button";
import { MoveRight, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import BannerImage from "../../../public/banner-bg.png"
import circle from "../../../public/circle.png"

export default function StoreBanner() {
  return (
    <section className={`relative w-full overflow-hidden bg-cover bg-center`} style={{ backgroundImage: `url(${BannerImage.src})` }}>
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary-dark border border-primary/20">
               <ShoppingBasket className="size-5 text-primary" />
               <span className="text-md font-subheading font-medium">100% Genuine Products</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] font-subheading-main">
              Fresh Groceries, <br />
              Delivered <br />
              to Your Doorstep <span className="inline-block animate-bounce-slow">🚚</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-lg font-medium max-w-xl border-l-4 border-primary/30 pl-6">
              Enjoy hassle-free online grocery shopping with fast delivery and the best quality products.
            </p>

            <div className="pt-4">
              <Link href="/shop">
                <Button size="lg" className="h-12 px-8 gap-3 group bg-[#80B500] hover:bg-[#65a30d] text-md text-white font-bold rounded-xl shadow-lg shadow-lime-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider">
                  EXPLORE PRODUCTS <MoveRight className="size-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side Visual Element */}
          <div className="hidden lg:flex justify-center items-center relative">
             <div className="size-[500px] rounded-full bg-white/30 backdrop-blur-sm border border-white/40 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="size-[400px] rounded-full border-4 border-dashed border-primary/20 animate-spin-slow" />
                </div>
                {/* Floating Elements inside the circle could go here */}
                <Image 
                  src={circle} 
                  alt="Grocery Store Background" 
                  fill 
                  className=""
                  priority
                />
             </div>
             
             {/* Orbital Glow */}
             <div className="absolute -z-10 size-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Bottom Ticker Bar */}
      <div className="w-full bg-[#80B500] py-3 overflow-hidden whitespace-nowrap z-20">
         <div className="flex animate-marquee-slow gap-10 items-center">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-10 text-sm font-bold text-white uppercase tracking-wide">
                 <span>Find Everything You Need, Fresh & Fast</span>
                 <span className="opacity-50">|</span>
                 <span className="flex items-center gap-2">fresh Groceries 🥗</span>
                 <span className="opacity-50">|</span>
                 <span className="flex items-center gap-2">Daily Needs 🔔</span>
                 <span className="opacity-50">|</span>
                 <span className="flex items-center gap-2">Pantry Essentials 🏥</span>
                 <span className="opacity-50">|</span>
                 <span className="flex items-center gap-2">Healthy Living 🥗</span>
                 <span className="opacity-50">|</span>
                 <span className="flex items-center gap-2">Quick Delivery 🚚</span>
                 <span className="opacity-50">|</span>
              </div>
            ))}
         </div>
      </div>


    </section>
  );
}
