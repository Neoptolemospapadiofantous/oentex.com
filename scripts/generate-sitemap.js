import fs from 'fs/promises'

const routes = [
  {
    url: 'https://oentex.com/',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    url: 'https://oentex.com/about',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.8'
  },
  {
    url: 'https://oentex.com/deals',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.9'
  },
  {
    url: 'https://oentex.com/faq',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    url: 'https://oentex.com/contact',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.7'
  },
  {
    url: 'https://oentex.com/terms',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: '0.3'
  },
  {
    url: 'https://oentex.com/privacy',
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: '0.3'
  }
]

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${route.url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return sitemap
}

async function createSitemap() {
  try {
    const sitemap = generateSitemap()
    await fs.writeFile('public/sitemap.xml', sitemap)
    console.log('✅ Sitemap generated successfully!')
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error)
    process.exit(1)
  }
}

createSitemap()
