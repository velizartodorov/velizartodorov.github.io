import { Employment } from "./employment";
import { Type } from "./type";
import enData from "./lang.en.json";

// Helper to map string to Type enum
const typeMap = {
  Startup: Type.Startup,
  Service: Type.Service,
  Consultancy: Type.Consultancy,
  Product: Type.Product,
  "Research & Development": Type.ResearchAndDevelopment
};

// Map the JSON structure to the Employment type
export const employments: Employment[] = Object.values(enData.employments).map((e: any) => ({
  position: e.position,
  company: e.company,
  type: typeMap[e.type as keyof typeof typeMap],
  place: e.place,
  icon: e.icon,
  period: e.period && e.period.start && e.period.end
    ? { start: new Date(e.period.start), end: new Date(e.period.end) }
    : { start: new Date(), end: new Date() }, // fallback to now if missing
  description: e.description,
  references: e.references || [],
}));