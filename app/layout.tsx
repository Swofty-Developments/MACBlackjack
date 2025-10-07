import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationSystem } from "@/components/notification-system";
import { ResolutionChecker } from "@/components/resolution-checker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MAC Blackjack",
  description: "A BLAZINGLY-FAST 🔥🔥 NEXT-GEN AI-INSPIRED 🤖🤖 Blackjack game hosted using Vercel with a Firebase backend.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <NotificationSystem />
          <ResolutionChecker />
        </AuthProvider>
      </body>
    </html>
  );
}
