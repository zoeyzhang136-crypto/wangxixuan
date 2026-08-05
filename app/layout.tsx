import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "王XX专属收藏夹｜茄茄与玄玄",
    description: "收藏王XX与茄茄在2026年夏天的成就、晴天、旅行盲盒和一封未来信。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "王XX专属收藏夹",
      description: "这个夏天，收藏了好多好事情。",
      type: "website",
      images: [{ url: imageUrl, width: 1672, height: 941 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "王XX专属收藏夹",
      description: "这个夏天，收藏了好多好事情。",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
