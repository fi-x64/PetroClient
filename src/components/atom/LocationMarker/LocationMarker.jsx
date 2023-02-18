import React, { useTransition } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import wait from '../../../utils/wait'

function LocationMarker({
  toggleAddPane,
  togglePane,
  setCurrentStation,
  point,
}) {
  const [isPending, startTransition] = useTransition()
  const map = useMap()
  return (
    <Marker
      eventHandlers={{
        click: (e) => {
          map.flyTo(e.latlng, map.getZoom())
          toggleAddPane(false)
          togglePane(false)
          startTransition(() => {
            setCurrentStation(point)
            togglePane(true)
          })
        },
      }}
      position={[point.latitude, point.longitude]}
    >
      <Popup>
        Lat: {point.latitude}, Long: {point.longitude}
      </Popup>
    </Marker>
  )
}

export default LocationMarker
