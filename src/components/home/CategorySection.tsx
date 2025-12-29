import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Category {
  id: number;
  name: string;
  image: string | null;
}

export default function CategorySection({ limit = 10 }: { limit?: number }) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/category/all");
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-primary font-semibold font-black tracking-[0.2em] uppercase text-[15px] letter-spacing-[0.5em] font-subheading">Categories</h2>
            <h3 className="font-subheading-main text-5xl font-black tracking-tighter uppercase">POPULAR <span className="font-subheading-main">CATEGORIES</span></h3>
          </div>
          <Link href="/shop" className="group flex items-center gap-3 font-black text-[10px] tracking-[0.2em] hover:text-primary transition-colors pb-2">
            VIEW ALL <MoveRight className="size-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.slice(0, limit).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/shop?category=${cat.name}`} 
              className={`group relative block h-52 rounded-2xl overflow-hidden shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-border`}
            >
              <Image 
                src={cat.image || "/placeholder.png"} 
                alt={cat.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="space-y-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <h4 className="text-lg font-medium font-black text-white leading-tight font-subheading uppercase">{cat.name}</h4>
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
