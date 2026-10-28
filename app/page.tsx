import "./globals.css";
import type { Metadata } from "metadata"; // or keep clean

export const metadata = {
  title: "Unboxed ZapLite — Local WASM Video Transcoder",
  description: "Crafted with Puneri grit by Bokya",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#07130E] text-[#E2F1EC] antialiased">
        {children}
      </body>
    </html>
  );
}
