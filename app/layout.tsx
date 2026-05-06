import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { ChatWidget } from "@/components/chat/chat-widget";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "West AI Projects Portal | Sogeti",
  description: "Track AI practice engagements, pipeline, and client activity for the West Region.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-slate-50 antialiased">
        <QueryProvider>
          <TooltipProvider>
            <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
              <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">West AI Portal</span>
                  </Link>
                  <div className="hidden md:flex items-center gap-1">
                    <Link href="/" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                      Dashboard
                    </Link>
                    <Link href="/clients" className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors">
                      Engagements
                    </Link>
                  </div>
                </div>
                <span className="text-xs text-slate-400">Sogeti · West Region</span>
              </div>
            </nav>

            <main className="max-w-screen-2xl mx-auto px-6 py-8">
              {children}
            </main>

            <ChatWidget />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
