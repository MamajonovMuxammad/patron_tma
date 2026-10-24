import React, { useState } from 'react';
import { ServiceItem, Language } from '../types';
import { translations } from '../locales/translations';
import { Sparkles, Clock, Check, Scissors, ChevronRight } from 'lucide-react';

interface ServicesCatalogScreenProps {
  services: ServiceItem[];
  onSelectServiceAndBook: (serviceId: number) => void;
  language: Language;
}

export const ServicesCatalogScreen: React.FC<ServicesCatalogScreenProps> = ({
  services,
  onSelectServiceAndBook,
  language,
}) => {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', labelRu: 'Все услуги', labelUz: 'Barchasi' },
    { id: 'HAIRCUT', labelRu: 'Стрижки', labelUz: 'Soch turmagi' },
    { id: 'COMBO', labelRu: 'Комплексы', labelUz: 'Kompleks' },
    { id: 'BEARD', labelRu: 'Борода', labelUz: 'Soqol' },
    { id: 'SPA', labelRu: 'Уход / SPA', labelUz: 'Parvarish' },
  ];

  const filteredServices = services.filter((s) => {
    if (activeCategory === 'ALL') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h2 className="text-base font-black text-white tracking-wide">
            {language === 'ru' ? 'Прайс-лист и услуги PATRON' : 'PATRON xizmatlari va narxlari'}
          </h2>
        </div>
        <p className="text-xs text-zinc-400">
          {language === 'ru'
            ? 'Премиальный уход, сертифицированные мастера и косметика'
            : 'Premium parvarish, tajribali ustalar va professional kosmetika'}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#141418] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {language === 'ru' ? c.labelRu : c.labelUz}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {filteredServices.map((service) => {
          const name = language === 'ru' ? service.nameRu : service.nameUz;
          const desc = language === 'ru' ? service.descriptionRu : service.descriptionUz;

          return (
            <div
              key={service.id}
              className="rounded-3xl bg-[#141418] border border-zinc-800/80 hover:border-purple-500/50 p-4 transition-all duration-200 space-y-3 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-white leading-snug">{name}</h3>
                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-purple-300">
                      {service.priceUzs.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold ml-1">
                      {t.sum}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{desc}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {service.durationMinutes} {t.min}
                  </span>
                </div>

                <button
                  onClick={() => onSelectServiceAndBook(service.id)}
                  className="py-2 px-3.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{language === 'ru' ? 'Выбрать' : 'Yozilish'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
