import type { Metadata } from "next";
import { Poppins, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Training & Placement Cell | NIT Puducherry",
  description: "Training and Placement Portal of National Institute of Technology Puducherry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${playfair.variable} scroll-smooth`}
    >
      <body className="bg-luna-950 text-slate-100 dark:bg-luna-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden relative min-h-screen">
        {children}
      </body>
    </html>
  );
}
