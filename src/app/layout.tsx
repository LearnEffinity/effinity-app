import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mvp.effinity.ca"),
  title: "Effinity",
  description: "It's a secret",
  openGraph: {
    type: "website",
    url: "mvp.effinity.ca",
    title: "Effinity",
    description: "It's a secret",
    siteName: "Effinity",
    images: [
      {
        url: "/EffinityMetadataBanner.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`h-max min-h-screen text-text-primary ${poppins.className}`}
      >
        {children}
      </body>
    </html>
  );
}
