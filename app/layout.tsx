import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://stay.com.ng";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Elevated Stay | Asset Lifecycle Protection & Turnkey Residential Management",
    template: "%s | Elevated Stay",
  },
  description:
    "Architectural-grade residential and commercial asset lifecycle protection, automated landlord split payouts, ringfenced compound facility escrow, and AI contractor inspection auditing across prime estates in Lagos, Abuja, and Port Harcourt.",
  applicationName: "Elevated Stay",
  authors: [{ name: "Elevation Studio", url: APP_URL }],
  creator: "Elevation Studio",
  publisher: "Elevated Stay",
  category: "Real Estate & Asset Protection",
  alternates: {
    canonical: APP_URL,
    languages: {
      "en-NG": APP_URL,
      "en-GB": APP_URL,
      "en-US": APP_URL,
    },
  },
  keywords: [
    // Brand & Identity
    "Elevated Stay",
    "stay.com.ng",
    "Elevation Studio",
    "Asset Lifecycle Protection",
    "Turnkey Residential Management",
    // Geo Locations - Lagos
    "Ikoyi luxury property management",
    "Banana Island family compound protection",
    "Victoria Island residential asset governance",
    "Lekki Phase 1 high-yield property management",
    "Eko Atlantic luxury apartments management",
    "Lagos real estate asset protection",
    // Geo Locations - Abuja
    "Maitama residential estate management",
    "Asokoro executive family compounds",
    "Wuse II commercial property lifecycle",
    "Guzape luxury residential protection",
    "Abuja high net worth property management",
    // Geo Locations - Rivers State & Diaspora
    "Old GRA Port Harcourt property management",
    "Nigerian diaspora property management UK USA Canada",
    "Foreign landlord rent collection Nigeria",
    // Technology & PropTech Features
    "Automated landlord rent split Paystack",
    "Compound facility escrow subaccount",
    "AI contractor inspection verifier",
    "Computer vision property maintenance audit",
    "Annexure quiet hours enforcement",
    "PropTech Nigeria",
    "Commercial Facility Management Nigeria",
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
    title: "Elevated Stay | Turnkey Residential Management & Asset Lifecycle Protection",
    description:
      "Turnkey residential management, automated landlord split payouts, and AI contractor escrow verification for premier compounds across Lagos and Abuja.",
    url: APP_URL,
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
    title: "Elevated Stay | Turnkey Asset Protection & Residential Management",
    description:
      "Turnkey residential and commercial asset lifecycle protection, automated landlord split payouts, and AI escrow auditing for premier compounds.",
    images: ["/logo-full.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // Geo Location Tags for Local Search Ranking
    "geo.region": "NG-LA",
    "geo.placename": "Lagos, Abuja, Port Harcourt, Nigeria",
    "geo.position": "6.4549;3.4246",
    "ICBM": "6.4549, 3.4246",
    "DC.title": "Elevated Stay — Turnkey Residential Management & Asset Lifecycle Protection",
    "DC.creator": "Elevation Studio",
    "DC.subject": "Luxury Real Estate, Asset Lifecycle Protection, PropTech, Facility Escrow",
    "DC.language": "en",
  },
};

// JSON-LD Schema.org Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${APP_URL}/#organization`,
      "name": "Elevated Stay",
      "alternateName": ["Elevation Stay", "Elevated Stay Studio"],
      "url": APP_URL,
      "logo": `${APP_URL}/logo-full.png`,
      "image": `${APP_URL}/logo-full.png`,
      "description":
        "Architectural-grade turnkey residential management and asset lifecycle protection for high-value family compounds and institutional diaspora investors in Nigeria.",
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": "Lagos",
          "containsPlace": [
            { "@type": "Place", "name": "Ikoyi" },
            { "@type": "Place", "name": "Banana Island" },
            { "@type": "Place", "name": "Victoria Island" },
            { "@type": "Place", "name": "Lekki Phase 1" },
            { "@type": "Place", "name": "Eko Atlantic City" },
          ],
        },
        {
          "@type": "AdministrativeArea",
          "name": "Federal Capital Territory",
          "containsPlace": [
            { "@type": "Place", "name": "Maitama" },
            { "@type": "Place", "name": "Asokoro" },
            { "@type": "Place", "name": "Wuse II" },
            { "@type": "Place", "name": "Guzape" },
          ],
        },
        {
          "@type": "AdministrativeArea",
          "name": "Rivers State",
          "containsPlace": [{ "@type": "Place", "name": "Old GRA Port Harcourt" }],
        },
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressRegion": "Lagos State",
        "addressCountry": "NG",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 6.4549,
        "longitude": 3.4246,
      },
      "priceRange": "₦₦₦₦₦",
      "sameAs": [
        "https://stay.com.ng",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      "url": APP_URL,
      "name": "Elevated Stay",
      "publisher": { "@id": `${APP_URL}/#organization` },
      "inLanguage": "en-NG",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${APP_URL}/?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Service",
      "@id": `${APP_URL}/#service-asset-protection`,
      "name": "Residential Asset Lifecycle Protection",
      "provider": { "@id": `${APP_URL}/#organization` },
      "serviceType": "Property Management & Facility Escrow",
      "description":
        "Ringfenced facility escrow accounts, automated 90% landlord rent splits via Paystack, quiet hours enforcement, and AI contractor invoice & workmanship auditing.",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth theme-light" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans transition-colors duration-200"
      >
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
