import { Employment } from "./employment";
import { Type } from "./type";
import enData from "./employments.en.json";

const typeMap = {
  Startup: Type.Startup,
  Service: Type.Service,
  Consultancy: Type.Consultancy,
  Product: Type.Product,
  "Research & Development": Type.ResearchAndDevelopment
};

export const employments: Employment[] = Object.values(enData.employments).map((e: any) => ({
  position: e.position,
  company: e.company,
  type: typeMap[e.type as keyof typeof typeMap],
  place: e.place,
  icon: e.icon,
  period: e.period && e.period.start && e.period.end
    ? { start: new Date(e.period.start), end: new Date(e.period.end) }
    : { start: new Date(), end: new Date() },
  description: e.description,
  references: e.references || [],
}));