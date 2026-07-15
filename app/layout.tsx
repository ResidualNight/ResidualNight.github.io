import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "reflex4 — Engineer, Observer, Maker",
  description:
    "reflex4 的个人网站：电子科学、智能感知、摄影、设计与声音。",
  icons: {
    icon: [
      { url: "/reflex4-favicon-v2.svg", type: "image/svg+xml" },
      { url: "/reflex4-favicon-32-v2.png", sizes: "32x32", type: "image/png" },
      { url: "/reflex4-favicon-16-v2.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/reflex4-favicon-v2.svg",
    apple: [
      {
        url: "/reflex4-apple-touch-icon-v2.png",
        sizes: "180x180",
        type: "image/png",
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
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
