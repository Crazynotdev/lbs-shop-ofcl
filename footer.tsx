import Link from 'next/link';
import { MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '24177000000';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-50 border-t border-dark-200 mt-20">
      {/* WhatsApp CTA */}
      <div className="bg-gradient-to-r from-dark-100 to-dark-50 border-b border-dark-200">
        <div className="container-main py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-tight">
              Commandez via <span className="text-brand-green">WhatsApp</span>
            </h3>
            <p className="text-light-muted text-sm mt-1">
              Notre équipe répond rapidement — 7j/7 de 8h à 22h
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-8 py-3.5 animate-pulse-green flex-shrink-0"
          >
            <MessageCircle size={20} />
            Contacter sur WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-main py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-green rounded-xl flex items-center justify-center font-display font-black text-dark text-lg">
                LBS
              </div>
              <span className="font-display font-black text-xl text-white uppercase tracking-tight">
                LBS <span className="text-brand-green">Shop</span>
              </span>
            </div>
            <p className="text-light-subtle text-sm leading-relaxed">
              La référence gabonaise pour les maillots et accessoires sportifs. Clubs européens, africains, sélections nationales.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Catalogue */}
          <div>
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Tous les produits', href: '/catalogue' },
                { label: 'Clubs européens', href: '/catalogue?tag=europe' },
                { label: 'Clubs africains', href: '/catalogue?tag=afrique' },
                { label: 'Sélections nationales', href: '/catalogue?tag=national' },
                { label: 'Basketball', href: '/catalogue?tag=basket' },
                { label: 'Maillots rétro', href: '/catalogue?tag=retro' },
                { label: 'Accessoires', href: '/catalogue?category=accessoires' },
                { label: '🔥 Promotions', href: '/catalogue?has_promotion=true' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-light-subtle text-sm hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm mb-4">
              Informations
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'À propos de LBS Shop', href: '/about' },
                { label: 'Comment commander ?', href: '/comment-commander' },
                { label: 'Livraison & Délais', href: '/livraison' },
                { label: 'Retours & Échanges', href: '/retours' },
                { label: 'Conditions générales', href: '/cgv' },
                { label: 'Politique de confidentialité', href: '/confidentialite' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-light-subtle text-sm hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-white uppercase tracking-wider text-sm mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-light-subtle">
                <MapPin size={16} className="text-brand-green flex-shrink-0 mt-0.5" />
                <span>Libreville, Gabon</span>
              </li>
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-light-subtle hover:text-brand-green transition-colors"
                >
                  <Phone size={16} className="text-brand-green flex-shrink-0" />
                  +241 77 00 00 00
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@lbs-shop.com"
                  className="flex items-center gap-3 text-sm text-light-subtle hover:text-brand-green transition-colors"
                >
                  <Mail size={16} className="text-brand-green flex-shrink-0" />
                  contact@lbs-shop.com
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-dark-200 rounded-xl border border-dark-300">
              <p className="text-xs text-light-subtle leading-relaxed">
                <span className="text-brand-green font-semibold">Horaires :</span>
                <br />
                Lundi — Dimanche
                <br />
                8h00 — 22h00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-dark-200">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-light-subtle text-xs">
            © {currentYear} LBS Shop. Tous droits réservés.
          </p>
          <p className="text-light-subtle text-xs">
            by Crazy-Tech Inc
          </p>
        </div>
      </div>
    </footer>
  );
}
