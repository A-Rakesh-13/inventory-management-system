import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({ category, image, count }) {
  return (
    <Link
      to={`/search?categoryId=${category.id || ''}`}
      className="group relative overflow-hidden rounded-2xl glass-panel glass-panel-hover flex flex-col justify-end aspect-[4/3] p-5"
    >
      {/* Background Image with Dark Vignette */}
      <img
        src={image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/70 to-transparent" />

      {/* Content overlay */}
      <div className="relative z-10 space-y-1.5">
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
          {count || `${category.productCount || 0} products`}
        </span>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {category.name}
          </h3>
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
