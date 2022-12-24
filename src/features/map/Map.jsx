import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Pane from '../../components/molecule/Pane/Pane'
import TogglePane from './components/TogglePane'
import styles from './Map.module.scss'
import classNames from 'classnames/bind'
import { Button } from 'antd'
import AddPane from '../../components/molecule/Pane/AddPane'
import { getAllStaion } from '../../services/station'
import { useQuery } from '@tanstack/react-query'

const cl = classNames.bind(styles)

function Map() {
  const [showPane, togglePane] = useState(false)
  const [showAddPane, toggleAddPane] = useState(false)

  const [currentStation, setCurrentStation] = useState(null)

  const stationQuery = useQuery(['stations'], getAllStaion)
  console.log(stationQuery?.data)

  const [temporaryMarker, setTemporaryMarker] = useState(null)

  const addTemporaryMaker = (latlng) => {
    setTemporaryMarker(latlng)
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
        {stationQuery?.data?.map((x, i) => (
          <Marker
            key={i}
            eventHandlers={{
              click: (e) => {
                togglePane(true)
                setCurrentStation(x)
              },
            }}
            position={[x.latitude, x.longtitude]}
          >
            <Popup>
              Lat: {x.latitude}, Long: {x.longtitude}
            </Popup>
          </Marker>
        ))}
        {temporaryMarker && (
          <Marker
            draggable
            eventHandlers={{
              click: (e) => {
                togglePane(true)
              },
            }}
            position={x}
          >
            <Popup>
              Lat: {temporaryMarker[0]}, Long: {temporaryMarker[1]}
            </Popup>
          </Marker>
        )}
        <TogglePane
          toggle={(value) => togglePane(value)}
          markers={stationQuery?.data}
        ></TogglePane>
        <Pane
          data={currentStation}
          active={showPane}
          onClose={() => togglePane(false)}
          animateRef={animateRef}
          onGoToPosition={(latlng) => addTemporaryMaker(latlng)}
        ></Pane>
        <Button className={cl('add-btn')} onClick={() => toggleAddPane(true)}>
          Thêm mới
        </Button>
        <AddPane active={showAddPane} onClose={() => toggleAddPane(false)} />
      </MapContainer>
    </div>
  )
}

export default Map
