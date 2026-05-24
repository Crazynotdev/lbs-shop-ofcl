import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/supabase';
import Header from '@/Header';
import Footer from '@/Footer';
import WhatsAppFab from '@/components/ui/WhatsAppFab';
import ProductDetailClient from './ProductDetailClient';
import ProductsSection from '@/ProductsSection';
import type { Product } from '@/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  return data;
}

async function getSimilarProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*, images:product_images(*), category:categories(*), sizes:product_sizes(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .order('views', { ascending: false })
    .limit(6);
  return data ?? [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produit introuvable' };

  return {
    title: product.name,
    description: product.description ?? `Achetez ${product.name} chez LBS Shop. Livraison à Libreville.`,
    openGraph: {
      title: product.name,
      description: product.description ?? '',
      images: product.images?.find((i) => i.is_primary)?.url
        ? [{ url: product.images.find((i) => i.is_primary)!.url }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Increment views (fire-and-forget)
  supabase
    .from('products')
    .update({ views: (product.views ?? 0) + 1 })
    .eq('id', product.id)
    .then(() => {});

  const similar = await getSimilarProducts(product.category_id, product.id);

  return (
    <>
      <Header />
      <main>
        <ProductDetailClient product={product} />
        {similar.length > 0 && (
          <ProductsSection
            title="Produits Similaires"
            products={similar}
            viewAllHref={`/catalogue?category=${product.category?.slug ?? ''}`}
            layout="scroll"
          />
        )}
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
