import Head from "next/head";
import "./globals.css";
import { Rubik } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const rubic = Rubik({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-rubic",
});

export const metadata = {
  title: "SerPer Interpreter",
  description: "Tercümanlık Hizmetleri",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="LTR">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charset="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <body className={`${rubic.variable}`}>{children}</body>
    </html>
  );
}
