import { Suspense } from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/supabase';
import Header from '@/Header';
import Footer from '@/Footer';
import WhatsAppFab from '@/components/ui/WhatsAppFab';
import CatalogueClient from '@/component/CatalogueClient';
import type { Category } from '@/types';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Catalogue',
  description: 'Parcourez notre catalogue complet de maillots et accessoires sportifs. Clubs européens, africains, sélections nationales.',
};

async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return data ?? [];
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CataloguePage({ searchParams }: PageProps) {
  const [categories, params] = await Promise.all([
    getCategories(),
    searchParams,
  ]);

  const initialFilters = {
    search: (params.search as string) ?? '',
    category: (params.category as string) ?? '',
    tag: (params.tag as string) ?? '',
    sort: (params.sort as string) ?? 'newest',
    min_price: params.min_price ? Number(params.min_price) : null,
    max_price: params.max_price ? Number(params.max_price) : null,
    in_stock: params.in_stock === 'true',
    has_promotion: params.has_promotion === 'true',
    is_featured: params.is_featured === 'true',
    is_new: params.is_new === 'true',
  };

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div className="min-h-screen" />}>
          <CatalogueClient categories={categories} initialFilters={initialFilters} />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
