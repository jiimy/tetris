import "./globals.css";
import './layout.scss';
import Head from "./head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <Head />
      <body>
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}

