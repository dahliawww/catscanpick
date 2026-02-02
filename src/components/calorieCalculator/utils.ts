import type { DERRange } from "./constants";

/** RER（靜態能量需求）= 70 × 體重(kg)^0.75，單位 kcal/天 */
export function calculateRER(weightKg: number): number {
  return 70 * Math.pow(weightKg, 0.75);
}

export interface DailyCalorieResult {
  rer: string;
  minCalories: string;
  maxCalories: string;
  minWater: string;
  maxWater: string;
}

/**
 * 每日熱量 = RER × DER
 * 每日水分 = 每公斤體重 × 40-60毫升
 */
export function calculateDailyCalories(
  weight: string,
  selectedDER: DERRange,
): DailyCalorieResult | null {
  const weightNum = parseFloat(weight);
  if (!weight || isNaN(weightNum) || weightNum <= 0) {
    return null;
  }

  const rer = calculateRER(weightNum);
  const minCalories = rer * selectedDER.min;
  const maxCalories = rer * selectedDER.max;
  const minWater = weightNum * 40;
  const maxWater = weightNum * 60;

  return {
    rer: rer.toFixed(1),
    minCalories: minCalories.toFixed(1),
    maxCalories: maxCalories.toFixed(1),
    minWater: minWater.toFixed(0),
    maxWater: maxWater.toFixed(0),
  };
}
