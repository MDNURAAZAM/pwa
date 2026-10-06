import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BD Telecom",
    template: "%s | BD Telecom",
  },
  description: "Mobile Shop Management System",
  applicationName: "BD Telecom",
  appleWebApp: {
    capable: true,
    title: "BD Telecom",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} min-h-dvh flex flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
