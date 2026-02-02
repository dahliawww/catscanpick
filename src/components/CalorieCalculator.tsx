import { useState, useEffect, useMemo, useCallback } from "react";
import type { CatCan } from "../types";
import { DER_RANGES, type DERRange } from "./calorieCalculator/constants";
import {
  calculateDailyCalories,
  type DailyCalorieResult,
} from "./calorieCalculator/utils";
import CalorieCalculatorRemainingModal from "./calorieCalculator/CalorieCalculatorRemainingModal";
import CalorieCalculatorTodayMenu from "./calorieCalculator/CalorieCalculatorTodayMenu";

interface CalorieCalculatorProps {
  catCans: CatCan[];
}

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function CalorieCalculator({ catCans }: CalorieCalculatorProps) {
  const [weight, setWeight] = useState<string>(() => {
    const saved = localStorage.getItem("catWeight");
    return saved || "";
  });
  const [selectedDER, setSelectedDER] = useState<DERRange>(DER_RANGES[2]);
  const [canSearchInput, setCanSearchInput] = useState("");
  const [selectedCan, setSelectedCan] = useState<CatCan | null>(null);
  const [showRemainingModal, setShowRemainingModal] = useState(false);
  const [extraWater, setExtraWater] = useState<string>(() => {
    const saved = localStorage.getItem("calorieCalculatorExtraWater");
    return saved ?? "0";
  });
  const [todayConsumed, setTodayConsumed] = useState<CatCan[]>(() => {
    const saved = localStorage.getItem("calorieCalculatorTodayConsumed");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as
        | CatCan[]
        | { date: string; data: CatCan[] };
      if (Array.isArray(parsed)) return [];
      if (
        parsed &&
        typeof parsed.date === "string" &&
        Array.isArray(parsed.data)
      )
        return parsed.date === todayKey() ? parsed.data : [];
      return [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (weight) localStorage.setItem("catWeight", weight);
  }, [weight]);

  useEffect(() => {
    localStorage.setItem(
      "calorieCalculatorTodayConsumed",
      JSON.stringify({ date: todayKey(), data: todayConsumed }),
    );
  }, [todayConsumed]);

  useEffect(() => {
    localStorage.setItem("calorieCalculatorExtraWater", extraWater);
  }, [extraWater]);

  const handleSubmitConsumed = useCallback(() => {
    setTodayConsumed((prev) => {
      if (!selectedCan) return prev;
      return [...prev, selectedCan];
    });
    if (selectedCan) {
      setSelectedCan(null);
      setCanSearchInput("");
    }
  }, [selectedCan]);

  const result = useMemo(
    () => calculateDailyCalories(weight, selectedDER),
    [weight, selectedDER],
  );

  const openRemainingModal = useCallback(() => setShowRemainingModal(true), []);
  const closeRemainingModal = useCallback(
    () => setShowRemainingModal(false),
    [],
  );

  const extraWaterNum = parseFloat(extraWater) || 0;
  const currentCanKcal = selectedCan ? parseFloat(selectedCan.kcal) || 0 : 0;
  const currentCanMl = selectedCan
    ? parseFloat(selectedCan.moistureContent) || 0
    : 0;
  const totalUsedForRemainingKcal = currentCanKcal;
  const totalUsedForRemainingMl = currentCanMl + extraWaterNum;

  const remainingKcal =
    result != null
      ? Math.max(0, parseFloat(result.minCalories) - totalUsedForRemainingKcal)
      : null;
  const remainingMl =
    result != null
      ? Math.max(0, parseFloat(result.minWater) - totalUsedForRemainingMl)
      : null;

  return (
    <div className="mx-4 md:my-3">
      <div className="p-2 border-2 rounded-md shadow-xl bg-brand-pink border-slate-600">
        <div className="px-3 py-6 bg-white rounded-md md:p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="cat-weight" className="form-label">
                貓咪體重 (kg)
              </label>
              <input
                id="cat-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="例如: 4.5"
                step="0.1"
                min="0.1"
                aria-label="貓咪體重 kg"
                title="貓咪體重 kg"
                className="input"
              />
            </div>
            <div className="relative">
              <label htmlFor="der-select" className="form-label">
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
                className="input select-dropdown pr-10"
              >
                {DER_RANGES.map((range, index) => (
                  <option key={index} value={index}>
                    {range.label} (DER: {range.min}-{range.max})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="grid gap-4 pt-6"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <DailyNeedsBlocks
              result={result}
              onOpenRemaining={openRemainingModal}
            />

            {catCans.length > 0 && (
              <CalorieCalculatorTodayMenu
                catCans={catCans}
                selectedCan={selectedCan}
                setSelectedCan={setSelectedCan}
                canSearchInput={canSearchInput}
                setCanSearchInput={setCanSearchInput}
                extraWater={extraWater}
                setExtraWater={setExtraWater}
                onAddConsumed={handleSubmitConsumed}
                onOpenRemainingModal={openRemainingModal}
              />
            )}
          </div>
        </div>
      </div>

      <CalorieCalculatorRemainingModal
        isOpen={showRemainingModal}
        onClose={closeRemainingModal}
        result={result}
        remainingKcal={remainingKcal}
        remainingMl={remainingMl}
      />
    </div>
  );
}

function DailyNeedsBlocks({
  result,
  onOpenRemaining,
}: {
  result: DailyCalorieResult | null;
  onOpenRemaining: () => void;
}) {
  const openIfResult = () => result != null && onOpenRemaining();
  const openOnKey = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && result != null) {
      e.preventDefault();
      onOpenRemaining();
    }
  };

  return (
    <>
      <div
        className="card-clickable"
        role="button"
        tabIndex={0}
        onClick={openIfResult}
        onKeyDown={openOnKey}
        aria-label="每日熱量範圍，點擊可查看今日還需多少"
      >
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
      <div
        className="card-clickable"
        role="button"
        tabIndex={0}
        onClick={openIfResult}
        onKeyDown={openOnKey}
        aria-label="每日所需水分，點擊可查看今日還需多少"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-800 font-huninn">
            每日所需水分:
          </span>
          <span className="text-lg font-bold text-slate-800 font-huninn">
            {result ? `${result.minWater} - ${result.maxWater} ml` : "-"}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 font-huninn">
        點擊熱量或水分區塊、或下方「計算結果」按鈕可查看今日還需多少
      </p>
    </>
  );
}
