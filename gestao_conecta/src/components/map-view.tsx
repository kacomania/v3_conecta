'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { OccurrenceDetail } from '@/actions/chamados'

const getCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  })
}

type Props = {
  occurrences: OccurrenceDetail[]
}

export default function MapView({ occurrences }: Props) {
  // If no occurrences, default to center of map (or center based on first occurrence)
  const defaultCenter: [number, number] = occurrences.length > 0 && occurrences[0].latitude && occurrences[0].longitude 
    ? [occurrences[0].latitude, occurrences[0].longitude] 
    : [-23.55052, -46.633308] // Default SP

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {occurrences.map((occ) => {
        if (!occ.latitude || !occ.longitude) return null
        const color = occ.prefeituras?.primary_color || '#003B73'
        return (
          <Marker key={occ.id} position={[occ.latitude, occ.longitude]} icon={getCustomIcon(color)}>
            <Popup>
              <strong>{occ.title}</strong><br />
              <span className="text-xs text-gray-500 font-semibold">{occ.prefeituras?.name || 'Prefeitura Desconhecida'}</span><br />
              Status: {occ.status}<br />
              {occ.description && (
                <p className="text-xs truncate max-w-xs">{occ.description}</p>
              )}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
