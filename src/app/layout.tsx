import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Cadre AI Support Chatbot",
  description: "Customer-support chatbot for Cadre AI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
