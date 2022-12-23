import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Pane from '../../components/molecule/Pane/Pane'
import TogglePane from './components/TogglePane'

function Map() {
  const [showPane, togglePane] = useState(false)
  const [markers, setMarkers] = useState([
    [10, 106.4],
    [11, 105.6],
  ])
  const [temporaryMarkers, setTemporaryMarkers] = useState([])

  const handleTogglePane = () => {
    togglePane((prev) => !prev)
  }

  const addTemporaryMaker = (latlng) => {
    setTemporaryMarkers((prev) => [...prev, latlng])
  }

  const animateRef = useRef(false)
  return (
    <div>
      <MapContainer
        style={{ width: '100%', height: '100vh' }}
        zoom={17}
        center={[10, 106.4]}
        scrollWheelZoom={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((x, i) => (
          <Marker
            key={i}
            eventHandlers={{
              click: (e) => {
                togglePane(true)
              },
            }}
            position={x}
          >
            <Popup>
              Lat: {x[0]}, Long: {x[1]}
            </Popup>
          </Marker>
        ))}
        {temporaryMarkers.map((x, i) => (
          <Marker
            draggable
            key={i}
            eventHandlers={{
              click: (e) => {
                togglePane(true)
              },
            }}
            position={x}
          >
            <Popup>
              Lat: {x[0]}, Long: {x[1]}
            </Popup>
          </Marker>
        ))}
        <TogglePane
          toggle={(value) => togglePane(value)}
          markers={markers}
        ></TogglePane>
        <Pane
          data={{ name: 'Petro', type: 'Cay xang' }}
          active={showPane}
          onClose={() => togglePane(false)}
          animateRef={animateRef}
          onGoToPosition={(latlng) => addTemporaryMaker(latlng)}
        ></Pane>
      </MapContainer>
    </div>
  )
}

export default Map
