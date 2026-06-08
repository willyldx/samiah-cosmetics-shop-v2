import Link from "next/link";
import Image from "next/image";

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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Image container */}
      <Link href={`/produits/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-gray-50 border border-transparent group-hover:border-gray-100 transition-colors">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"}
          alt={product.title}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        {product.isNew && (
          <span className="absolute top-4 left-4 bg-white text-charcoal text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 z-10 border border-gray-100 shadow-sm">
            Nouveau
          </span>
        )}
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center">
          <button className="w-full bg-charcoal/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-[0.2em] py-3.5 hover:bg-gold transition-colors shadow-lg">
            Ajout Rapide
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="pt-5 pb-2 text-center flex flex-col items-center">
        <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5">
          {product.category}
        </p>
        <Link href={`/produits/${product.id}`}>
          <h3 className="text-charcoal font-serif text-lg mb-1 group-hover:text-gold transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-500 font-light text-sm mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
