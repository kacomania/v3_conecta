'use client'

import dynamic from 'next/dynamic'

const PublicMapView = dynamic(() => import('./PublicMapView'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-100 rounded-xl">Carregando mapa público...</div>,
})

type Pin = {
  id: string
  latitude: number
  longitude: number
  categoria: string
}

type Props = {
  pins: Pin[]
  primaryColor?: string
}

export default function PublicMap({ pins, primaryColor }: Props) {
  return <PublicMapView pins={pins} primaryColor={primaryColor} />
}
