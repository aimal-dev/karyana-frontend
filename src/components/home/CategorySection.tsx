import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const categories = [
  {
    title: "Fresh Produce",
    desc: "Directly from the farm to your table.",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=600&auto=format&fit=crop",
    link: "/shop?category=fresh",
  },
  {
    title: "Dairy & Eggs",
    desc: "Farm fresh milk, cheese, and eggs.",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=600&auto=format&fit=crop",
    link: "/shop?category=dairy",
  },
  {
    title: "Staples & Pantry",
    desc: "Essential grains, flours, and pulses.",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop",
    link: "/shop?category=staples",
  },
  {
    title: "Household Care",
    desc: "Everything you need for a clean home.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600&auto=format&fit=crop",
    link: "/shop?category=household",
  },
  {
    title: "Snacks & Munchies",
    desc: "Delicious snacks for every occasion.",
    image: "https://images.unsplash.com/photo-1599490659273-1b519d7428e7?q=80&w=600&auto=format&fit=crop",
    link: "/shop?category=snacks",
  }
];

export default function CategorySection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-primary font-black tracking-[0.2em] uppercase text-[10px] font-subheading">Categories</h2>
            <h3 className="text-3xl font-black tracking-tighter uppercase">POPULAR <span className="text-primary italic">CATEGORIES</span></h3>
          </div>
          <Link href="/shop" className="group flex items-center gap-3 font-black text-[10px] tracking-[0.2em] hover:text-primary transition-colors pb-2">
            VIEW ALL <MoveRight className="size-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, i) => (
            <Link 
              key={i} 
              href={cat.link} 
              className={`group relative block h-52 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-border`}
            >
              <Image src={cat.image} alt={cat.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-lg font-black text-white leading-tight font-subheading uppercase">{cat.title}</h4>
                  <p className="text-white/80 text-[8px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">Explore</p>
                  <div className="w-8 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 size-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                 <MoveRight className="size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
