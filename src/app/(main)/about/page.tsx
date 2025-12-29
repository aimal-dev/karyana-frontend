import Link from "next/link";
import { Store, Code, Users, Award, Heart, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      {/* Hero Header */}
      <div className="relative py-24 overflow-hidden border-b border-border bg-accent/20">
        <div className="container mx-auto px-4 lg:px-20 relative z-10 space-y-4 text-center">
           <p className="text-primary font-medium tracking-[0.4em] uppercase text-[14px] font-subheading">Our Legacy</p>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase font-subheading-main">REDEFINING <span className="text-primary font-subheading-main">GROCERY SHOPPING</span></h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20 py-24 space-y-32">
        {/* About Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <div className="space-y-3">
                 <h2 className="text-primary font-medium tracking-[0.3em] uppercase text-[14px] font-subheading">Who We Are</h2>
                 <h3 className="text-4xl font-black tracking-tighter leading-none uppercase font-subheading-main">THE KARYANA <span className="text-primary font-subheading-main">DIFFERENCE</span></h3>
              </div>
              <div className="space-y-6 text-muted-foreground font-medium uppercase tracking-wide leading-relaxed">
                <p>
                  At Karyana Store, we believe that premium quality shouldn&apos;t be a luxury—it should be a standard. Founded with a vision to revolutionize the local market, we bring you the freshest produce and finest household essentials directly to your doorstep.
                </p>
                <p>
                  We are more than just a store; we are a community-driven platform committed to transparency, quality, and exceptional service. Every product on our shelves is handpicked to ensure it meets our rigorous standards of excellence.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                 {[
                    { icon: Award, label: "Premium Quality" },
                    { icon: CheckCircle2, label: "Fresh Guaranteed" },
                    { icon: Heart, label: "Customer First" },
                    { icon: Users, label: "Community Focused" }
                 ].map((Item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card/50">
                       <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Item.icon className="size-5" />
                       </div>
                       <span className="font-bold text-xs uppercase tracking-wider">{Item.label}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative">
              <div className="aspect-square rounded-[2.5rem] border border-border bg-muted/30 overflow-hidden relative group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 {/* Placeholder for About Image - could be a shop photo */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 font-black tracking-widest uppercase gap-4">
                    <Store className="size-24" />
                    <span>Store Interior View</span>
                 </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 size-40 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 size-40 bg-primary/5 rounded-full blur-3xl -z-10" />
           </div>
        </div>

        {/* Visionaries Section */}
        <div className="space-y-20">
           <div className="text-center space-y-4 max-w-3xl mx-auto">
              <p className="text-primary font-medium tracking-[0.4em] uppercase text-[14px] font-subheading">Leadership</p>
              <h2 className="text-4xl font-black tracking-tighter leading-none uppercase font-subheading-main">MEET THE <span className="text-primary font-subheading-main">VISIONARIES</span></h2>
              <p className="text-muted-foreground font-medium uppercase tracking-wide leading-relaxed pt-4">
                 The minds behind the platform, dedicated to bringing you the best shopping experience possible.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Owner Card */}
              <div className="group bg-card border border-border rounded-[2rem] p-8 space-y-6 hover:shadow-2xl hover:border-primary/30 transition-all text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] transition-all group-hover:bg-primary/10" />
                 
                 <div className="relative mx-auto size-32 rounded-full border-2 border-primary/20 p-1 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                       <Users className="size-12 text-muted-foreground" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Arsalan</h3>
                    <p className="text-primary font-bold text-xs tracking-[0.3em] uppercase">Store Owner</p>
                 </div>
                 
                 <p className="text-muted-foreground text-xs leading-relaxed font-medium uppercase tracking-wider mx-auto max-w-sm">
                    &quot;This store is my promise to the community. I wanted a platform that reflects the quality of our products, and this digital space allows us to serve you better.&quot;
                 </p>
              </div>

              {/* Developer Card */}
              <div className="group bg-card border border-border rounded-[2rem] p-8 space-y-6 hover:shadow-2xl hover:border-primary/30 transition-all text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] transition-all group-hover:bg-primary/10" />
                 
                 <div className="relative mx-auto size-32 rounded-full border-2 border-primary/20 p-1 group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-full bg-muted flex items-center justify-center overflow-hidden">
                       <Code className="size-12 text-muted-foreground" />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter">Muhammad Aimal</h3>
                    <p className="text-primary font-bold text-xs tracking-[0.3em] uppercase">Lead Developer</p>
                 </div>
                 
                 <p className="text-muted-foreground text-xs leading-relaxed font-medium uppercase tracking-wider mx-auto max-w-sm">
                    &quot;Developed with precision and care. My goal was to bring Arsalan&apos;s vision to life through a robust, high-performance, and user-friendly online store.&quot;
                 </p>
              </div>
           </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-[2.5rem] bg-accent/10 border border-border p-12 text-center space-y-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-white/5 opacity-20" />
           <div className="relative z-10 space-y-6">
              <h2 className="text-4xl lg:text-5xl font-medium capitalize tracking-tighter">Ready to Experience the Difference?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <Link href="/shop">
                    <Button className="h-14 px-8 text-xs font-black tracking-[0.2em] rounded-xl uppercase">
                       Start Shopping
                    </Button>
                 </Link>
                 <Link href="/contact">
                    <Button variant="outline" className="h-14 px-8 text-xs font-black tracking-[0.2em] rounded-xl uppercase hover:bg-background">
                       Contact Us
                    </Button>
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
