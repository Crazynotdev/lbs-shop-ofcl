'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, ChevronDown,
  Grid2X2, LayoutList, Filter
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { cn, debounce } from '@/lib/utils';
import type { Category, Product } from '@/types';

const SORT_OPTIONS = [
  { label: 'Plus récents', value: 'newest' },
  { label: 'Plus anciens', value: 'oldest' },
  { label: 'Prix croissant', value: 'price_asc' },
  { label: 'Prix décroissant', value: 'price_desc' },
  { label: 'Plus populaires', value: 'popular' },
];

interface Filters {
  search: string;
  category: string;
  tag: string;
  sort: string;
  min_price: number | null;
  max_price: number | null;
  in_stock: boolean;
  has_promotion: boolean;
  is_featured: boolean;
  is_new: boolean;
}

interface CatalogueClientProps {
  categories: Category[];
  initialFilters: Filters;
}

const PRODUCTS_PER_PAGE = 20;

async function fetchProducts(filters: Filters, page: number): Promise<{ products: Product[]; total: number }> {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.min_price) params.set('min_price', String(filters.min_price));
  if (filters.max_price) params.set('max_price', String(filters.max_price));
  if (filters.in_stock) params.set('in_stock', 'true');
  if (filters.has_promotion) params.set('has_promotion', 'true');
  if (filters.is_featured) params.set('is_featured', 'true');
  if (filters.is_new) params.set('is_new', 'true');
  params.set('page', String(page));
  params.set('limit', String(PRODUCTS_PER_PAGE));

  const res = await fetch(`/api/products?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) return { products: [], total: 0 };
  return res.json();
}

export default function CatalogueClient({ categories, initialFilters }: CatalogueClientProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(4);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  const loadProducts = useCallback(async (f: Filters, p: number) => {
    setLoading(true);
    try {
      const result = await fetchProducts(f, p);
      setProducts(result.products);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(filters, page);
  }, [filters, page, loadProducts]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    const reset: Filters = {
      search: '',
      category: '',
      tag: '',
      sort: 'newest',
      min_price: null,
      max_price: null,
      in_stock: false,
      has_promotion: false,
      is_featured: false,
      is_new: false,
    };
    setFilters(reset);
    setPage(1);
  };

  const hasActiveFilters = filters.category || filters.tag || filters.min_price ||
    filters.max_price || filters.in_stock || filters.has_promotion ||
    filters.is_featured || filters.is_new || filters.search;

  const SkeletonCard = () => (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/5]" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-6 w-1/3 rounded mt-2" />
      </div>
    </div>
  );

  return (
    <div className="container-main py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white uppercase tracking-tight">
          Catalogue
        </h1>
        <p className="text-light-muted mt-2">
          {loading ? 'Chargement...' : `${total} produit${total !== 1 ? 's' : ''} trouvé${total !== 1 ? 's' : ''}`}
        </p>
        <div className="accent-line w-16 mt-2" />
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-light-subtle" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          placeholder="Rechercher maillot, club, taille..."
          className="input pl-11 text-base"
        />
        {filters.search && (
          <button
            onClick={() => updateFilter('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-light-subtle hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Filter toggle + active filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200',
              filtersOpen
                ? 'bg-brand-green text-dark border-brand-green'
                : 'bg-dark-100 text-light-muted border-dark-300 hover:text-white hover:border-dark-400'
            )}
          >
            <SlidersHorizontal size={15} />
            Filtres
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-dark text-brand-green text-xs font-black rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {filters.category && (
            <button
              onClick={() => updateFilter('category', '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-green/15 text-brand-green text-xs font-semibold border border-brand-green/30 hover:bg-brand-green/25 transition-colors"
            >
              {categories.find((c) => c.slug === filters.category)?.name ?? filters.category}
              <X size={11} />
            </button>
          )}
          {filters.has_promotion && (
            <button
              onClick={() => updateFilter('has_promotion', false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold border border-red-500/30 hover:bg-red-500/25 transition-colors"
            >
              Promotions <X size={11} />
            </button>
          )}
          {filters.is_new && (
            <button
              onClick={() => updateFilter('is_new', false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-semibold border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
            >
              Nouveautés <X size={11} />
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-light-subtle hover:text-white transition-colors px-2 py-1"
            >
              Tout réinitialiser
            </button>
          )}
        </div>

        {/* Sort + Grid */}
        <div className="flex items-center gap-2">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="select py-2 text-sm w-auto"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-1 p-1 bg-dark-100 rounded-xl border border-dark-300">
            {([2, 3, 4] as const).map((cols) => (
              <button
                key={cols}
                onClick={() => setGridCols(cols)}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                  gridCols === cols
                    ? 'bg-brand-green text-dark'
                    : 'text-light-subtle hover:text-white'
                )}
              >
                <Grid2X2 size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="card p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Categories */}
              <div>
                <label className="input-label">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="select text-sm"
                >
                  <option value="">Toutes</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Min price */}
              <div>
                <label className="input-label">Prix min (FCFA)</label>
                <input
                  type="number"
                  value={filters.min_price ?? ''}
                  onChange={(e) => updateFilter('min_price', e.target.value ? Number(e.target.value) : null)}
                  placeholder="0"
                  className="input text-sm"
                  min={0}
                />
              </div>

              {/* Max price */}
              <div>
                <label className="input-label">Prix max (FCFA)</label>
                <input
                  type="number"
                  value={filters.max_price ?? ''}
                  onChange={(e) => updateFilter('max_price', e.target.value ? Number(e.target.value) : null)}
                  placeholder="100 000"
                  className="input text-sm"
                  min={0}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 col-span-2 sm:col-span-1">
                <label className="input-label">Options</label>
                {[
                  { key: 'in_stock' as const, label: 'En stock uniquement' },
                  { key: 'has_promotion' as const, label: 'En promotion' },
                  { key: 'is_new' as const, label: 'Nouveautés' },
                  { key: 'is_featured' as const, label: 'Produits vedettes' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => updateFilter(key, !filters[key])}
                      className={cn(
                        'w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0',
                        filters[key] ? 'bg-brand-green' : 'bg-dark-400'
                      )}
                    >
                      <div
                        className={cn(
                          'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
                          filters[key] ? 'left-5.5' : 'left-0.5'
                        )}
                        style={{ left: filters[key] ? 'calc(100% - 18px)' : '2px' }}
                      />
                    </div>
                    <span className="text-xs text-light-muted">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products grid */}
      {loading ? (
        <div
          className={cn(
            'grid gap-4 sm:gap-6',
            gridCols === 2 ? 'grid-cols-2' :
            gridCols === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="font-display font-bold text-2xl text-white uppercase mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-light-muted mb-6">
            Essayez de modifier vos filtres ou votre recherche
          </p>
          <button onClick={resetFilters} className="btn-primary">
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'grid gap-4 sm:gap-6',
            gridCols === 2 ? 'grid-cols-2' :
            gridCols === 3 ? 'grid-cols-2 sm:grid-cols-3' :
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          )}
        >
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary py-2 px-4 disabled:opacity-40"
          >
            Précédent
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'w-9 h-9 rounded-xl text-sm font-semibold transition-all duration-200',
                    page === pageNum
                      ? 'bg-brand-green text-dark'
                      : 'bg-dark-100 text-light-muted hover:text-white hover:bg-dark-200 border border-dark-300'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary py-2 px-4 disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
