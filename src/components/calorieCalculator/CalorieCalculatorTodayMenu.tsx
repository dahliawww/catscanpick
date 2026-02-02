import { useState, useRef, useEffect, useMemo } from "react";
import type { CatCan } from "../../types";
import { canLabel } from "./constants";

interface CalorieCalculatorTodayMenuProps {
  catCans: CatCan[];
  selectedCan: CatCan | null;
  setSelectedCan: (c: CatCan | null) => void;
  canSearchInput: string;
  setCanSearchInput: (v: string) => void;
  extraWater: string;
  setExtraWater: (v: string) => void;
  onAddConsumed: () => void;
  onOpenRemainingModal: () => void;
}

export default function CalorieCalculatorTodayMenu({
  catCans,
  selectedCan,
  setSelectedCan,
  canSearchInput,
  setCanSearchInput,
  extraWater,
  setExtraWater,
  onAddConsumed,
  onOpenRemainingModal,
}: CalorieCalculatorTodayMenuProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const q = canSearchInput.trim();
    if (!q) return [];
    return catCans
      .filter(
        (c) =>
          c.brand.includes(q) || c.name.includes(q) || c.flaver.includes(q),
      )
      .slice(0, 20);
  }, [catCans, canSearchInput]);

  const handleSelectCan = (c: CatCan) => {
    setSelectedCan(c);
    setCanSearchInput(canLabel(c));
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="pt-6 border-t-2 border-slate-200"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="space-y-3">
        <div className="relative" ref={suggestionsRef}>
          <label htmlFor="consumed-can-input" className="form-label-tight">
            選擇罐頭（輸入品牌、名稱或口味）
          </label>
          <input
            id="consumed-can-input"
            type="text"
            value={canSearchInput}
            onChange={(e) => {
              setCanSearchInput(e.target.value);
              setSelectedCan(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="輸入品牌、名稱或口味，例：品牌-名稱-口味"
            aria-label="選擇罐頭，輸入品牌、名稱或口味"
            title="選擇罐頭"
            className="input"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul
              className="suggestions-list"
              role="listbox"
              aria-label="罐頭建議列表"
              title="罐頭建議列表"
            >
              {suggestions.map((c) => (
                <li
                  key={`${c.brand}-${c.name}-${c.flaver}`}
                  role="option"
                  tabIndex={0}
                  onClick={() => handleSelectCan(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectCan(c);
                    }
                  }}
                  className="suggestion-item"
                >
                  {c.brand} - {c.name} - {c.flaver}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="consumed-kcal" className="form-label-tight">
              熱量 (kcal)
            </label>
            <input
              id="consumed-kcal"
              type="text"
              readOnly
              value={selectedCan ? selectedCan.kcal : ""}
              placeholder="選擇罐頭後自動帶入"
              aria-label="熱量 kcal，選擇罐頭後自動帶入"
              title="熱量 kcal"
              className="input-readonly"
            />
          </div>
          <div>
            <label htmlFor="consumed-ml" className="form-label-tight">
              水分 (ml)
            </label>
            <input
              id="consumed-ml"
              type="text"
              readOnly
              value={selectedCan ? selectedCan.moistureContent : ""}
              placeholder="選擇罐頭後自動帶入"
              aria-label="水分 ml，選擇罐頭後自動帶入"
              title="水分 ml"
              className="input-readonly"
            />
          </div>
          <div>
            <label htmlFor="extra-water" className="form-label-tight">
              額外飲水 (ml)
            </label>
            <input
              id="extra-water"
              type="number"
              min={0}
              step={1}
              value={extraWater}
              onChange={(e) => setExtraWater(e.target.value)}
              placeholder="0"
              aria-label="額外飲水 ml"
              title="額外飲水 ml"
              className="input"
            />
          </div>
        </div>
        <div className="flex justify-between w-full gap-3 pt-2">
          <button
            type="button"
            onClick={onAddConsumed}
            disabled={!selectedCan}
            className="w-1/2 btn-secondary-brand"
          >
            重新選擇
          </button>
          <button
            type="button"
            onClick={onOpenRemainingModal}
            className="w-1/2 btn-primary-slate py-3"
          >
            計算結果
          </button>
        </div>
      </div>
    </div>
  );
}
