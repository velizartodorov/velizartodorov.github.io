
import { Employment } from "./employment";
import { Type } from "./type";
import { useTranslation } from 'react-i18next';

const typeMap = {
  Startup: Type.Startup,
  Service: Type.Service,
  Consultancy: Type.Consultancy,
  Product: Type.Product,
  "Research & Development": Type.ResearchAndDevelopment
};

export function useEmployments(): Employment[] {
  const { t } = useTranslation();
  const data = t('employments:list', { returnObjects: true }) as any[];
  return data.map((e: any) => ({
    position: e.position,
    company: e.company,
    type: typeMap[e.type as keyof typeof typeMap],
    place: e.place,
    icon: e.icon,
    period:
      e.period && typeof e.period.start === 'string' && typeof e.period.end === 'string'
        ? { start: new Date(e.period.start), end: new Date(e.period.end) }
        : { start: new Date(), end: new Date() },
    description: e.description,
    references: Array.isArray(e.references) ? e.references : [],
  }));
}