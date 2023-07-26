import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import "../../globals.css";
import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
export const metadata = {
  title: "Tact",
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
          <div className="container">
            <ConnectKitButton showBalance />
          </div>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
