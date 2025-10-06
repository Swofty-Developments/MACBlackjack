import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { NotificationSystem } from "@/components/notification-system";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MAC Blackjack",
  description: "Full-stack blackjack game with Firebase",
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
        </AuthProvider>
      </body>
    </html>
  );
}
