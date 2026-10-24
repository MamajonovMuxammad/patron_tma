import React from 'react';
import { Branch, Language } from '../types';
import { translations } from '../locales/translations';
import { MapPin, Phone, Clock, Check, Navigation, ExternalLink } from 'lucide-react';

interface BranchSelectorProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onSelect: (branch: Branch) => void;
  language: Language;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  branches,
  selectedBranch,
  onSelect,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-black text-white tracking-wide">{t.step1Title}</h2>
        <p className="text-xs text-zinc-400">{t.step1Subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {branches.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;
          const branchName = language === 'ru' ? branch.nameRu : branch.nameUz;
          const branchAddress = language === 'ru' ? branch.addressRu : branch.addressUz;
          const landmark = language === 'ru' ? branch.landmarkRu : branch.landmarkUz;

          return (
            <div
              key={branch.id}
              onClick={() => onSelect(branch)}
              className={`relative cursor-pointer rounded-3xl p-4 transition-all duration-300 border flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1C1828] via-[#141418] to-[#121018] border-purple-500 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/50'
                  : 'bg-[#141418] hover:bg-[#18181D] border-zinc-800/90 hover:border-zinc-700'
              }`}
            >
              {/* Top Row: Branch Info + Selection Checkmark in Top Right */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <img
                    src={branch.photoUrl}
                    alt={branchName}
                    className="w-12 h-12 rounded-2xl object-cover border border-purple-500/30 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="text-sm font-black text-white truncate">{branchName}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{branchAddress}</span>
                    </div>
                    {landmark && (
                      <p className="text-[11px] text-zinc-400 truncate">{landmark}</p>
                    )}
                  </div>
                </div>

                {/* Checkin / Selection Indicator (Top Right) */}
                <div className="shrink-0 pt-0.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-purple-600 text-white ring-4 ring-purple-500/20 shadow-md shadow-purple-600/40 scale-105'
                        : 'border-2 border-zinc-700 bg-zinc-900/40 text-transparent'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              </div>

              {/* Middle Row: Schedule & Phone */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">09:00 – 21:00</span>
                  <span className="text-[10px] text-emerald-400 font-bold">• Открыто</span>
                </div>

                <a
                  href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-bold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{branch.phone}</span>
                </a>
              </div>

              {/* Bottom Row: Yandex Maps Route Button */}
              {branch.mapUrlYandex && (
                <div className="pt-1 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={branch.mapUrlYandex}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-2 px-3 rounded-xl bg-[#1C1C24] hover:bg-zinc-800 border border-zinc-700/80 hover:border-purple-500/60 text-xs font-bold text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-all group"
                  >
                    {/* Yandex Maps Red GeoPin Icon */}
                    <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>{language === 'ru' ? 'Маршрут в Яндекс.Картах' : 'Yandeks Xaritada marshrut'}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-white" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
