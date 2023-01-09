import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Pane from '../../components/molecule/Pane/Pane'
import TogglePane from './components/TogglePane'
import styles from './Map.module.scss'
import classNames from 'classnames/bind'
import { Button } from 'antd'
import { getAllStaion } from '../../services/station'
import { useQuery } from '@tanstack/react-query'
import EditPane from '../../components/molecule/EditPane/EditPane'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../services/auth.service'

const cl = classNames.bind(styles)

function Map() {
  let navigate = useNavigate()
  const temporaryMarkerRef = useRef(null)
  const { user: currentUser } = useSelector((state) => state.auth)

  const [showPane, togglePane] = useState(false)
  const [showAddPane, toggleAddPane] = useState(false)
  const [currentStation, setCurrentStation] = useState(null)
  const [temporaryMarker, setTemporaryMarker] = useState(null)

  const stationQuery = useQuery(['stations'], getAllStaion)

  const dispatch = useDispatch()

  const addTemporaryMaker = (latlng) => {
    setTemporaryMarker(latlng)
  }

  const handleToggleEditStation = () => {
    console.log(currentStation)
    togglePane(false)
    toggleAddPane(true)
    // setCurrentStation(data)
  }

  const handleLogout = () => {
    dispatch(logout)
    navigate('/')
    window.location.reload()
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
                toggleAddPane(false)
                togglePane(true)
                setCurrentStation(x)
              },
            }}
            position={[x.latitude, x.longitude]}
          >
            <Popup>
              Lat: {x.latitude}, Long: {x.longitude}
            </Popup>
          </Marker>
        ))}
        {temporaryMarker !== null && (
          <Marker
            draggable
            ref={temporaryMarkerRef}
            eventHandlers={{
              dragend() {
                const marker = temporaryMarkerRef.current
                if (marker != null) {
                  setTemporaryMarker([marker._latlng.lat, marker._latlng.lng])
                }
              },
            }}
            position={temporaryMarker}
          >
            <Popup>
              Lat: {temporaryMarker[0]}
              <br /> Long: {temporaryMarker[1]}
            </Popup>
          </Marker>
        )}
        {/* <TogglePane
          toggle={(value) => togglePane(value)}
          markers={stationQuery?.data}
        ></TogglePane> */}
        <Pane
          onEdit={()=>handleToggleEditStation()}
          data={currentStation}
          active={showPane}
          onClose={() => togglePane(false)}
        ></Pane>
        <div className={cl('control-btn')}>
          <Button
            className={cl('add-btn')}
            onClick={() => {
              togglePane(false)
              setCurrentStation(undefined)
              toggleAddPane(true)
            }}
          >
            Thêm mới
          </Button>

          {!currentUser ? (
            <Button onClick={() => navigate('/login')}>Đăng nhập</Button>
          ) : (
            <Button onClick={() => handleLogout()}>Đăng xuất</Button>
          )}
        </div>
        <EditPane
          active={showAddPane}
          stationId={
            showAddPane && currentStation?._id ? currentStation._id : undefined
          }
          temporaryMarker={temporaryMarker}
          setNewTemporaryMarker={setTemporaryMarker}
          onClose={() => toggleAddPane(false)}
          onGoToPosition={(latlng) => addTemporaryMaker(latlng)}
          animateRef={animateRef}
        />
      </MapContainer>
    </div>
  )
}

export default Map
