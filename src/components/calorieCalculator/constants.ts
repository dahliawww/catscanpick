import type { CatCan } from "../../types";

export interface DERRange {
  label: string;
  min: number;
  max: number;
}

export const DER_RANGES: DERRange[] = [
  { label: "幼貓 (<4個月)", min: 2.5, max: 3.0 },
  { label: "幼貓 (4-12個月)", min: 2.0, max: 2.5 },
  { label: "成貓 (絕育)", min: 1.2, max: 1.4 },
  { label: "成貓 (未絕育)", min: 1.4, max: 1.6 },
  { label: "懷孕", min: 1.6, max: 2.0 },
  { label: "哺乳", min: 2.0, max: 6.0 },
  { label: "減重", min: 0.8, max: 1.0 },
  { label: "增重", min: 1.2, max: 1.8 },
];

export function canLabel(c: CatCan): string {
  return `${c.brand} - ${c.name} (${c.flaver})`;
}
