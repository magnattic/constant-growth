import { createClient } from 'contentful';

export const client = createClient({
  space: 'tuj777sigfax',
  accessToken: process.env.CONTENTFUL_API_KEY!,
});
