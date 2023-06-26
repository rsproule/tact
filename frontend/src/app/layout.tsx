import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import "../../globals.css";
export const metadata = {
  title: "Tank Turn Tactics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
