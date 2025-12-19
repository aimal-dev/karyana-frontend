import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
                K
              </div>
              <span className="text-2xl font-black tracking-tighter">
                KARYANA <span className="text-primary italic">STORE</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs font-medium uppercase tracking-wider">
              Delivering high-quality groceries and staples directly to your doorstep. Experience the future of grocery shopping.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                <Link key={idx} href="#" className="size-9 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all">
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="font-black text-[10px] mb-8 uppercase tracking-[0.2em]">USEFUL LINKS</h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-xs font-black tracking-widest uppercase">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-xs font-black tracking-widest uppercase">About Us</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors text-xs font-black tracking-widest uppercase">Shop</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-xs font-black tracking-widest uppercase">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-black text-[10px] mb-8 uppercase tracking-[0.2em]">CONTACT US</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-primary shrink-0" />
                <span className="text-muted-foreground text-[11px] font-black uppercase tracking-widest leading-relaxed">123 Market Street, Downtown, City 45678</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-primary shrink-0" />
                <span className="text-muted-foreground text-[11px] font-black uppercase tracking-widest">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-primary shrink-0" />
                <span className="text-muted-foreground text-[11px] font-black uppercase tracking-widest">hello@karyanastore.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-black text-[10px] mb-8 uppercase tracking-[0.2em]">NEWSLETTER</h3>
            <p className="text-muted-foreground text-[10px] mb-6 leading-relaxed font-black uppercase tracking-widest">
              Subscribe to get the latest updates and special offers.
            </p>
            <div className="flex gap-2">
              <Input placeholder="YOUR EMAIL" className="bg-muted/50 border-border text-[10px] font-black tracking-widest h-10 rounded-xl" />
              <Button size="icon" className="shrink-0 size-10 rounded-xl"><Mail className="size-4" /></Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-[9px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} KARYANA <span className="text-primary italic">STORE</span>. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-muted-foreground hover:text-primary text-[9px] font-black uppercase tracking-widest">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-primary text-[9px] font-black uppercase tracking-widest">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
