import { useState, useRef, useEffect } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'

interface MadeFilterProps {
  availableMades: string[]
  selectedMades: string[]
  onMadeChange: (mades: string[]) => void
}

export default function MadeFilter({ 
  availableMades, 
  selectedMades, 
  onMadeChange 
}: MadeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAllSelected = selectedMades.length === availableMades.length && availableMades.length > 0

  const handleToggleAll = () => {
    if (isAllSelected) {
      // 取消 All 時，自動選擇第一個選項
      if (availableMades.length > 0) {
        onMadeChange([availableMades[0]])
      } else {
        onMadeChange([])
      }
    } else {
      onMadeChange([...availableMades])
    }
  }

  const handleToggle = (made: string) => {
    if (selectedMades.includes(made)) {
      const newSelected = selectedMades.filter(m => m !== made)
      onMadeChange(newSelected)
    } else {
      const newSelected = [...selectedMades, made]
      // 如果选择了所有选项，自动全选
      if (newSelected.length === availableMades.length) {
        onMadeChange([...availableMades])
      } else {
        onMadeChange(newSelected)
      }
    }
  }

  const handleClearAll = () => {
    onMadeChange([])
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

  if (availableMades.length === 0) {
    return null
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 font-medium text-[#333333] transition-colors bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold"
      >
        <span>
          {isAllSelected
            ? '產地'
            : selectedMades.length > 0 
            ? selectedMades.join(', ')
            : '選擇產地'}
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
        <div className="absolute z-50 w-64 mt-2 overflow-y-auto bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-64">
          <div className="p-2">
            {/* All 選項 */}
            <label
              className="flex items-center px-3 py-2 font-medium text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
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
            <div className="my-1 border-t border-gray-200"></div>
            {availableMades.map((made) => {
              const isSelected = selectedMades.includes(made)
              return (
                <label
                  key={made}
                  className="flex items-center px-3 py-2 text-[#333333] transition-colors rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(made)}
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
                  <span className="ml-3">{made}</span>
                </label>
              )
            })}
          </div>
          {selectedMades.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleClearAll}
                className="w-full px-3 py-2 font-medium text-[#333333] transition-colors bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50"
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
