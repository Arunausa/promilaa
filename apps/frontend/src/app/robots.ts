import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promilaa.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/checkout/', '/account/'],
      },
      // GENERATIVE ENGINE OPTIMIZATION (GEO) - ALLOW ALL AI SEARCH BOTS
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'PerplexityBot', 'ClaudeBot', 'Google-Extended'],
        allow: '/',
        disallow: ['/admin/'],
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
