'use client'

import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import { useMemo } from 'react'

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

// 1 grau de latitude é aprox 111.32 km.
// O raio do círculo é 250m (diâmetro = 500m). 20% do diâmetro = 100m.
// 100 metros equivalem a ~0.0009 graus.
const getRandomOffset = () => (Math.random() - 0.5) * 0.0018

export default function PublicMapView({ pins, primaryColor = '#0047AB' }: Props) {
  const obfuscatedPins = useMemo(() => {
    return pins.map(pin => ({
      ...pin,
      obfLat: pin.latitude ? pin.latitude + getRandomOffset() : pin.latitude,
      obfLng: pin.longitude ? pin.longitude + getRandomOffset() : pin.longitude
    }))
  }, [pins])

  const defaultCenter: [number, number] = obfuscatedPins.length > 0 && obfuscatedPins[0].obfLat && obfuscatedPins[0].obfLng 
    ? [obfuscatedPins[0].obfLat, obfuscatedPins[0].obfLng] 
    : [-23.55052, -46.633308]

  return (
    <MapContainer center={defaultCenter} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {obfuscatedPins.map((pin) => {
        if (!pin.obfLat || !pin.obfLng) return null
        return (
          <Circle 
            key={pin.id} 
            center={[pin.obfLat, pin.obfLng]} 
            radius={250}
            pathOptions={{
              color: primaryColor,
              fillColor: primaryColor,
              fillOpacity: 0.15,
              weight: 2
            }}
          >
            <Popup>
              <strong>Problema Resolvido</strong><br />
              <span className="text-sm font-medium text-slate-600">Categoria: {pin.categoria || 'Não informada'}</span>
            </Popup>
          </Circle>
        )
      })}
    </MapContainer>
  )
}
