import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug } from '../utils/posts';
import Header from '../components/header';
import Footer from '../components/footer';
import { ArrowLeft } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-[#F1EDEE]">
      <Header />
      <main className="flex-grow">
        <div className="w-full flex justify-center">
          <article className="markdown-content max-w-3xl px-4 py-8">
            <Link to="/our-work" className="inline-flex items-center gap-3 rounded-full bg-gray-200 px-6 py-3 text-base text-gray-800 hover:bg-gray-300 transition-colors mb-12">
              <ArrowLeft size={20} />
              <span>Back to Our Work</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">{post.meta.title}</h1>
            <div className="flex justify-between text-gray-700 text-sm mb-6">
              <span>{formatted}</span>
              {post.meta.category && <span className="uppercase">{post.meta.category}</span>}
            </div>
            <div className="prose prose-lg">
              <ReactMarkdown>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
