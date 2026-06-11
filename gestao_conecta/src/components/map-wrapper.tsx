'use client'

import dynamic from 'next/dynamic'
import { OccurrenceDetail } from '@/actions/chamados'

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-gray-100 rounded-xl">Carregando mapa...</div>,
})

type Props = {
  occurrences: OccurrenceDetail[]
}

export function MapWrapper({ occurrences }: Props) {
  return <MapView occurrences={occurrences} />
}
