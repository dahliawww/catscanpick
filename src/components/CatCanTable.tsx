import type { CatCan } from "../types";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

type SortField =
  | "weight_g"
  | "kcal"
  | "moistureContent"
  | "protein"
  | "fat"
  | "Ca"
  | "P"
  | null;
type SortOrder = "asc" | "desc" | null;

/** 表格欄位設定，供 TableFilter 與表格渲染共用 */
export const TABLE_COLUMNS = [
  { id: "flaver", label: "口味", sticky: true },
  { id: "brand", label: "品牌" },
  { id: "name", label: "名稱" },
  { id: "made", label: "產地" },
  {
    id: "weight_g",
    label: "重量(g)",
    sortField: "weight_g" as SortField,
    sortAriaLabel: "依重量排序",
  },
  {
    id: "kcal",
    label: "熱量(kcal)",
    sortField: "kcal" as SortField,
    sortAriaLabel: "依熱量排序",
  },
  {
    id: "moistureContent",
    label: "水分(ml)",
    sortField: "moistureContent" as SortField,
    sortAriaLabel: "依水分含量排序",
  },
  {
    id: "protein",
    label: "粗蛋白質(%)",
    sortField: "protein" as SortField,
    sortAriaLabel: "依粗蛋白質排序",
  },
  {
    id: "fat",
    label: "粗脂肪(%)",
    sortField: "fat" as SortField,
    sortAriaLabel: "依粗脂肪排序",
  },
  {
    id: "Ca",
    label: "鈣(%)",
    sortField: "Ca" as SortField,
    sortAriaLabel: "依鈣排序",
  },
  {
    id: "P",
    label: "磷(%)",
    sortField: "P" as SortField,
    sortAriaLabel: "依磷排序",
  },
  { id: "fiber", label: "粗纖維(%)" },
  { id: "ash", label: "灰分(%)" },
  { id: "taurineContent", label: "牛磺酸(mg)" },
] as const;

export type TableColumnId = (typeof TABLE_COLUMNS)[number]["id"];

interface CatCanTableProps {
  catCans: CatCan[];
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  visibleColumns: Record<string, boolean>;
}

// 排序圖標組件
function SortIcon({
  field,
  sortField,
  sortOrder,
}: {
  field: SortField;
  sortField: SortField;
  sortOrder: SortOrder;
}) {
  if (sortField !== field) {
    // 未排序狀態 - 顯示上下箭頭
    return <ArrowsUpDownIcon className="inline-block w-4 h-4 ml-1" />;
  }
  if (sortOrder === "asc") {
    // 升冪 - 向上箭頭
    return <ChevronUpIcon className="inline-block w-4 h-4 ml-1" />;
  } else {
    // 降冪 - 向下箭頭
    return <ChevronDownIcon className="inline-block w-4 h-4 ml-1" />;
  }
}

// 可排序的表頭
function SortableHeader({
  field,
  children,
  sortField,
  sortOrder,
  onSort,
  ariaLabel,
}: {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  ariaLabel: string;
}) {
  const sortState =
    sortField !== field
      ? "可點擊排序"
      : sortOrder === "asc"
        ? "目前為升冪，點擊改為降冪"
        : "目前為降冪，點擊改為升冪";
  return (
    <th
      scope="col"
      className="text-center transition-colors cursor-pointer table-th-base hover:bg-slate-700"
      onClick={() => onSort(field)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSort(field);
        }
      }}
      aria-label={`${ariaLabel}，${sortState}`}
    >
      <div className="flex items-center justify-center">
        {children}
        <SortIcon field={field} sortField={sortField} sortOrder={sortOrder} />
      </div>
    </th>
  );
}

export default function CatCanTable({
  catCans,
  searchQuery,
  sortField,
  sortOrder,
  onSort,
  visibleColumns,
}: CatCanTableProps) {
  const visibleCols = TABLE_COLUMNS.filter(
    (col) => col.id === "flaver" || visibleColumns[col.id] !== false,
  );

  return (
    <>
      {/* Table Container */}
      <div className="overflow-hidden bg-white max-w-[1280px] mx-auto border border-gray-200 shadow-2xl rounded-2xl">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full border-collapse">
            <caption className="sr-only">
              貓罐頭營養成分比較表 -
              包含品牌、口味、產地、蛋白質、脂肪、熱量、鈣與磷含量分析
            </caption>
            <thead className="table-thead">
              <tr>
                {visibleCols.map((col) => {
                  if ("sortField" in col && col.sortField) {
                    return (
                      <SortableHeader
                        key={col.id}
                        field={col.sortField}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={onSort}
                        ariaLabel={col.sortAriaLabel ?? ""}
                      >
                        {col.label}
                      </SortableHeader>
                    );
                  }
                  const isLeftAlign =
                    col.id === "brand" ||
                    col.id === "name" ||
                    col.id === "made";
                  return (
                    <th
                      key={col.id}
                      scope="col"
                      className={
                        "sticky" in col && col.sticky
                          ? "text-left table-th-sticky"
                          : isLeftAlign
                            ? "text-left table-th-base"
                            : "text-center table-th-base"
                      }
                    >
                      {col.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="table-tbody">
              {catCans.map((catCan, index) => (
                <tr key={index} className="table-tr">
                  {visibleCols.map((col) => {
                    const value =
                      col.id === "moistureContent"
                        ? catCan.moistureContent
                        : catCan[col.id as keyof CatCan];
                    const isSticky = "sticky" in col && col.sticky;
                    if (isSticky) {
                      return (
                        <th
                          key={col.id}
                          scope="row"
                          className="font-normal text-left table-td-sticky"
                        >
                          {String(value ?? "")}
                        </th>
                      );
                    }
                    const tdClass =
                      col.id === "brand"
                        ? "font-medium table-td-base"
                        : col.id === "name" || col.id === "made"
                          ? "table-td-base"
                          : col.id === "taurineContent"
                            ? "table-td-taurine"
                            : col.id === "moistureContent"
                              ? "table-td-center text-slate-800"
                              : "table-td-center";
                    return (
                      <td key={col.id} className={tdClass}>
                        {String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-12 pb-4 text-base font-bold text-center text-gray-500">
        <p>
          共 {catCans.length} 項產品
          {searchQuery && (
            <span className="ml-2 text-slate-800">(搜尋: "{searchQuery}")</span>
          )}
        </p>
      </div>
    </>
  );
}
