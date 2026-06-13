import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "Tanweer — School Management Platform",
  description: "AI-powered multi-tenant SaaS school management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
