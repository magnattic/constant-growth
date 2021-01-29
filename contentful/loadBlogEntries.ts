import { client } from './contentful-client';

export interface BlogEntry {
  title: string;
  description: string;
  body: string;
}

export const loadBlogEntries = async () => {
  const entries = await client.getEntries<BlogEntry>({
    content_type: 'blogPost',
  });
  return entries.items.map((x) => x.fields);
};
