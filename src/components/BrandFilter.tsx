import { useState, useRef, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface BrandFilterProps {
  availableBrands: string[];
  selectedBrands: string[];
  onBrandChange: (brands: string[]) => void;
}

export default function BrandFilter({
  availableBrands,
  selectedBrands,
  onBrandChange,
}: BrandFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllSelected =
    selectedBrands.length === availableBrands.length &&
    availableBrands.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 取消 All 時，自動選擇第一個選項
      if (availableBrands.length > 0) {
        onBrandChange([availableBrands[0]]);
      } else {
        onBrandChange([]);
      }
    } else {
      onBrandChange([...availableBrands]);
    }
  };

  const handleToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      const newSelected = selectedBrands.filter((b) => b !== brand);
      onBrandChange(newSelected);
    } else {
      const newSelected = [...selectedBrands, brand];
      // 如果选择了所有选项，自动全选
      if (newSelected.length === availableBrands.length) {
        onBrandChange([...availableBrands]);
      } else {
        onBrandChange(newSelected);
      }
    }
  };

  const handleClearAll = () => {
    onBrandChange([]);
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

  if (availableBrands.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        id="brand-filter-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        {...(isOpen
          ? { "aria-expanded": "true" }
          : { "aria-expanded": "false" })}
        aria-haspopup="true"
        aria-controls="brand-filter-menu"
        className="filter-trigger"
      >
        <span className="flex-1 text-left truncate">
          {isAllSelected
            ? "品牌"
            : selectedBrands.length > 0
              ? selectedBrands.join(", ")
              : "選擇品牌"}
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
          id="brand-filter-menu"
          role="group"
          aria-labelledby="brand-filter-button"
          className="filter-dropdown max-h-64"
        >
          <div className="p-2">
            {/* All 選項 */}
            <label className="filter-option">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleAll}
                  className="sr-only"
                />
                <div
                  className={`filter-checkbox ${
                    isAllSelected
                      ? "filter-checkbox-checked"
                      : "filter-checkbox-unchecked"
                  }`}
                >
                  {isAllSelected && (
                    <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3">All</span>
            </label>
            <div className="dropdown-divider" />
            {availableBrands.map((brand) => {
              const isSelected = selectedBrands.includes(brand);
              return (
                <label key={brand} className="filter-option-item">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(brand)}
                      className="sr-only"
                    />
                    <div
                      className={`filter-checkbox ${
                        isSelected
                          ? "filter-checkbox-checked"
                          : "filter-checkbox-unchecked"
                      }`}
                    >
                      {isSelected && (
                        <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3">{brand}</span>
                </label>
              );
            })}
          </div>
          {selectedBrands.length > 0 && (
            <div className="dropdown-footer-border">
              <button
                type="button"
                onClick={handleClearAll}
                className="filter-clear-btn"
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
