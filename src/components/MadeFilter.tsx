import { useState, useRef, useEffect } from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface MadeFilterProps {
  availableMades: string[];
  selectedMades: string[];
  onMadeChange: (mades: string[]) => void;
}

export default function MadeFilter({
  availableMades,
  selectedMades,
  onMadeChange,
}: MadeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAllSelected =
    selectedMades.length === availableMades.length && availableMades.length > 0;

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 取消 All 時，自動選擇第一個選項
      if (availableMades.length > 0) {
        onMadeChange([availableMades[0]]);
      } else {
        onMadeChange([]);
      }
    } else {
      onMadeChange([...availableMades]);
    }
  };

  const handleToggle = (made: string) => {
    if (selectedMades.includes(made)) {
      const newSelected = selectedMades.filter((m) => m !== made);
      onMadeChange(newSelected);
    } else {
      const newSelected = [...selectedMades, made];
      // 如果选择了所有选项，自动全选
      if (newSelected.length === availableMades.length) {
        onMadeChange([...availableMades]);
      } else {
        onMadeChange(newSelected);
      }
    }
  };

  const handleClearAll = () => {
    onMadeChange([]);
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

  if (availableMades.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        id="made-filter-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        {...(isOpen
          ? { "aria-expanded": "true" }
          : { "aria-expanded": "false" })}
        aria-haspopup="true"
        aria-controls="made-filter-menu"
        className="filter-trigger"
      >
        <span className="flex-1 text-left truncate">
          {isAllSelected
            ? "產地"
            : selectedMades.length > 0
              ? selectedMades.join(", ")
              : "選擇產地"}
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
          id="made-filter-menu"
          role="group"
          aria-labelledby="made-filter-button"
          className="filter-dropdown md:w-40 max-h-64"
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
            {availableMades.map((made) => {
              const isSelected = selectedMades.includes(made);
              return (
                <label key={made} className="filter-option-item">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(made)}
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
                  <span className="ml-3">{made}</span>
                </label>
              );
            })}
          </div>
          {selectedMades.length > 0 && (
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
