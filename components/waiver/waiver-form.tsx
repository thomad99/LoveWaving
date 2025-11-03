'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export interface FormField {
  name: string
  type: 'text' | 'date' | 'checkbox' | 'signature' | 'select'
  value?: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

interface WaiverFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, string | boolean>) => void
  onCancel: () => void
  loading?: boolean
}

export function WaiverForm({ fields, onSubmit, onCancel, loading }: WaiverFormProps) {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Group fields by category
  const groupedFields = {
    personal: fields.filter(f => ['fullName', 'firstName', 'lastName', 'skipper', 'sailor', 'parent'].includes(f.name)),
    contact: fields.filter(f => ['phone', 'email', 'address'].includes(f.name)),
    dates: fields.filter(f => f.type === 'date' || f.name.includes('date')),
    medical: fields.filter(f => ['medicalInfo'].includes(f.name)),
    emergency: fields.filter(f => ['emergencyName', 'emergencyPhone', 'emergencyAddress'].includes(f.name)),
    other: fields.filter(f => 
      !['fullName', 'firstName', 'lastName', 'skipper', 'sailor', 'parent', 'phone', 'email', 'address', 
        'medicalInfo', 'emergencyName', 'emergencyPhone', 'emergencyAddress'].includes(f.name) 
      && f.type !== 'date'
    ),
  }

  const renderField = (field: FormField) => {
    const value = formData[field.name] || ''
    
    switch (field.type) {
      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={field.name}
              checked={!!value}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              required={field.required}
            />
            <Label htmlFor={field.name}>{field.name}</Label>
          </div>
        )
      
      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              type="date"
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          </div>
        )
      
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <select
              id={field.name}
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select...</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )
      
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.name}</Label>
            <Input
              id={field.name}
              type="text"
              value={value as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          </div>
        )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {groupedFields.personal.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields.personal.map(renderField)}
          </div>
        </div>
      )}

      {groupedFields.contact.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields.contact.map(renderField)}
          </div>
        </div>
      )}

      {groupedFields.dates.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields.dates.map(renderField)}
          </div>
        </div>
      )}

      {groupedFields.medical.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Medical Information</h3>
          <div className="space-y-4">
            {groupedFields.medical.map(renderField)}
          </div>
        </div>
      )}

      {groupedFields.emergency.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupedFields.emergency.map(renderField)}
          </div>
        </div>
      )}

      {groupedFields.other.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <div className="space-y-4">
            {groupedFields.other.map(renderField)}
          </div>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Processing...' : 'Continue to Signature'}
        </Button>
      </div>
    </form>
  )
}

