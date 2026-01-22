import { XMarkIcon,MagnifyingGlassIcon } from "@heroicons/react/24/solid"

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function SearchBar({ searchQuery, onSearchChange }: SearchBarProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜尋產地、品牌、名稱或口味..."
          className="w-full py-3 pl-12 pr-4 text-[#333333] transition-all duration-200 bg-white border-2 border-gray-300 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:ring-brand-gold dark:focus:border-brand-gold"
        />
        <div className="absolute z-10 -translate-y-1/2 pointer-events-none left-3 top-1/2">
          <MagnifyingGlassIcon className="w-5 h-5" />
            
        </div>
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute z-10 text-gray-400 transition-colors -translate-y-1/2 right-3 top-1/2 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="清除搜尋"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}
