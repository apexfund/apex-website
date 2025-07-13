import React from 'react';
import { Link } from 'react-router-dom';
import type { PostMeta } from '../utils/posts';

type Props = { meta: PostMeta };

export default function PostCard({ meta }: Props) {
  const dateObj = new Date(meta.date);
  const formatted = dateObj.toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
  
  return (
    <article className="py-12">
      {/* Header Row: Title + Label */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold" style={{ fontFamily: "'Product-Sans-Bold', sans-serif", fontSize: 24, marginBottom: 10 }}>
          <Link
            to={`/our-work/${meta.slug}`}
            className="font-bold underline decoration-black decoration-2 text-black transition-all duration-200 hover:!text-white hover:bg-black hover:no-underline"
            style={{ fontFamily: "'Product-Sans-Bold', sans-serif", boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone' }}
          >
            {meta.title}
          </Link>
        </h4>
        {meta.category && (
          <span
            className="uppercase text-[#555] bg-gray-200 !px-5 !py-1 !ml-3 text-base border-2 border-[#e1edf2]"
            style={{ fontFamily: "'Untitled-Sans', sans-serif", fontSize: 16 }}
          >
            {meta.category}
          </span>
        )}
      </div>
      {/* Timestamp Row */}
      <div
        className="text-[#888] text-sm mb-2"
        style={{ fontFamily: "'Untitled-Sans', sans-serif" }}
      >
        Date: {formatted}
      </div>
      {/* Description */}
      {meta.description && (
        <p
          className="text-base text-gray-500 mb-2"
          style={{ fontFamily: "'Untitled-Sans', sans-serif" }}
        >
          {meta.description}
        </p>
      )}
    </article>
  );
}