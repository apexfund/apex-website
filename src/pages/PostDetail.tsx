import { useParams, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../utils/posts';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug) return <Navigate to="/our-work" replace />;

  const post = getPostBySlug(slug);
  if (!post) return <div className="p-8 text-center">Post not found.</div>;

  const dateObj = new Date(post.meta.date);
  const formatted = dateObj.toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">{post.meta.title}</h1>
      <div className="flex justify-between text-gray-700 text-sm mb-6">
        <span>{formatted}</span>
        {post.meta.category && <span className="uppercase">{post.meta.category}</span>}
      </div>
      <div className="prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900">
        <ReactMarkdown>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
