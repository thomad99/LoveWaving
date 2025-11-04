'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { Search, SortAsc, SortDesc, X } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  location: string | null
  isActive: boolean
  waiver: {
    id: string
    title: string
  } | null
  _count: {
    waiverSignatures: number
  }
}

interface EventsListProps {
  events: Event[]
}

type SortOrder = 'soonest' | 'furthest'

export function EventsList({ events }: EventsListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('soonest')
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  // Convert date strings to Date objects if needed
  const processedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      startDate: event.startDate instanceof Date ? event.startDate : new Date(event.startDate),
    }))
  }, [events])

  // Filter events based on search query (wildcard support)
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) {
      return processedEvents
    }

    const query = searchQuery.toLowerCase()
    // Convert wildcard * to regex .* for pattern matching
    const regexPattern = query.replace(/\*/g, '.*')
    const regex = new RegExp(regexPattern, 'i')

    return processedEvents.filter((event: Event) => {
      const title = event.title.toLowerCase()
      const description = event.description?.toLowerCase() || ''
      const location = event.location?.toLowerCase() || ''
      
      return regex.test(title) || regex.test(description) || regex.test(location)
    })
  }, [processedEvents, searchQuery])

  // Sort events by date
  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents].sort((a, b) => {
      const dateA = a.startDate.getTime()
      const dateB = b.startDate.getTime()
      
      if (sortOrder === 'soonest') {
        return dateA - dateB // Ascending (soonest first)
      } else {
        return dateB - dateA // Descending (furthest first)
      }
    })
    
    return sorted
  }, [filteredEvents, sortOrder])

  // Get autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) {
      return []
    }

    const query = searchQuery.toLowerCase()
    const suggestions = new Set<string>()
    
    processedEvents.forEach((event: Event) => {
      const title = event.title.toLowerCase()
      if (title.includes(query) && title !== query) {
        // Find the matching part and suggest the full title
        suggestions.add(event.title)
      }
    })
    
    return Array.from(suggestions).slice(0, 5) // Limit to 5 suggestions
  }, [processedEvents, searchQuery])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowAutocomplete(value.length > 0 && autocompleteSuggestions.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowAutocomplete(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setShowAutocomplete(false)
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No events yet. Create your first event to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Input with Autocomplete */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search events by name, description, or location (use * for wildcard)..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowAutocomplete(searchQuery.length > 0 && autocompleteSuggestions.length > 0)}
                  onBlur={() => {
                    // Delay hiding autocomplete to allow clicks
                    setTimeout(() => setShowAutocomplete(false), 200)
                  }}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Autocomplete Dropdown */}
              {showAutocomplete && autocompleteSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {autocompleteSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by date:</span>
              <Button
                variant={sortOrder === 'soonest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('soonest')}
                className="flex items-center gap-1"
              >
                <SortAsc className="h-4 w-4" />
                Soonest First
              </Button>
              <Button
                variant={sortOrder === 'furthest' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortOrder('furthest')}
                className="flex items-center gap-1"
              >
                <SortDesc className="h-4 w-4" />
                Furthest First
              </Button>
            </div>

            {/* Results Count */}
            {searchQuery && (
              <div className="text-sm text-gray-500">
                Found {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {sortedEvents.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              No events match your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {event.title}
                    {event.isActive ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(event.startDate), 'PPP')}
                    {event.location && ` • ${event.location}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {event.waiver ? (
                    <span>Waiver: {event.waiver.title}</span>
                  ) : (
                    <span className="text-yellow-600">No waiver attached</span>
                  )}
                  <span className="mx-2">•</span>
                  <span>{event._count.waiverSignatures} signatures</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/events/${event.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                  <Link href={`/admin/events/${event.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

