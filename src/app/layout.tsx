import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "@/src/index.css";
import { ClientWrapper } from "@/src/components/ClientWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "GARDA BISINDO - Save BISINDO, Save Our Culture",
  description: "Platform digital kolaboratif untuk pelestarian Bahasa Isyarat Indonesia (BISINDO) dan arsip dokumentasi kosa isyarat daerah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
