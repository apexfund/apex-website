import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug } from '../utils/posts';
import Header from '../components/header';
import Footer from '../components/footer';
import { ArrowLeft } from 'lucide-react';
import Background from '../components/Background';

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
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-10 px-4">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-4xl">
              <Link to="/our-work" className="inline-flex items-center gap-3 rounded-full bg-gray-200 px-6 py-3 text-base text-gray-800 hover:bg-gray-300 transition-colors mb-6">
                <ArrowLeft size={20} />
                <span>Back to Our Work</span>
              </Link>
              <article className="markdown-content w-full px-4 py-8">
                <h1 className="text-4xl font-bold mb-2 text-gray-900">{post.meta.title}</h1>
                <div className="flex justify-between text-gray-500 text-sm mb-8 pb-4 border-b border-gray-200">
                  <span>{formatted}</span>
                  {post.meta.category && <span className="uppercase tracking-widest">{post.meta.category}</span>}
                </div>
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                  </ReactMarkdown>
                </div>
              </article>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}