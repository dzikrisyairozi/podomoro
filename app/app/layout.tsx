import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Podomoro",
  description: "A Pomodoro timer app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Flash-prevention script: must run before any stylesheets */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    var stored = localStorage.getItem('podomoro:theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // No preference stored — respect OS preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch (e) {}
})();
            `,
          }}
        />
      </head>
      <body
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950
                   text-neutral-900 dark:text-neutral-100
                   antialiased font-sans"
      >
        {children}
      </body>
    </html>
  );
}
