"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link href="/">
            <h1 className="text-xl font-serif text-charcoal">Samiah Admin</h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${pathname === "/admin" ? "bg-charcoal text-white" : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Vue d'ensemble
          </Link>
          <Link 
            href="/admin/commandes" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${pathname.includes("/admin/commandes") ? "bg-charcoal text-white" : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"}`}
          >
            <ShoppingCart className="w-4 h-4" />
            Commandes
          </Link>
          <Link 
            href="/admin/produits" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${pathname.includes("/admin/produits") ? "bg-charcoal text-white" : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"}`}
          >
            <Package className="w-4 h-4" />
            Produits
          </Link>
          <Link 
            href="/admin/parametres" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${pathname.includes("/admin/parametres") ? "bg-charcoal text-white" : "text-gray-500 hover:bg-gray-50 hover:text-charcoal"}`}
          >
            <Settings className="w-4 h-4" />
            Paramètres
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-colors text-sm w-full">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
          <h1 className="text-lg font-serif text-charcoal">Samiah Admin</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
