import { useState, useRef, useEffect } from "react";
import { AdjustmentsVerticalIcon, CheckIcon } from "@heroicons/react/24/solid";
import { TABLE_COLUMNS } from "./CatCanTable";

interface TableFilterProps {
  visibleColumns: Record<string, boolean>;
  onColumnsChange: (next: Record<string, boolean>) => void;
}

export default function TableFilter({
  visibleColumns,
  onColumnsChange,
}: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const visibleCount =
    1 +
    TABLE_COLUMNS.filter(
      (col) => col.id !== "flaver" && visibleColumns[col.id] !== false,
    ).length;

  const isAllVisible = TABLE_COLUMNS.filter((col) => col.id !== "flaver").every(
    (col) => visibleColumns[col.id] !== false,
  );

  const handleToggle = (id: string) => {
    onColumnsChange({
      ...visibleColumns,
      [id]: visibleColumns[id] === false,
    });
  };

  const handleSelectAll = () => {
    onColumnsChange(
      Object.fromEntries(TABLE_COLUMNS.map((col) => [col.id, true])),
    );
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        id="table-filter-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        {...(isOpen
          ? { "aria-expanded": "true" }
          : { "aria-expanded": "false" })}
        aria-haspopup="true"
        aria-controls="table-filter-menu"
        className="flex items-center justify-between w-full h-full px-4 py-3 font-medium text-[#333333] border-2 rounded-md border-slate-400 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:border-slate-600"
      >
        <span className="flex-1 text-left truncate">設定</span>
        <AdjustmentsVerticalIcon className="w-6 h-6 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="table-filter-menu"
          role="group"
          aria-labelledby="table-filter-button"
          className="absolute right-0 z-50 w-full mt-2 overflow-y-auto bg-white border-2 rounded-lg shadow-lg md:w-64 border-slate-400 max-h-80"
        >
          <div className="p-2">
            {/* 全選：樣式同 WeightFilter 的 All */}
            <label
              className="flex items-center px-3 py-2 font-medium text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
              onClick={handleSelectAll}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  checked={isAllVisible}
                  onChange={() => {}}
                  className="sr-only"
                  readOnly
                />
                <div
                  className={`relative w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                    isAllVisible
                      ? "bg-slate-600 border-slate-600"
                      : "border-slate-400 bg-white"
                  }`}
                >
                  {isAllVisible && (
                    <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3">全選</span>
            </label>
            <div className="my-1 border-t border-primary-dark/50" />
            {TABLE_COLUMNS.filter((col) => col.id !== "flaver").map((col) => {
              const checked = visibleColumns[col.id] !== false;
              return (
                <label
                  key={col.id}
                  className="flex items-center px-3 py-2 text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(col.id)}
                      className="sr-only"
                    />
                    <div
                      className={`relative w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                        checked
                          ? "bg-slate-600 border-slate-600"
                          : "border-slate-400 bg-white"
                      }`}
                    >
                      {checked && (
                        <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3 ">{col.label}</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-center px-4 py-3 text-sm border-t border-gray-200 text-slate-500">
            顯示 {visibleCount} / {TABLE_COLUMNS.length}
          </div>
        </div>
      )}
    </div>
  );
}
