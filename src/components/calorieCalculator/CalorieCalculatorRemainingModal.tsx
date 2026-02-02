import { createPortal } from "react-dom";
import type { DailyCalorieResult } from "./utils";

interface CalorieCalculatorRemainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DailyCalorieResult | null;
  remainingKcal: number | null;
  remainingMl: number | null;
}

export default function CalorieCalculatorRemainingModal({
  isOpen,
  onClose,
  result,
  remainingKcal,
  remainingMl,
}: CalorieCalculatorRemainingModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="remaining-modal-title"
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 id="remaining-modal-title" className="modal-title">
          貓咪今天還差多少熱量與水分？
        </h2>
        {result != null && remainingKcal != null && remainingMl != null ? (
          <div className="space-y-3 text-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">熱量：</span>
              <span className="font-bold">
                {remainingKcal > 0
                  ? `還不足 ${remainingKcal.toFixed(0)} kcal`
                  : "已達標"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">水分：</span>
              <span className="font-bold">
                {remainingMl > 0
                  ? `還不足 ${remainingMl.toFixed(0)} ml`
                  : "已達標"}
              </span>
            </div>
            <p className="pt-2 text-sm text-slate-500">
              以每日最低需求（{result.minCalories} kcal / {result.minWater}{" "}
              ml）減去今日已攝取（罐頭＋額外飲水）計算
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            請先輸入貓咪體重以計算每日需求
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="btn-primary-slate-full"
        >
          關閉
        </button>
      </div>
    </div>,
    document.body,
  );
}
