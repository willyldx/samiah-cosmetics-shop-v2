export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-serif text-charcoal">Vue d'ensemble</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Commandes (Mois)</p>
          <p className="text-3xl font-serif text-charcoal">124</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Chiffre d'Affaires</p>
          <p className="text-3xl font-serif text-charcoal">1,450,000 <span className="text-lg text-gray-400">FCFA</span></p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">Produits Actifs</p>
          <p className="text-3xl font-serif text-charcoal">42</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-charcoal font-medium">Dernières commandes</h2>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
          La liaison avec Supabase n'est pas encore finalisée. Les commandes s'afficheront ici.
        </div>
      </div>
    </div>
  );
}
