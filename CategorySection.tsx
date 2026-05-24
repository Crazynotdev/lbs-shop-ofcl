'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoriesSectionProps {
  categories: Category[];
}

const CATEGORY_EMOJIS: Record<string, string> = {
  maillots: '⚽',
  casquettes: '🧢',
  chaussettes: '🧦',
  sacs: '🎒',
  accessoires: '🏅',
  basketball: '🏀',
  default: '🏆',
};

const CATEGORY_GRADIENTS = [
  'from-blue-900/60 to-dark',
  'from-green-900/60 to-dark',
  'from-purple-900/60 to-dark',
  'from-orange-900/60 to-dark',
  'from-red-900/60 to-dark',
  'from-cyan-900/60 to-dark',
];

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  if (categories.length === 0) return null;

  return (
    <section ref={ref} className="container-main py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-8"
      >
        <div>
          <h2 className="section-title">Catégories</h2>
          <p className="section-subtitle">Trouvez exactement ce que vous cherchez</p>
          <div className="accent-line w-16 mt-2" />
        </div>
        <Link
          href="/catalogue"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-light transition-colors"
        >
          Tout voir
          <ArrowRight size={15} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => {
          const emoji = CATEGORY_EMOJIS[cat.slug] ?? CATEGORY_EMOJIS.default;
          const gradient = CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length];

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link
                href={`/catalogue?category=${cat.slug}`}
                className={`group block relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br ${gradient} border border-dark-300 hover:border-brand-green/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-green-glow`}
              >
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 group-hover:scale-110 transition-transform">
                    {emoji}
                  </div>
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {emoji}
                  </span>
                  <h3 className="font-display font-bold text-white text-sm sm:text-base uppercase tracking-wide leading-tight">
                    {cat.name}
                  </h3>
                  {cat.product_count !== undefined && (
                    <p className="text-xs text-brand-green mt-1 font-semibold">
                      {cat.product_count} articles
                    </p>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
