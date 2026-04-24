import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://acecents.vercel.app'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    // We can add logic here later to dynamically add calculators
  ]
}
