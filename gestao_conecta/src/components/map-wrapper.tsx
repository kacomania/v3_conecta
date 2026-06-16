'use client'

import dynamic from 'next/dynamic'
import { OccurrenceDetail } from '@/actions/chamados'

/**
 * Importação dinâmica do mapa (Leaflet) para isolamento do Server-Side Rendering.
 * 
 * **Workaround Arquitetural Obrigatório:** A biblioteca react-leaflet (e o Leaflet core) faz uso de
 * referências globais exclusivas do navegador (como `window` e `document`). Se tentar renderizar no servidor
 * (Node.js), a aplicação Next.js quebra (ReferenceError). Utilizar `next/dynamic` com `ssr: false` garante
 * que o componente só seja montado no cliente, substituindo a renderização inicial por um esqueleto (loading).
 */
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
