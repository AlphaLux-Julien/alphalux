export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/reset-password'] },
    sitemap: 'https://www.alphalux.fr/sitemap.xml',
  }
}
