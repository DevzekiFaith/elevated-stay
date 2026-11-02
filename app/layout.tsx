import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Elevated Stay | Asset Lifecycle Protection & Turnkey Residential Management",
  description:
    "Turnkey residential asset lifecycle protection, automated landlord split payouts, and headless tenant operations for premier compounds in Lagos and Abuja.",
  keywords: [
    "Elevated Stay",
    "Asset Lifecycle Protection",
    "Turnkey Residential Management",
    "Lagos Luxury Real Estate",
    "Lekki",
    "Ikoyi",
    "Banana Island",
    "PropTech Nigeria",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth theme-light" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans transition-colors duration-200"
      >
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
