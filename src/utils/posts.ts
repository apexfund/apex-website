import matter from 'gray-matter';
import { Buffer } from 'buffer';
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
window.Buffer = Buffer;

export type PostMeta = {
  title: string;
  date: string;
  category?: string;
  description?: string;
  slug: string;
};

export type PostWithContent = {
  meta: PostMeta;
  content: string;
};

const modules = import.meta.glob('../../posts/*.md', { query: '?raw', eager: true });

function parsePosts(): PostWithContent[] {
  const posts: PostWithContent[] = [];
  // Fetch all posts
  for (const path in modules) {
    const raw = (modules[path] as { default: string }).default; // Get the raw content from path
    const { data, content } = matter(raw); // Parse the raw content
    const filename = path.split('/').pop()!; // Get the filename
    // Derive slug; optionally strip date prefix:
    const slug = filename.replace(/\.md$/, '');
    if (typeof data.title !== 'string' || typeof data.date !== 'string') {
      console.warn(`Skipping post ${filename}: missing title or date`);
      continue;
    }
    const meta: PostMeta = { // Create the post meta
      title: data.title,
      date: data.date,
      category: typeof data.category === 'string' ? data.category : undefined,
      description: typeof data.description === 'string' ? data.description : undefined,
      slug,
    };
    posts.push({ meta, content }); // Add the post to the posts array
  }
  return posts;
}

const unsorted = parsePosts();
export const allPosts = unsorted.sort((a, b) => { // Sort the posts by date
  return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime();
});

export function getPostBySlug(slug: string): PostWithContent | undefined {
  return allPosts.find(p => p.meta.slug === slug); // Find the post by slug
}
