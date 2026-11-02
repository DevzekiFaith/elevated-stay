import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://stay.com.ng"),
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
  icons: {
    icon: [
      { url: "/logo-mark.png", sizes: "any" },
      { url: "/logo-mark-transparent.png", type: "image/png" },
    ],
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
  openGraph: {
    title: "Elevated Stay | Asset Lifecycle Protection & Turnkey Residential Management",
    description:
      "Turnkey residential asset lifecycle protection, automated landlord split payouts, and headless tenant operations for premier compounds in Lagos and Abuja.",
    url: "https://stay.com.ng",
    siteName: "Elevated Stay",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Elevated Stay — Curated Spaces. Seamless Living.",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elevated Stay | Asset Lifecycle Protection",
    description:
      "Turnkey residential asset lifecycle protection for premier compounds in Lagos and Abuja.",
    images: ["/logo-full.png"],
  },
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
