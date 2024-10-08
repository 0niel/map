'use client'

import { Input } from '@/components/ui/input'
import { type SearchableObject } from '@/lib/map/MapData'
import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Label } from './ui/label'
interface MapObjectsSearchInputProps {
  onSubmit: (searchableObject: SearchableObject) => void
  onChange?: (data: string) => void
  label?: string
  placeholder?: string
  showSubmitButton: boolean
  submitButton?: string
  inputRef?: React.Ref<HTMLInputElement>
  searchResults: SearchableObject[]
  selected: SearchableObject | null
  initialSearch?: string
}

const MapObjectsSearchInput: React.FC<MapObjectsSearchInputProps> = ({
  label,
  placeholder,
  submitButton,
  showSubmitButton,
  onSubmit,
  onChange,
  selected,
  searchResults,
  inputRef,
  initialSearch
}) => {
  const [search, setSearch] = useState(selected?.mapObject.name ?? '')
  const [filteredResults, setFilteredResults] = useState<SearchableObject[]>([])
  const [showResults, setShowResults] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch)
    }
  }, [initialSearch])

  useEffect(() => {
    if (search.trim() === '') {
      setFilteredResults([])
      return
    }

    const results = searchResults.filter(result =>
      result.mapObject.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredResults(results)
    setShowResults(results.length > 0)
  }, [search, searchResults])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (result: SearchableObject) => {
    setShowResults(false)
    setSearch(result.mapObject.name)
    onSubmit(result)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    onChange?.(value)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && <Label htmlFor="default-search">{label}</Label>}
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          id="default-search"
          placeholder={placeholder ?? 'Поиск...'}
          className="w-full"
          autoComplete="off"
          required
          value={search}
          onChange={event => handleSearch(event.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
      </div>
      {showResults && (
        <div className="absolute z-10 w-full rounded-md border border-input bg-background py-2 shadow-lg">
          <ul className="max-h-[200px] overflow-y-auto">
            {filteredResults.length > 0 ? (
              filteredResults.map(result => (
                <li
                  key={result.mapObject.id}
                  className="cursor-pointer px-4 py-2 hover:bg-muted/50"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{result.mapObject.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.mapObject.description ?? ''}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.floor} этаж
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-700">Ничего не найдено.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MapObjectsSearchInput
