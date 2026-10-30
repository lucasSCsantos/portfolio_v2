import type { MetadataRoute } from 'next';
import profile from '@/meta/profile';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: profile.siteUrl, changeFrequency: 'monthly', priority: 1 },
    { url: `${profile.siteUrl}/links`, changeFrequency: 'monthly', priority: 0.5 }
  ];
}
