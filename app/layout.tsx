import type { Metadata } from "next";
import "./index.css";
import Providers from "../components/Providers";
import ThemeToggle from "@/components/ThemeToggle";
import StarBackground from "@/components/StarBackground";

export const metadata: Metadata = {
  title: "Nhung Nguyen - Portfolio",
  description: "Software Engineering student passionate about building impactful full-stack web and mobile applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {/* Theme toggle */}
      <ThemeToggle />
      {/* Background effects */}
      <StarBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
