import React from 'react';
import PostCard from '../components/PostCard';
import { allPosts } from '../utils/posts';
import Header from '../components/header';
import Footer from '../components/footer';
import { PRIMARY_FONT_FAMILY } from '../utils/constants';
import Background from '../components/Background';

export default function OurWork() {
  return (
    <div className="relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Background />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow !m-10">
          <div className="flex justify-center">
            <main className="flex flex-col items-center p-6 sm:p-10">
              <h1
                className="!mb-2 !text-left !w-full !max-w-3xl !text-3xl sm:!text-4xl md:!text-5xl lg:!text-6xl"
                style={{ fontFamily: PRIMARY_FONT_FAMILY }}
              >
                Strategies and Reportings
              </h1>
              <p
                style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 18, color: '#555', marginBottom: 30 }}
                className="text-left w-full max-w-3xl"
              >
                All of Apex Fund's news, outlined strategies, and past research.
              </p>
              <div className="max-w-3xl w-full !mx-6 sm:!mx-8">
                {allPosts.map((post, idx) => (
                  <React.Fragment key={post.meta.slug}>
                    {idx !== 0 && <hr className="!my-5 border-gray-300" />}
                    <PostCard meta={post.meta} />
                  </React.Fragment>
                ))}
              </div>
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
