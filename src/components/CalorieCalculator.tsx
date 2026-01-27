import { useState, useEffect } from "react";

interface DERRange {
  label: string;
  min: number;
  max: number;
}

const DER_RANGES: DERRange[] = [
  { label: "幼貓 (<4個月)", min: 2.5, max: 3.0 },
  { label: "幼貓 (4-12個月)", min: 2.0, max: 2.5 },
  { label: "成貓 (絕育)", min: 1.2, max: 1.4 },
  { label: "成貓 (未絕育)", min: 1.4, max: 1.6 },
  { label: "懷孕", min: 1.6, max: 2.0 },
  { label: "哺乳", min: 2.0, max: 6.0 },
  { label: "減重", min: 0.8, max: 1.0 },
  { label: "增重", min: 1.2, max: 1.8 },
];

export default function CalorieCalculator() {
  // 從 localStorage 讀取上次的體重，如果沒有則為空字串
  const [weight, setWeight] = useState<string>(() => {
    const savedWeight = localStorage.getItem("catWeight");
    return savedWeight || "";
  });
  const [selectedDER, setSelectedDER] = useState<DERRange>(DER_RANGES[2]); // 預設成貓絕育

  // 當體重改變時，儲存到 localStorage
  useEffect(() => {
    if (weight) {
      localStorage.setItem("catWeight", weight);
    }
  }, [weight]);

  // 計算 RER = 70 × 體重(kg)的0.75次方
  const calculateRER = (weightKg: number): number => {
    return 70 * Math.pow(weightKg, 0.75);
  };

  // 計算一天所需熱量範圍 = RER × DER
  // 計算一天所需水分 = 每公斤體重 × 40-60毫升
  const calculateDailyCalories = () => {
    const weightNum = parseFloat(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      return null;
    }

    const rer = calculateRER(weightNum);
    const minCalories = rer * selectedDER.min;
    const maxCalories = rer * selectedDER.max;

    // 計算水分需求：每公斤體重 × 40-60毫升
    const minWater = weightNum * 40;
    const maxWater = weightNum * 60;

    return {
      rer: rer.toFixed(1),
      minCalories: minCalories.toFixed(1),
      maxCalories: maxCalories.toFixed(1),
      minWater: minWater.toFixed(0),
      maxWater: maxWater.toFixed(0),
    };
  };

  const result = calculateDailyCalories();

  return (
    <div className="mx-4 md:my-3">
      <div className="p-2 border-2 rounded-md shadow-xl bg-brand-pink border-slate-600">
        <div className="px-3 py-6 bg-white rounded-md md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* 體重輸入 */}
            <div>
              <label
                htmlFor="cat-weight"
                className="block mb-2 text-sm font-medium text-slate-800 font-huninn"
              >
                貓咪體重 (kg)
              </label>
              <input
                id="cat-weight"
                type="number"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                }}
                placeholder="例如: 4.5"
                step="0.1"
                min="0.1"
                className="w-full p-3 transition-all duration-200 bg-white border-2 rounded-lg text-slate-800 border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow font-huninn"
              />
            </div>

            {/* DER 選擇 */}
            <div className="relative">
              <label
                htmlFor="der-select"
                className="block mb-2 text-sm font-medium text-slate-800 font-huninn"
              >
                貓咪狀態
              </label>
              <select
                id="der-select"
                value={DER_RANGES.findIndex(
                  (r) => r.label === selectedDER.label,
                )}
                onChange={(e) =>
                  setSelectedDER(DER_RANGES[parseInt(e.target.value)])
                }
                className="w-full p-3 pr-10 transition-all duration-200 bg-white border-2 rounded-lg select-dropdown text-slate-800 border-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow font-huninn"
              >
                {DER_RANGES.map((range, index) => (
                  <option key={index} value={index}>
                    {range.label} (DER: {range.min}-{range.max})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 計算結果 */}
          <div className="grid gap-4 pt-6">
            {/* 熱量需求 */}
            <div className="px-4 py-4 border-2 rounded-lg shadow-lg border-brand-yellow bg-brand-yellow/10">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 font-huninn">
                    RER (基礎代謝率):
                  </span>
                  <span className="text-sm font-semibold text-slate-800 font-huninn">
                    {result ? `${result.rer} kcal` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-800 font-huninn">
                    每日熱量範圍:
                  </span>
                  <span className="text-lg font-bold text-slate-800 font-huninn">
                    {result
                      ? `${result.minCalories} - ${result.maxCalories} kcal`
                      : "-"}
                  </span>
                </div>
              </div>
            </div>

            {/* 水分需求 */}
            <div className="px-4 py-4 border-2 rounded-lg shadow-lg border-brand-yellow bg-brand-yellow/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800 font-huninn">
                  每日所需水分:
                </span>
                <span className="text-lg font-bold text-slate-800 font-huninn">
                  {result ? `${result.minWater} - ${result.maxWater} ml` : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
