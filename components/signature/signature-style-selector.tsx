'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SignatureStyle {
  id: string
  name: string
  preview: string
}

interface SignatureStyleSelectorProps {
  styles: SignatureStyle[]
  selectedStyle: string
  onSelect: (styleId: string) => void
}

export function SignatureStyleSelector({
  styles,
  selectedStyle,
  onSelect,
}: SignatureStyleSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Signature Styles</h3>
      <div className="grid grid-cols-5 gap-3">
        {styles.map((style) => (
          <Card
            key={style.id}
            className={cn(
              'cursor-pointer transition-all hover:border-indigo-500',
              selectedStyle === style.id && 'border-indigo-600 border-2'
            )}
            onClick={() => onSelect(style.id)}
          >
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-medium mb-2">{style.preview}</div>
              <div className="text-xs text-gray-600">{style.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

