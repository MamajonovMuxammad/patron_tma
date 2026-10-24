import React from 'react';
import { ServiceItem, Language } from '../types';
import { translations } from '../locales/translations';
import { Check, Clock } from 'lucide-react';

interface ServiceSelectorProps {
  services: ServiceItem[];
  selectedServiceIds: number[];
  onToggleService: (id: number) => void;
  language: Language;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServiceIds,
  onToggleService,
  language,
}) => {
  const t = translations[language];

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU');
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white tracking-wide">{t.step3Title}</h2>
          <p className="text-xs text-textSecondary">{t.step3Subtitle}</p>
        </div>
      </div>

      <div className="space-y-2">
        {services.map((service) => {
          const isSelected = selectedServiceIds.includes(service.id);
          const name = language === 'ru' ? service.nameRu : service.nameUz;
          const desc = language === 'ru' ? service.descriptionRu : service.descriptionUz;

          return (
            <div
              key={service.id}
              onClick={() => onToggleService(service.id)}
              className={`relative cursor-pointer rounded-2xl p-3.5 transition-all active:scale-[0.99] flex items-center justify-between gap-3 ${
                isSelected
                  ? 'glass-card-active border-neonPurple'
                  : 'glass-card hover:border-cardBorder'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-neonPurple border-neonPurple text-white shadow-glow-purple'
                      : 'border-white/20 bg-cardDark'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-white">{name}</h3>
                  <p className="text-xs text-textSecondary line-clamp-1">{desc}</p>
                  <div className="flex items-center gap-1 text-[11px] text-textMuted font-medium pt-0.5">
                    <Clock className="w-3 h-3 text-neonPurpleLight" />
                    <span>
                      {service.durationMinutes} {t.min}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-sm font-extrabold text-white">
                  {formatPrice(service.priceUzs)}
                </span>
                <span className="block text-[10px] text-textSecondary uppercase font-medium">
                  {t.sum}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
