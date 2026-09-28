"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Edit3, 
  Plus, 
  Save, 
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertTriangle
} from "lucide-react";
import { 
  fetchAdminData, 
  createAdminProduct,
  updateAdminProduct, 
  deleteAdminProduct,
  AdminProduct 
} from "@/lib/admin-data";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<AdminProduct | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminData();
      setProducts(data.products);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const toggleProductActive = async (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newActive = !prod.active;
    
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, active: newActive } : p))
    );

    const res = await updateAdminProduct({ id: productId, active: newActive });
    if (!res.success) {
      alert(`Erreur : ${res.error}`);
      loadProducts();
    }
  };

  const handleEditClick = (product: AdminProduct) => {
    setEditingProduct({ ...product });
    setIsNew(false);
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleAddNewClick = () => {
    setEditingProduct({
      id: "",
      title: "",
      price: 0,
      category: "Cheveux",
      active: true,
      image: "",
      image_url: "",
      description: "",
      short_description: "",
    });
    setIsNew(true);
    setSaveSuccess(false);
    setErrorMessage(null);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingProduct) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditingProduct((prev) =>
        prev
          ? {
              ...prev,
              image: result,
              image_url: result,
            }
          : null
      );
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (!editingProduct) return;
    setEditingProduct((prev) =>
      prev
        ? {
            ...prev,
            image: "",
            image_url: "",
          }
        : null
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    setErrorMessage(null);

    try {
      if (isNew) {
        const res = await createAdminProduct(editingProduct);
        if (!res.success) {
          setErrorMessage(
            res.isRlsError
              ? "Supabase RLS bloque l'insertion directe. Consultez les instructions dans l'onglet Paramètres pour autoriser l'écriture."
              : res.error || "Erreur lors de la création."
          );
          return;
        }
      } else {
        const res = await updateAdminProduct(editingProduct);
        if (!res.success) {
          setErrorMessage(
            res.isRlsError
              ? "Supabase RLS bloque la mise à jour directe. Consultez les instructions dans l'onglet Paramètres pour autoriser l'écriture."
              : res.error || "Erreur lors de la mise à jour."
          );
          return;
        }
      }

      setSaveSuccess(true);
      await loadProducts();
      setTimeout(() => {
        setEditingProduct(null);
        setSaveSuccess(false);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err?.message || "Erreur inattendue");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await deleteAdminProduct(productToDelete.id);
      if (!res.success) {
        alert(
          res.isRlsError
            ? "Impossible de supprimer : Supabase RLS bloque la suppression. Activez la suppression dans Supabase SQL Editor ou ajoutez SUPABASE_SERVICE_ROLE_KEY."
            : res.error
        );
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setProductToDelete(null);
        if (editingProduct?.id === productToDelete.id) {
          setEditingProduct(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-charcoal tracking-tight">Catalogue Produits</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez, éditez, supprimez et ajoutez les soins de la boutique Samiah</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-gold text-white hover:bg-gold/90 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Nouveau produit
          </button>
          <Link
            href="/produits"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-charcoal text-white hover:bg-charcoal/90 transition-colors shadow-2xs"
          >
            Voir la boutique
            <ExternalLink className="w-3.5 h-3.5 text-gold" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 border border-gray-200/80 rounded-xl shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un produit, une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-charcoal text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? "Toutes les catégories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table with Real Delete button */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-wider font-semibold text-gray-500">
              <tr>
                <th className="px-6 py-3.5">Produit & Photo</th>
                <th className="px-6 py-3.5">Catégorie</th>
                <th className="px-6 py-3.5">Prix Boutique</th>
                <th className="px-6 py-3.5">Disponibilité</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-light">
              {filteredProducts.map((product) => {
                const imgSource = product.image || product.image_url;
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {imgSource ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-sand/30 flex-shrink-0 bg-cream relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgSource}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-sand/20 flex items-center justify-center text-charcoal border border-sand/30 flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-gold" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-charcoal text-sm">{product.title}</p>
                          <p className="text-[11px] text-gray-400 font-mono">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {product.price.toLocaleString("fr-FR")} FCFA
                    </td>
                    <td className="px-6 py-4">
                      {product.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Actif en ligne
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          <X className="w-3 h-3" />
                          Désactivé
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          title="Modifier le produit"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                          Éditer
                        </button>

                        <button
                          onClick={() => toggleProductActive(product.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            product.active
                              ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                          title={product.active ? "Désactiver de la boutique" : "Activer sur la boutique"}
                        >
                          {product.active ? "Masquer" : "Publier"}
                        </button>

                        <button
                          onClick={() => setProductToDelete(product)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Supprimer définitivement ce produit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-charcoal">Supprimer ce produit ?</h3>
                <p className="text-xs text-gray-500">Cette action est irréversible.</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
              Êtes-vous sûr de vouloir supprimer définitivement le soin <strong className="font-semibold text-charcoal">« {productToDelete.title} »</strong> de la base de données et du catalogue en ligne ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-xs font-medium"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-medium transition-colors shadow-2xs"
              >
                {deleting ? "Suppression en cours..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add Product Modal Dialog */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
                  {isNew ? "Nouveau produit" : "Modification catalogue"}
                </span>
                <h3 className="text-lg font-serif font-bold text-charcoal">
                  {isNew ? "Ajouter un nouveau soin" : editingProduct.title || "Édition du produit"}
                </h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-charcoal p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Produit enregistré et répercuté sur la boutique avec succès !</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl flex items-start gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Photo section */}
              <div className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 space-y-2.5">
                <label className="block font-semibold text-charcoal text-xs">
                  Photo de l'article
                </label>

                <div className="flex items-center gap-3.5">
                  {/* Photo Preview */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center relative flex-shrink-0 shadow-2xs">
                    {(editingProduct.image || editingProduct.image_url) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={editingProduct.image || editingProduct.image_url}
                        alt="Aperçu du soin"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  {/* Actions for Photo */}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="productPhotoInput"
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-charcoal text-white hover:bg-charcoal/90 transition-colors shadow-2xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-gold" />
                        Choisir une photo
                      </button>

                      {(editingProduct.image || editingProduct.image_url) && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Retirer
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-400">
                      Depuis votre téléphone ou PC (JPG, PNG, WebP)
                    </p>
                  </div>
                </div>

                {/* Direct image URL input */}
                <div>
                  <input
                    type="url"
                    value={editingProduct.image || editingProduct.image_url || ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        image: e.target.value,
                        image_url: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-gold font-mono"
                    placeholder="Ou lien URL : https://..."
                  />
                </div>
              </div>

              {/* Titre */}
              <div>
                <label className="block font-semibold text-charcoal mb-1">Titre du produit</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, title: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  placeholder="Ex: Huile de Chébé 100ml"
                />
              </div>

              {/* Prix & Catégorie */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-charcoal mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    step={1}
                    value={editingProduct.price ? editingProduct.price : ""}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value === "" ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-gold"
                    placeholder="Prix libre de 1 à l'infini..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal mb-1">Catégorie</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold capitalize"
                  >
                    <option value="Cheveux">Cheveux</option>
                    <option value="Corps">Corps</option>
                    <option value="Visage">Visage</option>
                    <option value="Shampoing">Shampoing</option>
                    <option value="Baumes">Baumes</option>
                    <option value="Huiles">Huiles</option>
                    <option value="Accessoires">Accessoires</option>
                  </select>
                </div>
              </div>

              {/* Description courte */}
              <div>
                <label className="block font-semibold text-charcoal mb-1">Description courte</label>
                <input
                  type="text"
                  value={editingProduct.short_description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold"
                  placeholder="Accroche ou résumé du soin"
                />
              </div>

              {/* Description détaillée */}
              <div>
                <label className="block font-semibold text-charcoal mb-1">Description détaillée</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ""}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold leading-relaxed"
                  placeholder="Bienfaits, conseils d'application, ingrédients..."
                />
              </div>

              {/* Checkbox active */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingProduct.active}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      active: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-gold rounded border-gray-300 focus:ring-gold"
                />
                <label htmlFor="activeCheck" className="font-medium text-charcoal cursor-pointer">
                  Produit actif et visible sur la boutique
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                {!isNew ? (
                  <button
                    type="button"
                    onClick={() => {
                      setProductToDelete(editingProduct);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer ce produit
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 text-xs font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 text-xs font-medium transition-colors shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5 text-gold" />
                    {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
