import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google"; // Corrected import name
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Initialize the font
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synchropia",
  description: "The Future of Agentic Software Delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Switched to dark, fits your UI style better
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}