import Link from "next/link";
import Image from "next/image";

const mainCategories = [
  {
    title: "Fresh Produce",
    subtitle: "Fruits, Vegetables, and Organic Farm-Fresh Items.",
    color: "bg-[#f5ffde]",
    textColor: "text-gray-900",
    link: "/shop?category=fresh-produce",
    image: "/Frame-1.svg",
    imageAlt: "Fresh Produce Collection"
  },
  {
    title: "Dairy & Eggs",
    subtitle: "Milk, Cheese, Yogurt, Butter, and Fresh Eggs.",
    color: "bg-[#ffe8cb]",
    textColor: "text-gray-900",
    link: "/shop?category=dairy-eggs",
    image: "/Frame-2.svg",
    imageAlt: "Dairy and Eggs Collection"
  }
];

const subCategories = [
  {
    title: "Staples & Essentials",
    subtitle: "Rice, Flour, Pulses, Spices, and Cooking Oils.",
    color: "bg-[#FFF2D1]",
    textColor: "text-gray-900",
    link: "/shop?category=staples",
    image: "/Frame-3.svg",
    imageAlt: "Staples and Essentials"
  },
  {
    title: "Snacks & Beverages",
    subtitle: "Chips, Biscuits, Soft Drinks, Juices, and Tea/Coffee.",
    color: "bg-[#f0f2ff]",
    textColor: "text-gray-900",
    link: "/shop?category=snacks-beverages",
    image: "/Frame-4.svg",
    imageAlt: "Snacks and Beverages"
  },
  {
    title: "Household & Personal Care",
    subtitle: "Cleaning Supplies & Hygiene Products.",
    color: "bg-[#ffffff]",
    textColor: "text-gray-900",
    link: "/shop?category=household",
    image: "/image.svg", // Using provided generic image for 5th category if designated frame not strictly named Frame-5
    imageAlt: "Household Items"
  }
];


export default function CategoryGrid() {
  return (
    <section className="py-12 bg-[#fdfaf5]">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Row: 2 Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {mainCategories.map((cat, i) => (
            <div 
              key={i} 
              className={`${cat.color} rounded-[2rem] p-8 md:p-12 min-h-[320px] lg:min-h-[400px] flex flex-col justify-center relative overflow-hidden group border border-black/5 shadow-sm hover:shadow-md transition-shadow bg-no-repeat bg-cover bg-right-bottom`}
              style={{
                backgroundImage: `url(${cat.image})`
              }}
            >
              <div className="max-w-[280px] z-10 relative">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight">
                  {cat.title}
                </h3>
                <p className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
                  {cat.subtitle}
                </p>
                <Link 
                  href={cat.link} 
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-primary hover:border-primary transition-all"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row: 3 Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subCategories.map((cat, i) => (
            <div 
              key={i} 
              className={`${cat.color} rounded-[2rem] p-8 flex flex-col relative overflow-hidden min-h-[350px] group border border-black/5 shadow-sm hover:shadow-md transition-shadow bg-no-repeat bg-cover bg-bottom`}
              style={{
                backgroundImage: `url(${cat.image})`
              }}
            >
              <div className="z-10 relative">
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-3 leading-tight max-w-[180px]">
                  {cat.title}
                </h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-6 max-w-[200px]">
                  {cat.subtitle}
                </p>
                <Link 
                  href={cat.link} 
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-primary hover:border-primary transition-all"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
