import Link from "next/link";
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-20">
      {/* Hero Header */}
      <div className="relative py-24 overflow-hidden border-b border-border bg-accent/20">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 space-y-4 text-center">
           <p className="text-primary font-medium tracking-[0.4em] uppercase text-[14px] font-subheading">Get In Touch</p>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase font-subheading-main">CONNECT WITH <span className="text-primary font-subheading-main">OUR CORE</span></h1>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-32">
          {/* Card 1: Map/Address */}
          <div className="group bg-card border border-border rounded-3xl p-10 space-y-6 hover:shadow-xl hover:border-primary/30 transition-all text-center">
             <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                <MapPin className="size-8" />
             </div>
             <div className="space-y-3">
                <h3 className="font-bold text-lg uppercase tracking-tight font-subheading">Location</h3>
                <p className="text-muted-foreground font-medium text-xs leading-relaxed uppercase tracking-wider">
                   123 Karyana Avenue, Tech District<br />Building 7-B, Metropolis
                </p>
             </div>
          </div>

          {/* Card 2: Phone */}
          <div className="group bg-card border border-border rounded-3xl p-10 space-y-6 hover:shadow-xl hover:border-primary/30 transition-all text-center">
             <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                <Phone className="size-8" />
             </div>
             <div className="space-y-3">
                <h3 className="font-bold text-lg uppercase tracking-tight font-subheading">Call Us</h3>
                <p className="text-muted-foreground font-medium text-xs leading-relaxed uppercase tracking-wider">
                   Support: +1 (234) 567 890<br />Inquiries: +1 (987) 654 321
                </p>
             </div>
          </div>

          {/* Card 3: Email */}
          <div className="group bg-card border border-border rounded-3xl p-10 space-y-6 hover:shadow-xl hover:border-primary/30 transition-all text-center">
             <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                <Mail className="size-8" />
             </div>
             <div className="space-y-3">
                <h3 className="font-bold text-lg uppercase tracking-tight font-subheading">Email</h3>
                <p className="text-muted-foreground font-medium text-xs leading-relaxed uppercase tracking-wider">
                   hello@karyanastore.com<br />partners@karyana.io
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <div className="space-y-3">
                 <h2 className="text-primary font-medium tracking-[0.3em] uppercase text-[14px] font-subheading">Send a Message</h2>
                 <h3 className="text-4xl font-black tracking-tighter leading-none uppercase font-subheading-main">DO YOU HAVE ANY <span className="text-primary font-subheading-main">QUESTIONS?</span></h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-lg uppercase tracking-wide">
                 Whether you have a question about our products, orders, or partner opportunities, our team is ready to respond within 24 hours.
              </p>
              
              <div className="flex gap-4 pt-4">
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <Link key={i} href="#" className="size-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all group">
                    <Icon className="size-5 group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
           </div>

           <div className="bg-card border border-border rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl shadow-primary/5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
              
              <form className="relative z-10 space-y-5">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input placeholder="FULL NAME" className="h-12 bg-muted/30 border-border rounded-xl px-5 text-[10px] font-black tracking-widest" />
                    <Input type="email" placeholder="EMAIL ADDRESS" className="h-12 bg-muted/30 border-border rounded-xl px-5 text-[10px] font-black tracking-widest" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input placeholder="PHONE (OPTIONAL)" className="h-12 bg-muted/30 border-border rounded-xl px-5 text-[10px] font-black tracking-widest" />
                    <Input placeholder="SUBJECT" className="h-12 bg-muted/30 border-border rounded-xl px-5 text-[10px] font-black tracking-widest" />
                 </div>
                 <textarea 
                   placeholder="YOUR MESSAGE..." 
                   className="w-full h-36 bg-muted/30 border border-border rounded-xl px-5 py-5 text-[10px] font-black tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                 />
                 <Button className="w-full h-14 text-[10px] font-black tracking-[0.3em] rounded-xl gap-3 group uppercase">
                   SEND MESSAGE <Send className="size-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </form>
           </div>
        </div>
      </div>

      {/* Embedded Map Placeholder */}
      <div className="w-full h-[400px] mt-24 border-y border-border opacity-60 bg-muted/20 flex flex-col items-center justify-center text-muted-foreground font-black tracking-[0.2em] uppercase text-[10px] gap-4">
         <MapPin className="size-8 text-primary/50" />
         Interactive Map Interface [Requires API Key]
      </div>
    </div>
  );
}
