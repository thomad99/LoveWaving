'use client'

import * as React from 'react'
import { Toast, ToastProvider, ToastViewport } from '@radix-ui/react-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}

export { Toast } from '@radix-ui/react-toast'

