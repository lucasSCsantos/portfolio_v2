import type { MetadataRoute } from 'next';
import profile from '@/meta/profile';
import { htmlLang, localePaths } from '@/meta/dictionaries';

const home = (path: string) =>
  path === '/' ? profile.siteUrl : `${profile.siteUrl}${path}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = {
    [htmlLang.pt]: home(localePaths.pt),
    [htmlLang.en]: home(localePaths.en)
  };

  return [
    {
      url: home(localePaths.pt),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages }
    },
    {
      url: home(localePaths.en),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: { languages }
    },
    { url: `${profile.siteUrl}/links`, changeFrequency: 'monthly', priority: 0.5 }
  ];
}
