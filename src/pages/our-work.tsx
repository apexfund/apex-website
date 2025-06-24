import React from 'react';
import PostCard from '../components/PostCard';
import { allPosts } from '../utils/posts';
import Header from '../components/header';
import Footer from '../components/footer';

export default function OurWork() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col justify-center items-center p-8">
        <div className='bg-[#F1EDEE] w-full h-full'>
          <h1 className="text-4xl font-bold text-center mb-4">Strategies and Reportings</h1>
            <p className="text-center text-gray-600 mb-8">
              All of Apex Fund’s news, outlined strategies, and past research.
            </p>
            <div className="space-y-4">
              {allPosts.map(p => (
                <PostCard key={p.meta.slug} meta={p.meta} />
              ))}
            </div>
        </div>
      </main>
      <Footer />
    </div>

  );
}
