import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL('https://batapsu.com'),
  title: {
    default: "BA Tập Sự - Blog Kiến Thức Business Analysis",
    template: "%s | BA Tập Sự",
  },
  description:
    "Blog chia sẻ kiến thức Business Analysis cho người mới bắt đầu. Từ lý thuyết đến thực hành, giúp bạn tự tin trên hành trình trở thành BA chuyên nghiệp.",
  keywords: [
    "Business Analysis",
    "BA",
    "Business Analyst",
    "Phân tích nghiệp vụ",
    "Agile",
    "Scrum",
    "Requirements",
    "UX UI",
  ],
  authors: [{ name: "BA Tập Sự" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://batapsu.com",
    siteName: "BA Tập Sự",
    title: "BA Tập Sự - Blog Kiến Thức Business Analysis",
    description:
      "Blog chia sẻ kiến thức Business Analysis cho người mới bắt đầu.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BA Tập Sự - Blog Kiến Thức Business Analysis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BA Tập Sự - Blog Kiến Thức Business Analysis",
    description:
      "Blog chia sẻ kiến thức Business Analysis cho người mới bắt đầu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
