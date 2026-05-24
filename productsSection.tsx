'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductsSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  layout?: 'grid' | 'scroll';
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductsSection({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = 'Voir tout',
  layout = 'grid',
  columns = 4,
}: ProductsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  };

  if (products.length === 0) return null;

  return (
    <section ref={ref} className="container-main py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
          <div className="accent-line w-16 mt-2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          {layout === 'scroll' && (
            <>
              <button
                onClick={() => scrollByAmount('left')}
                className="btn-icon hidden sm:flex"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollByAmount('right')}
                className="btn-icon hidden sm:flex"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green-light transition-colors"
            >
              {viewAllLabel}
              <ArrowRight size={15} />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Products */}
      {layout === 'scroll' ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory"
            style={{ scrollPaddingLeft: '1rem' }}
          >
            {products.map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-56 sm:w-64 snap-start">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={cn('grid gap-4 sm:gap-6', gridCols[columns])}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
