import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import "../../globals.css";
import { ConnectKitButton } from "../components/wagmi/ConnectKitButton";
import Title from "../components/tankGame/Title";
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
      <body className="relative min-h-screen mb-10">
        <Providers>
          <div className="container mt-2">
            <ConnectKitButton showBalance />
          </div>
          <Title />
          {children}
        </Providers>
        <Analytics />
      </body>
      <footer className="bg-gray-900 text-white fixed bottom-0 w-full">
        <div className="container mx-auto py-4 px-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            2023 Tact - Made with malice by{" "}
            <a
              className="text-white hover:text-gray-400"
              href="https://twitter.com/sproule_"
            >
              Ryan Sproule
            </a>
          </p>
          <div className="flex space-x-4">
            <a href="/" className="text-white hover:text-gray-400 text-sm">
              Home
            </a>
            <a href="/test" className="text-white hover:text-gray-400 text-sm">
              Test connection
            </a>
            <a href="/rules" className="text-white hover:text-gray-400 text-sm">
              Read the rules
            </a>
            <a
              href="https://twitter.com/sproule_"
              className="text-white hover:text-gray-400"
            >
              <svg width="24" height="24" fill="currentColor">
                <path d="M22.46 6.012c-.81.36-1.68.602-2.592.71a4.526 4.526 0 0 0 1.984-2.496 9.037 9.037 0 0 1-2.866 1.095 4.513 4.513 0 0 0-7.69 4.116 12.81 12.81 0 0 1-9.3-4.715 4.49 4.49 0 0 0-.612 2.27 4.51 4.51 0 0 0 2.008 3.755 4.495 4.495 0 0 1-2.044-.564v.057a4.515 4.515 0 0 0 3.62 4.425 4.52 4.52 0 0 1-2.04.077 4.517 4.517 0 0 0 4.217 3.134 9.055 9.055 0 0 1-5.604 1.93A9.18 9.18 0 0 1 2 18.13a12.773 12.773 0 0 0 6.918 2.027c8.3 0 12.84-6.876 12.84-12.84 0-.195-.005-.39-.014-.583a9.172 9.172 0 0 0 2.252-2.336"></path>
              </svg>
            </a>
            <a
              href="https://github.com/rsproule/tanks"
              className="text-white hover:text-gray-400"
            >
              <svg width="24" height="24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.22.68-.484 0-.24-.008-.87-.013-1.71-2.786.602-3.376-1.343-3.376-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.07-.607.07-.607 1 .072 1.523 1.027 1.523 1.027 .89 1.525 2.338 1.084 2.91 .828.09-.646.35-1.083.635-1.333-2.22-.252-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.682-.1-.254-.45-1.27.1-2.65 0 0 .84-.268 2.75 1.026.8-.222 1.65-.332 2.5-.336.85 .004 1.7 .114 2.5 .336 1.91-1.294 2.75-1.026 2.75-1.026 .55 1.38.2 2.396.1 2.65 .64 .698 1.03 1.592 1.03 2.682 0 3.842-2.34 4.69-4.57 4.94.36 .31 .68 .917 .68 1.852 0 1.338-.01 2.418-.01 2.746 0 .27 .18 .582 .69 .483C19.14 20.164 22 16.418 22 12c0-5.52-4.48-10-10-10"></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </html>
  );
}
