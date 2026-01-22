import { useState, useRef, useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'

interface BrandFilterProps {
  availableBrands: string[]
  selectedBrands: string[]
  onBrandChange: (brands: string[]) => void
}

export default function BrandFilter({ 
  availableBrands, 
  selectedBrands, 
  onBrandChange 
}: BrandFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAllSelected = selectedBrands.length === availableBrands.length && availableBrands.length > 0

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 取消 All 時，自動選擇第一個選項
      if (availableBrands.length > 0) {
        onBrandChange([availableBrands[0]])
      } else {
        onBrandChange([])
      }
    } else {
      onBrandChange([...availableBrands])
    }
  }

  const handleToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      const newSelected = selectedBrands.filter(b => b !== brand)
      onBrandChange(newSelected)
    } else {
      const newSelected = [...selectedBrands, brand]
      // 如果选择了所有选项，自动全选
      if (newSelected.length === availableBrands.length) {
        onBrandChange([...availableBrands])
      } else {
        onBrandChange(newSelected)
      }
    }
  }

  const handleClearAll = () => {
    onBrandChange([])
  }

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (availableBrands.length === 0) {
    return null
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-4 py-3 font-medium text-[#333333] transition-colors bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
          >
            <span>
              {isAllSelected
                ? '品牌'
                : selectedBrands.length > 0 
                ? selectedBrands.join(', ')
                : '選擇品牌'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-64 mt-2 overflow-y-auto bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 max-h-64">
              <div className="p-2">
                {/* All 選項 */}
                <label
                  className="flex items-center px-3 py-2 font-medium text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleAll}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                      isAllSelected 
                        ? 'bg-brand-gold border-brand-gold' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {isAllSelected && (
                        <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                      )}
                    </div>
                  </div>
                  <span className="ml-3">All</span>
                </label>
                <div className="my-1 border-t border-gray-200 dark:border-gray-600"></div>
                {availableBrands.map((brand) => {
                  const isSelected = selectedBrands.includes(brand)
                  return (
                    <label
                      key={brand}
                      className="flex items-center px-3 py-2 text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggle(brand)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-brand-gold border-brand-gold' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {isSelected && (
                            <CheckIcon className="absolute inset-0 w-3 h-3 m-auto text-white" />
                          )}
                        </div>
                      </div>
                      <span className="ml-3">{brand}</span>
                    </label>
                  )
                })}
              </div>
              {selectedBrands.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={handleClearAll}
                    className="w-full px-3 py-2 font-medium text-[#333333] transition-colors bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  >
                    清除全部
                  </button>
                </div>
              )}
            </div>
          )}
    </div>
  )
}
