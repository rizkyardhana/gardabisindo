import { Heart, Bookmark, MapPin, Play, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { Sign } from '@/src/types';
import { cn } from '@/src/lib/utils';

interface SignCardProps {
  sign: Sign;
  className?: string;
  key?: string | number;
}

export function SignCard({ sign, className }: SignCardProps) {
  return (
    <Link to={`/sign/${sign.id}`} className="block h-full cursor-pointer">
      <motion.div
        whileHover={{ y: -8 }}
        className={cn(
          "group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between",
          className
        )}
      >
        <div>
          <div className="relative aspect-video overflow-hidden bg-slate-100">
            <img 
              src={sign.thumbnailUrl} 
              alt={sign.word} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white scale-75 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 fill-white" />
              </div>
            </div>

            <div className="absolute top-3 left-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                {sign.region}
              </span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-bold text-xl group-hover:text-garda-red transition-colors">{sign.word}</h3>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-tighter">
                {sign.category}
              </span>
            </div>
            
            <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
              {sign.description}
            </p>
          </div>
        </div>

        <div className="p-5 pt-0 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1 text-slate-400 group/btn">
                  <Heart className="w-4 h-4 hover:text-red-500 transition-colors" />
                  <span className="text-xs font-medium">{sign.likes}</span>
               </div>
               <div className="flex items-center gap-1 text-slate-400">
                  <Bookmark className="w-4 h-4 hover:text-cyan-500 transition-colors" />
                  <span className="text-xs font-medium">{sign.bookmarks}</span>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white flex items-center justify-center">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
