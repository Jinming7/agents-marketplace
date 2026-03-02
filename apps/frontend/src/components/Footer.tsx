import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    marketplace: [
      { label: 'Browse Apps', href: '/' },
      { label: 'Featured', href: '/featured' },
      { label: 'Categories', href: '/category/project-management' },
      { label: 'Pricing', href: '/pricing' },
    ],
    developers: [
      { label: 'Developer Portal', href: '/developers' },
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '#' },
      { label: 'SDK', href: '#' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '/support' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Security', href: '#' },
    ],
  }

  const socialLinks = [
    { label: 'Twitter', icon: '𝕏', href: '#' },
    { label: 'LinkedIn', icon: 'in', href: '#' },
    { label: 'GitHub', icon: '⌘', href: '#' },
  ]

  const trustBadges = [
    { icon: '✓', label: 'SOC 2 Certified' },
    { icon: '✓', label: 'GDPR Compliant' },
    { icon: '✓', label: '99.9% Uptime' },
    { icon: '✓', label: '24/7 Support' },
  ]

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 lg:gap-16">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">O</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
              </div>
              <span className="text-white font-semibold text-xl tracking-tight">ONES</span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs text-gray-500">
              The enterprise app marketplace for modern teams. Discover, install, and manage apps that transform how you work.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800/50 hover:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  <span className="text-sm">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-medium text-sm mb-5 tracking-wide">Marketplace</h3>
            <ul className="space-y-4">
              {footerLinks.marketplace.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-5 tracking-wide">Developers</h3>
            <ul className="space-y-4">
              {footerLinks.developers.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-5 tracking-wide">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-sm mb-5 tracking-wide">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <span className="text-emerald-500">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50">
        <div className="max-w-[1200px] mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {currentYear} ONES Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
                Status
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}