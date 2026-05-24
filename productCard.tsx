'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Heart, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice, calculateDiscount, getPrimaryImagem, cn } from '@/lib/utils';
//import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  className?: string;
  index?: number;
}

export default function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const primaryImage = getPrimaryImage(product.images);
  const discount = calculateDiscount(product.price, product.original_price);
  const isOutOfStock = product.stock === 0;
  const availableSizes = product.sizes?.filter((s) => s.stock > 0).map((s) => s.size) ?? [];
  const firstAvailableSize = availableSizes[0] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_image: primaryImage,
      product_slug: product.slug,
      size: firstAvailableSize,
      quantity: 1,
      unit_price: product.price,
      stock: product.stock,
      available_sizes: availableSizes,
    });

    toast.success(`${product.name} ajouté au panier !`, {
      icon: '🛒',
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn('group relative', className)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="card-hover">
          {/* Image container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-dark-200">
            {primaryImage ? (
              <>
                {!imageLoaded && (
                  <div className="skeleton absolute inset-0" />
                )}
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={cn(
                    'object-cover transition-all duration-500 group-hover:scale-105',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-dark-200">
                <span className="font-display text-6xl font-black text-dark-400 uppercase">
                  {product.name.slice(0, 2)}
                </span>
              </div>
            )}

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="badge-red text-xs font-black">-{discount}%</span>
              )}
              {product.is_new && (
                <span className="badge-new text-xs font-bold">NOUVEAU</span>
              )}
              {product.is_featured && (
                <span className="badge-yellow text-xs font-bold">⭐ TOP</span>
              )}
              {isOutOfStock && (
                <span className="badge-gray text-xs font-bold">ÉPUISÉ</span>
              )}
            </div>

            {/* Wishlist btn */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
            >
              <Heart
                size={14}
                className={isWishlisted ? 'text-red-400 fill-red-400' : 'text-white'}
              />
            </button>

            {/* Quick actions on hover */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200',
                  isOutOfStock
                    ? 'bg-dark-300 text-light-subtle cursor-not-allowed'
                    : 'bg-brand-green text-dark hover:bg-brand-green-light active:scale-95'
                )}
              >
                <ShoppingCart size={13} />
                {isOutOfStock ? 'Épuisé' : 'Ajouter'}
              </button>
              <Link
                href={`/product/${product.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white hover:text-brand-green transition-colors"
              >
                <Eye size={15} />
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            {/* Category */}
            {product.category && (
              <p className="text-[10px] uppercase tracking-widest text-brand-green font-bold mb-1">
                {product.category.name}
              </p>
            )}

            {/* Name */}
            <h3 className="font-display font-bold text-white text-base sm:text-lg leading-tight uppercase tracking-tight line-clamp-2 group-hover:text-brand-green transition-colors duration-200">
              {product.name}
            </h3>

            {/* Sizes preview */}
            {availableSizes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {availableSizes.slice(0, 5).map((size) => (
                  <span
                    key={size}
                    className="text-[10px] px-1.5 py-0.5 bg-dark-300 text-light-muted rounded-md font-mono"
                  >
                    {size}
                  </span>
                ))}
                {availableSizes.length > 5 && (
                  <span className="text-[10px] px-1.5 py-0.5 text-light-subtle">
                    +{availableSizes.length - 5}
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-xl text-white">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-xs text-light-subtle line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              {/* Stock indicator */}
              {!isOutOfStock && product.stock <= 5 && (
                <span className="text-[10px] text-orange-400 font-semibold flex items-center gap-0.5">
                  <Zap size={10} />
                  Plus que {product.stock}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
