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
        className="filter-trigger-alt"
      >
        <span className="flex-1 text-left truncate">設定</span>
        <AdjustmentsVerticalIcon className="w-6 h-6 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="table-filter-menu"
          role="group"
          aria-labelledby="table-filter-button"
          className="filter-dropdown right-0 md:w-64 max-h-80"
        >
          <div className="p-2">
            <label className="filter-option" onClick={handleSelectAll}>
              <div className="relative flex items-center justify-center shrink-0">
                <input
                  type="checkbox"
                  checked={isAllVisible}
                  onChange={() => {}}
                  className="sr-only"
                  readOnly
                />
                <div
                  className={`filter-checkbox ${
                    isAllVisible
                      ? "filter-checkbox-checked"
                      : "filter-checkbox-unchecked"
                  }`}
                >
                  {isAllVisible && (
                    <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                  )}
                </div>
              </div>
              <span className="ml-3">全選</span>
            </label>
            <div className="dropdown-divider" />
            {TABLE_COLUMNS.filter((col) => col.id !== "flaver").map((col) => {
              const checked = visibleColumns[col.id] !== false;
              return (
                <label key={col.id} className="filter-option">
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggle(col.id)}
                      className="sr-only"
                    />
                    <div
                      className={`filter-checkbox ${
                        checked
                          ? "filter-checkbox-checked"
                          : "filter-checkbox-unchecked"
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
