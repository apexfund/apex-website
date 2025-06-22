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
    <article className="border-b border-gray-300 py-6">
      <Link to={`/our-work/${meta.slug}`} className="block text-2xl font-bold hover:underline">
        {meta.title}
      </Link>
      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{formatted}</span>
        {meta.category && <span className="uppercase">{meta.category}</span>}
      </div>
      {meta.description && (
        <p className="mt-2 text-gray-700">
          {meta.description}
        </p>
      )}
    </article>
  );
}
