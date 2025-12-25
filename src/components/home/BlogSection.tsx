import { ChevronRight, Calendar, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const blogs = [
  {
    title: "Eco-friendly farming and solutions",
    excerpt: "Discover the latest methods in sustainable agriculture and how they benefit our community.",
    date: "Dec 15, 2025",
    author: "Admin",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "How and when to plant healthy veggies",
    excerpt: "A complete guide for beginners on starting their own organic vegetable garden at home.",
    date: "Dec 10, 2025",
    author: "Expert",
    image: "https://images.unsplash.com/photo-1595183427303-317498c47101?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "10 Benefits of organic honey for health",
    excerpt: "Learn why swapping processed sugar for pure organic honey is a game changer for your well-being.",
    date: "Dec 05, 2025",
    author: "Nutrionist",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=600&auto=format&fit=crop"
  }
];

export default function BlogSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-2 font-subheading">
          <h2 className="text-primary font-black font-medium letter-spacing-[0.5em] tracking-[0.2em] uppercase text-[14px] font-subheading">News & Articles</h2>
          <h3 className="text-5xl font-black tracking-tighter uppercase font-subheading-main">LATEST <span className="text-primary font-subheading-main">FROM BLOG</span></h3>
          <div className="w-10 h-1 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <div key={i} className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-500">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={blog.image} alt={blog.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-black text-[8px] px-3 py-1 rounded-full uppercase tracking-widest">
                  ARTICLE
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Calendar className="size-3 text-primary" /> {blog.date}</span>
                  <span className="flex items-center gap-1.5"><User className="size-3 text-primary" /> BY {blog.author}</span>
                </div>

                <h4 className="text-xl font-medium font-black leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase font-subheading tracking-tight">
                  {blog.title}
                </h4>

                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed font-medium">
                  {blog.excerpt}
                </p>

                <Link href="#" className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group/link pt-2">
                  Read More <ChevronRight className="size-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
