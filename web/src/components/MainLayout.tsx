import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu } from 'lucide-react';
import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const apps = [
  { name: 'Fretboard Visualizer', path: '/fretboard-visualizer' },
  { name: 'Ear Trainer', path: '/ear-trainer' },
];

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isCurrentApp = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-app-bg text-white flex flex-col">
      <header className="h-16 border-b border-neutral-700 flex items-center justify-between px-4 shrink-0 relative z-30">
        <Link href="/" className="text-4xl font-bold no-underline">
          Stratobater
        </Link>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-neutral-700 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-10">
              {apps.map((app) => (
                <div
                  key={app.path}
                  className={`px-4 py-2 cursor-pointer ${
                    isCurrentApp(app.path)
                      ? 'opacity-50 pointer-events-none bg-neutral-700'
                      : 'hover:bg-neutral-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href={app.path} className="block">
                    {app.name}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
};
