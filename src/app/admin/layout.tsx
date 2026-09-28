"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  ExternalLink,
  Menu,
  X,
  Store
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navItems = [
    {
      label: "Vue d'ensemble",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Commandes",
      href: "/admin/commandes",
      icon: ShoppingCart,
      active: pathname.startsWith("/admin/commandes"),
    },
    {
      label: "Produits",
      href: "/admin/produits",
      icon: Package,
      active: pathname.startsWith("/admin/produits"),
    },
    {
      label: "Paramètres",
      href: "/admin/parametres",
      icon: Settings,
      active: pathname.startsWith("/admin/parametres"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-charcoal">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col flex-shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Brand */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gold/40 flex-shrink-0">
              <Image 
                src="/logo.png" 
                alt="Samiah Admin" 
                fill 
                className="object-contain p-0.5" 
              />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight block">Samiah</span>
              <span className="text-[10px] uppercase tracking-widest text-gold font-medium block">Backoffice</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Gestion boutique
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  item.active
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-charcoal"
                }`}
              >
                <Icon className={`w-4 h-4 ${item.active ? "text-gold" : "text-gray-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200/60"
          >
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-gold" />
              Voir la boutique
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </Link>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-gold/40 flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="Samiah Admin" 
              fill 
              className="object-contain p-0.5" 
            />
          </div>
          <div>
            <span className="font-serif font-bold text-sm tracking-tight block">Samiah</span>
            <span className="text-[9px] uppercase tracking-wider text-gold font-medium block">Backoffice</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="p-2 text-gray-600 hover:text-charcoal text-xs flex items-center gap-1"
            title="Voir la boutique"
          >
            <Store className="w-4 h-4 text-gold" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Menu administration"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown / Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-start">
          <div className="bg-white border-b border-gray-200 p-4 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Menu Administration
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-charcoal text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? "text-gold" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-charcoal py-2 px-3"
              >
                <Store className="w-4 h-4 text-gold" />
                Retourner sur la boutique
              </Link>
            </div>
          </div>
          <div 
            className="flex-1"
            onClick={() => setMobileMenuOpen(false)} 
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
