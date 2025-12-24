import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex flex-col items-center md:items-start gap-2">
              <img src="/logoLight.jpeg" alt="City Pro Drivers" className="h-14 w-auto object-contain" />
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-background/50 font-bold leading-tight">
                  Registered under Govt of India
                </p>
                <p className="text-[10px] text-background/50 leading-tight">
                  GST: 33ATBPP4186E1ZS
                </p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed max-w-xs md:max-w-none">
              Professional acting drivers for your own car. Safe, verified, and reliable drivers for all your travel needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <nav className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/services', label: 'Services' },
                { href: '/booking', label: 'Book a Driver' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/terms', label: 'Terms & Conditions' },
                { href: '/admin', label: 'Admin Panel' },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block text-background/70 hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Our Services</h4>
            <nav className="space-y-3">
              {[
                'Hourly Drivers',
                'Daily Drivers',
                'Monthly Drivers',
                'Outstation Drivers',
                'Valet Parking',
              ].map((service) => (
                <span
                  key={service}
                  className="block text-background/70 text-sm"
                >
                  {service}
                </span>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <a href="tel:+919514222207" className="hover:text-primary transition-colors">95142 22207</a>
                  <span className="text-background/30">|</span>
                  <a href="tel:+919514222208" className="hover:text-primary transition-colors">95142 22208</a>
                </div>
              </div>
              <div className="flex items-center gap-3 text-background/70">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  <a href="https://wa.me/917604988481" className="hover:text-primary transition-colors">76049 88481</a>
                  <span className="text-background/30">|</span>
                  <a href="https://wa.me/919884132257" className="hover:text-primary transition-colors">98841 32257</a>
                </div>
              </div>
              <a href="mailto:care@cityprodrivers.com" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
                <span>care@cityprodrivers.com</span>
              </a>
              <div className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 mt-0.5" />
                <span className="text-sm">
                  No 20, Ganapathi Nagar, Vijayarani Garden, Korattur, Chennai‑99, Opposite to Orchid Springs Apartments (Water Canal Road).
                  <br />
                  <a href="https://maps.google.com/?q=20+Ganapathi+Nagar+Vijayarani+Garden+Korattur+Chennai+99" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 inline-block">
                    View on Map
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} City Pro Drivers. All rights reserved. developed by Tagverse.io.
          </p>
          <p className="text-background/50 text-sm">
            Your Car. Our Driver. Safe Journey.
          </p>
        </div>
      </div>
    </footer>
  );
}
