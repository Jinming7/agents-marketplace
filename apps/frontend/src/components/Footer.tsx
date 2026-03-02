import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    marketplace: [
      { label: 'Browse Apps', href: '/' },
      { label: 'Categories', href: '/' },
      { label: 'For Developers', href: '/developers' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/support' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="font-semibold text-gray-900">ONES Marketplace</span>
            </Link>
            <p className="text-sm text-gray-500 mt-3 max-w-xs">
              Discover and install apps for your team.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Marketplace</h3>
              <ul className="space-y-2">
                {footerLinks.marketplace.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © {currentYear} ONES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}