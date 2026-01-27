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

interface CatCanTableProps {
  catCans: CatCan[];
  searchQuery: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
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
}: {
  field: SortField;
  children: React.ReactNode;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}) {
  return (
    <th
      className="text-center transition-colors cursor-pointer table-th-base hover:bg-slate-700"
      onClick={() => onSort(field)}
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
}: CatCanTableProps) {
  return (
    <>
      {/* Table Container */}
      <div className="overflow-hidden bg-white max-w-[1280px] mx-auto border border-gray-200 shadow-2xl rounded-2xl">
        <div className="overflow-x-auto max-h-[800px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="table-thead">
              <tr>
                <th className="text-left table-th-sticky">產地</th>
                <th className="text-left table-th-base">品牌</th>
                {/* <th className="text-left table-th-base">
                  名稱
                </th> */}
                <th className="text-left table-th-base">口味</th>
                <SortableHeader
                  field="weight_g"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  重量(g)
                </SortableHeader>
                <SortableHeader
                  field="kcal"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  熱量(kcal)
                </SortableHeader>
                <SortableHeader
                  field="moistureContent"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  水分(ml)
                </SortableHeader>
                <SortableHeader
                  field="protein"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  蛋白質(%)
                </SortableHeader>
                <SortableHeader
                  field="fat"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  脂肪(%)
                </SortableHeader>
                <SortableHeader
                  field="Ca"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  鈣(%)
                </SortableHeader>
                <SortableHeader
                  field="P"
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={onSort}
                >
                  磷(%)
                </SortableHeader>
                <th className="text-center table-th-base">纖維(%)</th>
                <th className="text-center table-th-base">灰分(%)</th>
                <th className="text-center table-th-base ">牛磺酸(mg)</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {catCans.map((catCan, index) => (
                <tr key={index} className="table-tr">
                  <td className="table-td-sticky">{catCan.made}</td>
                  <td className="font-medium table-td-base">{catCan.brand}</td>
                  {/* <td className="table-td-base">
                    {catCan.name}
                  </td> */}
                  <td className="table-td-base">{catCan.flaver}</td>
                  <td className="table-td-center">{catCan.weight_g}</td>
                  <td className="table-td-center">{catCan.kcal}</td>
                  <td className="table-td-center text-slate-800">
                    {catCan.moistureContent}
                  </td>
                  <td className="table-td-center">{catCan.protein}</td>
                  <td className="table-td-center">{catCan.fat}</td>
                  <td className="table-td-center">{catCan.Ca}</td>
                  <td className="table-td-center">{catCan.P}</td>
                  <td className="table-td-center">{catCan.fiber}</td>
                  <td className="table-td-center">{catCan.ash}</td>
                  <td className="table-td-taurine">{catCan.taurineContent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-12 pb-4 text-sm font-bold text-center text-gray-500">
        <p>
          共 {catCans.length} 項產品
          {searchQuery && (
            <span className="ml-2 text-brand-red">(搜尋: "{searchQuery}")</span>
          )}
        </p>
      </div>
    </>
  );
}
