import { ReactNode } from "react";

type AppLayoutProps = {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export default function AppLayout({ title, footer, children }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      {title && (
        <header className="p-4 bg-white shadow-md text-center font-bold">
          {title}
        </header>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col items-center overflow-auto">
        {children}
      </main>

      {/* Footer (ex: nav bar) */}
      {footer && (
        <footer className=" bottom-0 w-full bg-white border-t flex justify-around p-2">
          {footer}
        </footer>
      )}
    </div>
  );
}
