import { useState, useRef, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface WeightFilterProps {
  availableWeights: string[];
  selectedWeights: string[];
  onWeightChange: (weights: string[]) => void;
}

export default function WeightFilter({
  availableWeights,
  selectedWeights,
  onWeightChange,
}: WeightFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllSelected =
    selectedWeights.length === availableWeights.length &&
    availableWeights.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 取消 All 時，自動選擇第一個選項
      if (availableWeights.length > 0) {
        onWeightChange([availableWeights[0]]);
      } else {
        onWeightChange([]);
      }
    } else {
      onWeightChange([...availableWeights]);
    }
  };

  const handleToggle = (weight: string) => {
    if (selectedWeights.includes(weight)) {
      const newSelected = selectedWeights.filter((w) => w !== weight);
      onWeightChange(newSelected);
    } else {
      const newSelected = [...selectedWeights, weight];
      // 如果选择了所有选项，自动全选
      if (newSelected.length === availableWeights.length) {
        onWeightChange([...availableWeights]);
      } else {
        onWeightChange(newSelected);
      }
    }
  };

  const handleClearAll = () => {
    onWeightChange([]);
  };

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (availableWeights.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        id="weight-filter-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        {...(isOpen
          ? { "aria-expanded": "true" }
          : { "aria-expanded": "false" })}
        aria-haspopup="true"
        aria-controls="weight-filter-menu"
        className="flex items-center justify-between  w-full px-4 py-3 font-medium text-[#333333] transition-colors duration-200 bg-white border-2 border-slate-400 rounded-md hover:bg-gray-50 focus:outline-none focus:border-slate-600"
      >
        <span className="flex-1 text-left truncate">
          {isAllSelected
            ? "重量"
            : selectedWeights.length > 0
              ? selectedWeights.map((w) => `${w}g`).join(", ")
              : "選擇重量"}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="weight-filter-menu"
          role="group"
          aria-labelledby="weight-filter-button"
          className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border-2 rounded-lg shadow-lg md:w-40 border-slate-400 max-h-64"
        >
          <div className="p-2">
            {/* All 選項 */}
            <label className="flex items-center px-3 py-2 font-medium text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                    isAllSelected
                      ? "bg-slate-600 border-slate-600"
                      : "border-slate-400 bg-white"
                  }`}
                >
                  {isAllSelected && (
                    <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3">All</span>
            </label>
            <div className="my-1 border-t border-primary-dark/50"></div>
            {availableWeights.map((weight) => {
              const isSelected = selectedWeights.includes(weight);
              return (
                <label
                  key={weight}
                  className="flex items-center px-3 py-2 text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(weight)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-slate-600 border-slate-600"
                          : "border-slate-400 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3">{weight}g</span>
                </label>
              );
            })}
          </div>
          {selectedWeights.length > 0 && (
            <div className="p-2 border-t border-gray-400">
              <button
                type="button"
                onClick={handleClearAll}
                className="w-full px-3 py-2 font-medium text-[#333333] transition-colors bg-white border-2 border-gray-400 rounded-lg hover:bg-gray-100"
              >
                清除全部
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
