import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MiniShop - Premium Tech Products",
  description: "Discover premium tech products including audio devices, wearables, accessories, and monitors. Fast shipping, secure checkout with Stripe.",
  keywords: ["e-commerce", "tech products", "electronics", "online shopping"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/favicon-32x32.ico", sizes: "32x32", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.ico",
    other: [
      { url: "/android-chrome-192x192.ico", sizes: "192x192", type: "image/x-icon" },
      { url: "/android-chrome-512x512.ico", sizes: "512x512", type: "image/x-icon" },
    ],
  },
  openGraph: {
    title: "MiniShop - Premium Tech Products",
    description: "Shop the latest tech products with secure payments",
    images: ["/screenshots/homepage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}