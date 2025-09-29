import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
// Root layout should stay minimal to avoid mounting client providers during
// prerender of special routes like `_not-found`. Client providers are moved
// into segment layouts (e.g., `(main)/layout.tsx`).

const inter = Inter({ subsets: ["latin"] });
const font = Inter_Tight({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "xaizen",
  description: "Focus made beautiful.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/dark-logo.svg",
        href: "/dark-logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/white-logo.svg",
        href: "/white-logo.svg",
      },
    ],
  },
};

import { ConvexClientProvider } from "@/components/convex-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-white text-black dark:bg-[#0f0f0f] dark:text-white"
    >
      <body className={`${font.className} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
