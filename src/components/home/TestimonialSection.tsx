import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Regular Customer",
    content: "The quality of the fresh produce is unmatched. I've been ordering for months and the delivery is always on time. Highly recommended!",
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  {
    name: "Sarah Miller",
    role: "Organic Foodie",
    content: "I love the variety of staples and the organic honey package. It's so convenient to get everything I need in one place with a premium feel.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 space-y-2 font-subheading">
          <h2 className="text-primary font-black font-medium letter-spacing-[0.5em] tracking-[0.2em] uppercase text-[14px] font-subheading">Testimonials</h2>
          <h3 className="text-5xl font-black tracking-tighter uppercase font-subheading-main">CLIENTS <span className="text-primary font-subheading-main">FEEDBACKS</span></h3>
          <div className="w-10 h-1 bg-primary mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {testimonials.map((item, i) => (
            <div key={i} className="bg-card border border-border p-8 rounded-3xl relative overflow-hidden group shadow-sm transition-all hover:shadow-xl hover:border-primary/20">
              <div className="relative z-10 space-y-6">
                <p className="text-sm md:text-lg text-muted-foreground font-medium leading-relaxed italic pr-12 font-body">
                  &ldquo;{item.content}&rdquo;
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <div className="size-14 rounded-full border-2 border-primary/20 overflow-hidden relative">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-lg font-medium tracking-tight">{item.name}</h4>
                    <p className="text-primary font-black text-[11px] uppercase tracking-widest">{item.role}</p>
                  </div>
                  <Quote className="size-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
