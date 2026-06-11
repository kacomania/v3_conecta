'use client'

import { useState } from 'react'

export function ImageModal({ url, alt = 'Imagem', className = '' }: { url: string, alt?: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Thumbnail */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer transition hover:opacity-80 ${className}`}
      />

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative max-h-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -right-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow hover:bg-gray-200"
            >
              ✕
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={url} 
              alt={alt} 
              className="max-h-[85vh] w-auto rounded object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
