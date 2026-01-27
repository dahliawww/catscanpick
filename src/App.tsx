import { useState, useEffect } from "react";
import type { CatCan } from "./types";
import CalorieCalculator from "./components/CalorieCalculator";
import SearchBar from "./components/SearchBar";
import WeightFilter from "./components/WeightFilter";
import MadeFilter from "./components/MadeFilter";
import BrandFilter from "./components/BrandFilter";
import CatCanTable from "./components/CatCanTable";
import Header from "./partical/Header";
import Footer from "./partical/Footer";
import CatPawBackground from "./components/CatPawBackground";
import Loading from "./components/Loading";

// ============================================================================
// Types
// ============================================================================

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

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 解析 CSV 行，處理引號內的逗號
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());

  return result;
}

/**
 * 獲取唯一值並排序的輔助函數
 */
const getUniqueValues = <T,>(
  items: T[],
  key: (item: T) => string,
  sortFn?: (a: string, b: string) => number,
) => {
  return Array.from(new Set(items.map(key).filter((v) => v !== "-"))).sort(
    sortFn || ((a, b) => a.localeCompare(b)),
  );
};

// ============================================================================
// Main Component
// ============================================================================

function App() {
  // ============================================================================
  // State
  // ============================================================================

  const [catCans, setCatCans] = useState<CatCan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [selectedMades, setSelectedMades] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("weight_g");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showCalorieCalculator, setShowCalorieCalculator] = useState(false);

  // ============================================================================
  // Data Loading
  // ============================================================================

  useEffect(() => {
    fetch("/data/catcan-list1.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        const lines = text.trim().split("\n");
        if (lines.length <= 1) {
          console.warn("CSV file appears to be empty or has no data rows");
          setLoading(false);
          return;
        }

        const data: CatCan[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length < 14) {
            console.warn(`Row ${i} has insufficient columns:`, values);
            continue;
          }

          const weight = parseFloat(values[3]) || 0;
          const moisturePercent = parseFloat(values[9]) || 0;

          // 計算水分含量：水分(%) × 重量(g) ÷ 100 = 水分含量(ml)
          const moistureContent =
            weight > 0 && moisturePercent > 0
              ? ((moisturePercent * weight) / 100).toFixed(1)
              : "-";

          const catCan: CatCan = {
            made: values[13] || "-",
            brand: values[0] || "-",
            name: values[1] || "-",
            flaver: values[2] || "-",
            weight_g: values[3] || "-",
            kcal: values[4] || "-",
            protein: values[5] || "-",
            fat: values[6] || "-",
            fiber: values[7] || "-",
            ash: values[8] || "-",
            moisture: values[9] || "-",
            moistureContent: moistureContent,
            Ca: values[10] || "-",
            P: values[11] || "-",
            taurine: values[12] || "-",
            taurineContent: values[12] || "-",
          };
          data.push(catCan);
        }

        console.log(`Loaded ${data.length} cat can products`);
        setCatCans(data);

        // 預設全選所有選項
        const allWeights = getUniqueValues(
          data,
          (c) => c.weight_g,
          (a, b) => parseFloat(a) - parseFloat(b),
        );
        const allMades = getUniqueValues(data, (c) => c.made);
        const allBrands = getUniqueValues(data, (c) => c.brand);

        setSelectedWeights(allWeights);
        setSelectedMades(allMades);
        setSelectedBrands(allBrands);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading CSV:", error);
        setLoading(false);
      });
  }, []);

  // ============================================================================
  // Computed Values
  // ============================================================================

  // 獲取所有可用的選項（去重並排序）
  const availableWeights = getUniqueValues(
    catCans,
    (c) => c.weight_g,
    (a, b) => parseFloat(a) - parseFloat(b),
  );
  const availableMades = getUniqueValues(catCans, (c) => c.made);
  const availableBrands = getUniqueValues(catCans, (c) => c.brand);

  // ============================================================================
  // Filtering Logic
  // ============================================================================

  const filteredCatCans = catCans.filter((catCan) => {
    // 搜尋過濾
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        catCan.made.toLowerCase().includes(query) ||
        catCan.brand.toLowerCase().includes(query) ||
        catCan.name.toLowerCase().includes(query) ||
        catCan.flaver.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 重量篩選
    if (
      selectedWeights.length > 0 &&
      !selectedWeights.includes(catCan.weight_g)
    ) {
      return false;
    }

    // 產地篩選
    if (selectedMades.length > 0 && !selectedMades.includes(catCan.made)) {
      return false;
    }

    // 品牌篩選
    if (selectedBrands.length > 0 && !selectedBrands.includes(catCan.brand)) {
      return false;
    }

    return true;
  });

  // ============================================================================
  // Sorting Logic
  // ============================================================================

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 如果點擊同一個欄位，在升冪和降冪之間切換
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 點擊新欄位，設為降冪（最重的在前）
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedCatCans = [...filteredCatCans].sort((a, b) => {
    if (!sortField || !sortOrder) return 0;

    const getValue = (item: CatCan, field: SortField): number => {
      if (!field) return 0;
      const value = item[field];
      if (value === "-") return -1;
      const num = parseFloat(value);
      return isNaN(num) ? -1 : num;
    };

    const aValue = getValue(a, sortField);
    const bValue = getValue(b, sortField);

    if (aValue === -1 && bValue === -1) return 0;
    if (aValue === -1) return 1;
    if (bValue === -1) return -1;

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  // ============================================================================
  // Loading & Error States
  // ============================================================================

  if (loading) {
    return <Loading />;
  }

  if (catCans.length === 0 && !loading) {
    return (
      <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Header
            showCalorieCalculator={showCalorieCalculator}
            setShowCalorieCalculator={setShowCalorieCalculator}
          />
          <div className="py-12 text-center">
            <p className="text-xl text-gray-600">
              無法載入數據，請檢查 CSV 文件是否存在
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <>
      {/* Background */}
      <CatPawBackground />

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-[700px]">
        <Header
          showCalorieCalculator={showCalorieCalculator}
          setShowCalorieCalculator={setShowCalorieCalculator}
        />
      </div>

      {/* Calorie Calculator Section */}
      {showCalorieCalculator && (
        <div className="relative z-10 mt-4 md:mt-6 ">
          <div className="max-w-[700px] mx-auto">
            <div className="grid grid-cols-1">
              <div className="py-2">
                <CalorieCalculator />
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="relative z-10 py-6 md:mt-4 md:px-2">
        <div className="mx-auto max-w-[1280px]">
          {/* Filters Section */}
          <div className="max-w-[1280px] mb-6 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mx-auto px-4 ">
            {/* Search Bar */}
            <div className="w-full md:w-1/3">
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col w-full space-y-4 md:w-2/3 md:flex-row md:space-x-4 md:space-y-0">
              <MadeFilter
                availableMades={availableMades}
                selectedMades={selectedMades}
                onMadeChange={setSelectedMades}
              />
              <BrandFilter
                availableBrands={availableBrands}
                selectedBrands={selectedBrands}
                onBrandChange={setSelectedBrands}
              />
              <WeightFilter
                availableWeights={availableWeights}
                selectedWeights={selectedWeights}
                onWeightChange={setSelectedWeights}
              />
            </div>
          </div>

          {/* Table Section */}
          <div className="relative px-4">
            <CatCanTable
              catCans={sortedCatCans}
              searchQuery={searchQuery}
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="pt-1 pb-6 bg-brand-beige">
        <Footer />
      </div>
    </>
  );
}

export default App;
