import React, { useMemo } from 'react'
import L from 'leaflet'
import classNames from 'classnames/bind'
import styles from './Pane.module.scss'
import { Carousel, Drawer, Image, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import InfoItem from '../../atom/InfoItem/InfoItem'
import FuelColumn from '../../atom/FuelColumn/FuelColumn'
import ActionButton from '../../atom/ActionButton'
import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useMap } from 'react-leaflet'
const cl = classNames.bind(styles)

function Pane({ data, active, onClose, onEdit, setWaypoints }) {
  const map = useMap()

  async function handleRouting() {
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom())
      setWaypoints([e.latlng, L.latLng(data.latitude, data.longitude)])
    })
  }

  const titleDiv = (
    <div className={cl('top-title')}>
      <div className={cl('top-main')}>Thông tin cửa hàng</div>
      <div className={cl('actions')}>
        <ActionButton
          onClick={() => onEdit()}
          icon={<EditOutlined />}
          type="approve"
          showConfirm={false}
        ></ActionButton>
        <ActionButton
          onClick={handleRouting}
          icon={<SearchOutlined />}
          type="approve"
          showConfirm={false}
        ></ActionButton>
      </div>
    </div>
  )

  return (
    <Drawer
      title={titleDiv}
      placement="left"
      onClose={onClose}
      open={active}
      mask={false}
    >
      <div className={cl('pane')}>
        <div className={cl('images')}>
          <Carousel className={cl('carousel')} dots>
            {data?.images?.map((img) => (
              <Image
                key={img.public_id}
                preview={false}
                className={cl('img')}
                src={img.url}
                fallback="https://maps.gstatic.com/tactile/pane/default_geocode-1x.png"
              />
            ))}
          </Carousel>
        </div>
        <div className={cl('group')}>
          <div className={cl('name')}>{data?.name}</div>
          <div className={cl('text')}>{data?.type || 'Petro station'}</div>
        </div>
        <div className={cl('group')}>
          <InfoItem
            icon={
              <FontAwesomeIcon icon={faLocationDot} className={cl('icon')} />
            }
            text={data?.address}
          ></InfoItem>
        </div>
        <div className={cl('group')}>
          {data?.company && (
            <InfoItem
              icon={
                <FontAwesomeIcon icon={faBuilding} className={cl('icon')} />
              }
              text={data?.company?.name}
            ></InfoItem>
          )}
        </div>
        <div className={cl('group')}>
          <InfoItem
            icon={<FontAwesomeIcon icon={faBarcode} className={cl('icon')} />}
            text={`Tax number: ${data?.taxNumber}`}
          ></InfoItem>
          <InfoItem
            icon={<FontAwesomeIcon icon={faBarcode} className={cl('icon')} />}
            text={`Cert number: ${data?.certNumber}`}
          ></InfoItem>
        </div>
        <div className={cl('group')}>
          <div className={cl('columns')}>Fuel columns</div>
          {data?.fuelColumns.map((fuelColumn, index) => (
            <FuelColumn
              key={index}
              index={index + 1}
              data={fuelColumn}
            ></FuelColumn>
          ))}
        </div>
      </div>
    </Drawer>
  )
}

export default Pane
