import { useParams, Navigate } from 'react-router-dom';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { getPostBySlug } from '../utils/posts';
import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import PlusBackground from '../components/PlusBackground';

export default function MarkdownPage() {
  const { slug } = useParams<{ slug: string }>();
  const [postContent, setPostContent] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#ffffff';
    return () => { document.body.style.backgroundColor = prev; };
  }, []);

  useEffect(() => {
    if (slug) {
      const post = getPostBySlug(slug);
      if (post) {
        setPostContent(post.content);
      }
    }
  }, [slug]);

  if (!slug) return <Navigate to="/our-work" replace />;
  if (!postContent) return <div className="p-8 text-center">Loading or Post not found.</div>;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <PlusBackground />
      {/* All content above the background pattern */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e5e5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '128px', paddingTop: '24px', paddingBottom: '16px' }}>
              <img src={logo} alt="Apex Fund Logo" style={{ maxWidth: '220px', width: 'auto', marginLeft: '20px', marginTop: '12px' }} />
              <button
                onClick={() => window.close()}
                style={{
                  marginRight: '20px',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#121212',
                  fontSize: '15px',
                  fontWeight: 500,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px 0',
                  borderBottom: '2px solid transparent',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#96BFCF';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = '#96BFCF';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = '#121212';
                  (e.currentTarget as HTMLButtonElement).style.borderBottomColor = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Our Work
              </button>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <MarkdownPreview
            source={postContent}
            wrapperElement={{ 'data-color-mode': 'light' }}
            style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          />
        </div>
      </div>
    </div>
  );
}
