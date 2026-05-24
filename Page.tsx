import { Suspense } from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/supabase';
import HeroBanner from '@/HeroBanner';
import CategoriesSection from '@/CategoriesSection';
import ProductsSection from '@/productsSection';
import Header from '@/Header';
import Footer from '@/Footer';
import WhatsAppFab from '@/components/ui/WhatsAppFab';
import type { Category, Product } from '@/types';

export const revalidate = 60; // Revalidate toutes les 60 secondes

export const metadata: Metadata = {
  title: 'LBS Shop — Maillots & Accessoires Sportifs au Gabon',
};

// ————————————————————————————————————————————
// Data fetching
// ————————————————————————————————————————————

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*, products(count)')
    .eq('is_active', true)
    .order('sort_order');

  return (data ?? []).map((cat) => ({
    ...cat,
    product_count: (cat.products as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));
}

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);
  return data ?? [];
}

async function getNewProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('is_active', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(10);
  return data ?? [];
}

async function getPopularProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('is_active', true)
    .order('views', { ascending: false })
    .limit(8);
  return data ?? [];
}

async function getPromoProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('is_active', true)
    .not('original_price', 'is', null)
    .order('created_at', { ascending: false })
    .limit(8);
  return data ?? [];
}

// ————————————————————————————————————————————
// Page
// ————————————————————————————————————————————

export default async function HomePage() {
  const [categories, featured, newProducts, popular, promos] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
    getNewProducts(),
    getPopularProducts(),
    getPromoProducts(),
  ]);

  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <HeroBanner />

        {/* Categories */}
        <Suspense fallback={<div className="h-40" />}>
          <CategoriesSection categories={categories} />
        </Suspense>

        {/* Featured */}
        {featured.length > 0 && (
          <Suspense fallback={<div className="h-80" />}>
            <ProductsSection
              title="⭐ Produits Vedettes"
              subtitle="Notre sélection premium"
              products={featured}
              viewAllHref="/catalogue?is_featured=true"
              columns={4}
            />
          </Suspense>
        )}

        {/* Promo Banner */}
        <section className="container-main py-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-green-dark via-brand-green to-brand-green-light p-8 sm:p-12">
            <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-dark/70 text-sm font-bold uppercase tracking-widest">Commandez facilement</p>
                <h3 className="font-display font-black text-4xl sm:text-5xl text-dark uppercase leading-tight mt-1">
                  VIA WHATSAPP
                  <br />
                  <span className="text-3xl sm:text-4xl">EN QUELQUES CLICS</span>
                </h3>
                <p className="text-dark/70 text-sm mt-2">
                  Remplissez votre panier → Envoyez votre commande → Recevez votre article
                </p>
              </div>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '24177000000'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-dark text-white font-display font-bold text-lg uppercase rounded-2xl hover:bg-dark-100 active:scale-95 transition-all duration-200"
              >
                <span className="text-2xl">💬</span>
                Commander maintenant
              </a>
            </div>
          </div>
        </section>

        {/* New arrivals */}
        {newProducts.length > 0 && (
          <Suspense fallback={<div className="h-80" />}>
            <ProductsSection
              title="🆕 Nouveautés"
              subtitle="Arrivages récents"
              products={newProducts}
              viewAllHref="/catalogue?is_new=true"
              layout="scroll"
            />
          </Suspense>
        )}

        {/* Popular */}
        {popular.length > 0 && (
          <Suspense fallback={<div className="h-80" />}>
            <ProductsSection
              title="🔥 Les Plus Populaires"
              subtitle="Ce que tout le monde commande"
              products={popular}
              viewAllHref="/catalogue?sort=popular"
              columns={4}
            />
          </Suspense>
        )}

        {/* Promos */}
        {promos.length > 0 && (
          <Suspense fallback={<div className="h-80" />}>
            <ProductsSection
              title="🏷️ Promotions"
              subtitle="Les meilleures affaires du moment"
              products={promos}
              viewAllHref="/catalogue?has_promotion=true"
              layout="scroll"
            />
          </Suspense>
        )}

        {/* Trust section */}
        <section className="container-main py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: '🚚',
                title: 'Livraison rapide',
                desc: 'Libreville en 24h, provinces en 48-72h',
              },
              {
                icon: '✅',
                title: '100% Authentique',
                desc: 'Produits certifiés, qualité garantie',
              },
              {
                icon: '💬',
                title: 'Support WhatsApp',
                desc: 'Réponse en moins d\'1 heure',
              },
              {
                icon: '🔄',
                title: 'Retours faciles',
                desc: 'Retour ou échange sous 7 jours',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="card p-6 text-center hover:border-dark-300 transition-colors"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h4 className="font-display font-bold text-white text-sm uppercase tracking-wide">
                  {item.title}
                </h4>
                <p className="text-light-subtle text-xs mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFab />
    </>
  );
}
