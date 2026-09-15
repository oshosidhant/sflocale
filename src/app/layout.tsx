import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Research | SF Locale",
  description:
    "SF Locale studies human judgment, preference learning and long-form consistency in AI-assisted filmmaking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
