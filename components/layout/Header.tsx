'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Moon, Sun, LogOut, LayoutDashboard, Menu, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { signOut } from '@/lib/auth-client';

const navItems = [
  {
    label: 'Products',
    children: [
      { label: 'Agent Builder', description: 'Create and configure agents.', href: '/products/builder' },
      { label: 'Observability', description: 'Monitor performance.', href: '/products/observability' },
      { label: 'Memory Persistence', description: 'Manage agent state.', href: '/products/memory' },
    ],
  },
  { label: 'Playground', href: '/playground' },
  { label: 'Docs', href: '/docs' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  {
    label: 'Resources',
    children: [
      { label: 'Customer Stories', description: 'See who is building with us.', href: '/resources/stories' },
      { label: 'Community', description: 'Join our developer community.', href: '/resources/community' },
    ],
  },
];

type HeaderProps = {
  isCompact: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
};

export default function Header({ isCompact, isDarkMode = true, onToggleTheme }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    dispatch(logout());
    setUserMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 pointer-events-none">
      <div
        className={cn(
          'mx-auto mt-4 flex max-w-7xl items-center justify-between relative pointer-events-auto transition-all duration-300',
          isCompact ? 'py-2' : 'py-3'
        )}
      >
        {/* Logo and App Name */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex items-center gap-2.5 group relative z-10">
            <div
              className={cn(
                'font-extrabold tracking-widest transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r',
                isCompact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl',
                isDarkMode
                  ? 'from-white via-zinc-100 to-zinc-400'
                  : 'from-black via-zinc-800 to-zinc-650'
              )}
            >
              Synchropia
            </div>
          </Link>
        </div>

        {/* Dynamic Navigation Section */}
        <nav ref={navRef} className={cn("hidden items-center lg:flex gap-1 relative z-10 rounded-full border backdrop-blur-md px-4 py-2 shadow-sm transition-all", isDarkMode ? 'border-white/10 bg-black/40 text-white' : 'border-black/10 bg-white/70 text-black')}>
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {item.children ? (
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={cn(
                    'flex items-center gap-1 rounded-full px-4 py-2 transition-all duration-300 font-medium',
                    isCompact ? 'text-sm' : 'text-base',
                    isDarkMode
                      ? 'text-zinc-350 hover:text-white hover:bg-white/5'
                      : 'text-zinc-700 hover:text-black hover:bg-black/5',
                    openDropdown === item.label
                      ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-black')
                      : ''
                  )}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={cn(
                      'transition-transform duration-200',
                      openDropdown === item.label ? 'rotate-180' : ''
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href || '#'}
                  className={cn(
                    'rounded-full px-4 py-2 transition-all duration-300 font-medium block',
                    isCompact ? 'text-sm' : 'text-base',
                    isDarkMode
                      ? 'text-zinc-350 hover:text-white hover:bg-white/5'
                      : 'text-zinc-700 hover:text-black hover:bg-black/5'
                  )}
                >
                  {item.label}
                </Link>
              )}

              {/* Dropdown Panel */}
              {item.children && openDropdown === item.label && (
                <div
                  className={cn(
                    'absolute left-1/2 mt-2 w-64 -translate-x-1/2 origin-top rounded-2xl border p-2 backdrop-blur-xl shadow-2xl z-50',
                    isDarkMode
                      ? 'border-white/10 bg-black/80'
                      : 'border-black/10 bg-white/95'
                  )}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href || '#'}
                      target={child.external ? '_blank' : undefined}
                      rel={child.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setOpenDropdown(null)}
                      className={cn(
                        "block rounded-xl p-3 text-left transition-all duration-200",
                        isDarkMode ? "hover:bg-white/5" : "hover:bg-black/5"
                      )}
                    >
                      <p className={cn("font-bold text-xs", isDarkMode ? "text-white" : "text-black")}>{child.label}</p>
                      <p className={cn("text-[10px] mt-0.5 leading-relaxed", isDarkMode ? "text-zinc-400" : "text-zinc-500")}>{child.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex-1 flex justify-end relative z-10">
          <div className={cn("flex items-center gap-2 rounded-full border backdrop-blur-md px-2.5 py-1.5 shadow-sm transition-all", isDarkMode ? 'border-white/10 bg-black/40 text-white' : 'border-black/10 bg-white/70 text-black')}>
          {/* Authentication UI */}
          {user ? (
            /* Logged In View */
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold select-none cursor-pointer shadow-md hover:scale-105 transition-transform">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              </button>

              {userMenuOpen && (
                <div
                  className={cn(
                    'absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border p-1.5 backdrop-blur-xl shadow-2xl z-50',
                    isDarkMode
                      ? 'border-white/10 bg-black/90'
                      : 'border-black/10 bg-white/95'
                  )}
                >
                  <div className="px-3 py-2 border-b border-border/40 mb-1">
                    <p className={cn("font-bold text-xs truncate", isDarkMode ? "text-white" : "text-black")}>
                      {user.name}
                    </p>
                    <p className={cn("text-[10px] truncate", isDarkMode ? "text-zinc-500" : "text-zinc-400")}>
                      {user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors",
                      isDarkMode ? "text-zinc-300 hover:bg-white/5 hover:text-white" : "text-zinc-700 hover:bg-black/5 hover:text-black"
                    )}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      "w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors text-rose-500",
                      isDarkMode ? "hover:bg-rose-500/10" : "hover:bg-rose-50/10"
                    )}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out View */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  'rounded-full px-3 py-1.5 transition-all duration-300 font-bold',
                  isCompact ? 'text-sm' : 'text-base',
                  isDarkMode
                    ? 'text-zinc-350 hover:text-white'
                    : 'text-zinc-700 hover:text-black'
                )}
              >
                Sign In
              </Link>
              <Link
                href="/discover"
                className={cn(
                  'rounded-full font-bold shadow-md transition-all duration-300 px-3.5 py-1.5',
                  isCompact ? 'text-sm' : 'text-base',
                  isDarkMode
                    ? 'bg-white text-black hover:bg-zinc-100'
                    : 'bg-black text-white hover:bg-zinc-900'
                )}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              'lg:hidden flex items-center justify-center rounded-full p-2 transition-colors',
              isDarkMode ? 'text-zinc-350 hover:bg-white/5' : 'text-zinc-700 hover:bg-black/5'
            )}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            'mx-auto mt-2 max-w-7xl lg:hidden rounded-2xl border p-4 backdrop-blur-xl shadow-2xl flex flex-col gap-3',
            isDarkMode
              ? 'border-white/10 bg-black/90 text-white'
              : 'border-black/10 bg-white/95 text-black'
          )}
        >
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-border/20 pb-2">
              <div className="font-bold text-xs px-2 py-1 uppercase tracking-wider text-zinc-500 mb-1">
                {item.label}
              </div>
              {item.children ? (
                <div className="pl-3 flex flex-col gap-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href || '#'}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block p-1.5 rounded-lg text-xs font-semibold",
                        isDarkMode ? "text-zinc-300 hover:text-white" : "text-zinc-700 hover:text-black"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href={item.href || '#'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-2 py-1 text-xs font-semibold",
                    isDarkMode ? "text-zinc-300 hover:text-white" : "text-zinc-700 hover:text-black"
                  )}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>

    {/* Theme Toggle Button - Bottom Left */}
    {onToggleTheme && (
      <button
        onClick={onToggleTheme}
        className={cn(
          'fixed bottom-6 left-6 z-50 flex items-center justify-center rounded-full p-3 transition-all duration-300 hover:scale-110 active:scale-95 border backdrop-blur-md shadow-lg pointer-events-auto',
          isDarkMode
            ? 'border-white/10 bg-black/60 text-zinc-350 hover:bg-white/10 hover:text-white'
            : 'border-black/10 bg-white/80 text-zinc-700 hover:bg-black/10 hover:text-black'
        )}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 transition-transform duration-300" />
        ) : (
          <Moon className="h-5 w-5 transition-transform duration-300" />
        )}
      </button>
    )}
    </>
  );
}
