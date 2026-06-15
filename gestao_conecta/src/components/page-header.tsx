import React from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 pb-4 border-b border-[#e4e2e1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-inter text-2xl font-bold text-primary">{title}</h1>
        {description && <p className="text-sm text-[#737781] mt-1">{description}</p>}
      </div>
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  )
}
