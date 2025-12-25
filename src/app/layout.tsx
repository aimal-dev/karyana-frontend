import type { Metadata } from "next";
import { Syne, Inter, Rajdhani } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import "./globals.css";

const syne = Syne({
  variable: "--font-subheading",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});
const rajdhani = Rajdhani({
  variable: "--font-subheading-main",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});


import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: "Karyana Store | Premium Groceries",
  description: "Experience the future of grocery shopping with our fresh, organic staples and daily essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${rajdhani.variable} ${syne.variable} ${inter.variable} antialiased bg-background text-foreground font-body selection:bg-primary selection:text-primary-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
