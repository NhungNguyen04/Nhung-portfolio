import type { Metadata } from "next";
import "./index.css";
import Providers from "../components/Providers";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
