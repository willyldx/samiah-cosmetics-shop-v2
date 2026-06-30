import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-sand/30 p-3 hover:border-gold/50 hover:shadow-[0_10px_35px_rgba(197,168,128,0.06)] transition-all duration-500 rounded-sm">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream block rounded-sm">
        <Link 
          href={`/produits/${product.id}`} 
          className="absolute inset-0 z-0"
        >
          <Image
            src={product.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />
        </Link>
        
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-charcoal text-white text-[8px] font-semibold uppercase tracking-[0.25em] px-2.5 py-1 z-10 rounded-xs">
            Nouveau
          </span>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0 flex justify-center z-10">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-charcoal text-white text-[9px] uppercase tracking-[0.2em] font-semibold py-3.5 hover:bg-gold hover:text-charcoal transition-colors duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 pb-1 text-center flex flex-col items-center">
        <p className="text-[8px] uppercase tracking-[0.25em] font-semibold text-gold">
          {product.category}
        </p>
        <Link href={`/produits/${product.id}`} className="mt-1 block max-w-full">
          <h3 className="text-charcoal font-serif text-base font-medium truncate group-hover:text-gold transition-colors duration-300 px-1">
            {product.title}
          </h3>
        </Link>
        <p className="text-charcoal/60 font-light text-xs mt-1.5">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
