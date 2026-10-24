import React from 'react';
import { Branch, Language } from '../types';
import { translations } from '../locales/translations';
import { MapPin, Phone, Clock, Check, Navigation } from 'lucide-react';

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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-wide">{t.step1Title}</h2>
          <p className="text-xs text-textSecondary">{t.step1Subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {branches.map((branch) => {
          const isSelected = selectedBranch?.id === branch.id;
          const branchName = language === 'ru' ? branch.nameRu : branch.nameUz;
          const branchAddress = language === 'ru' ? branch.addressRu : branch.addressUz;
          const landmark = language === 'ru' ? branch.landmarkRu : branch.landmarkUz;

          return (
            <div
              key={branch.id}
              onClick={() => onSelect(branch)}
              className={`relative cursor-pointer rounded-2xl p-3.5 transition-all active:scale-[0.99] ${
                isSelected
                  ? 'glass-card-active border-neonPurple'
                  : 'glass-card hover:border-cardBorder'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{branchName}</h3>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-neonPurple flex items-center justify-center text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                    <MapPin className="w-3.5 h-3.5 text-neonPurpleLight shrink-0" />
                    <span>{branchAddress}</span>
                    {landmark && <span className="text-textMuted">• {landmark}</span>}
                  </div>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-textMuted font-medium">
                    <div className="flex items-center gap-1 text-textSecondary">
                      <Clock className="w-3 h-3 text-statusGreen" />
                      <span>09:00 – 21:00</span>
                    </div>

                    <a
                      href={`tel:${branch.phone.replace(/\s+/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-neonPurpleLight hover:underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{branch.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Map quick button */}
                {branch.mapUrl2Gis && (
                  <a
                    href={branch.mapUrl2Gis}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 p-2 rounded-xl bg-cardDark/80 border border-cardBorder hover:border-neonPurple text-textSecondary hover:text-white transition-all"
                    title="2GIS"
                  >
                    <Navigation className="w-3.5 h-3.5 text-neonPurpleLight" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
