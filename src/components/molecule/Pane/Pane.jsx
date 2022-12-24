import React, { useState } from 'react'
import { useMap } from 'react-leaflet'

import classNames from 'classnames/bind'
import styles from './Pane.module.scss'
import { CaretLeftOutlined } from '@ant-design/icons'
import { Drawer, Image, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import InfoItem from '../../atom/InfoItem/InfoItem'
const cl = classNames.bind(styles)

function Pane({ data, active, onClose, onGoToPosition, animateRef }) {
  const map = useMap()
  const [latlng, setLatlng] = useState({})

  const handleClick = (e) => {}
  return (
    <Drawer
      title="Thông tin cửa hàng"
      placement="left"
      onClose={onClose}
      open={active}
      mask={false}
    >
      <div className={cl('images')}>
        <Image
          className={cl('img')}
          src="https://maps.gstatic.com/tactile/pane/default_geocode-1x.png"
          fallback="https://maps.gstatic.com/tactile/pane/default_geocode-1x.png"
        ></Image>
      </div>
      <div className={cl('group')}>
        <div className={cl('name')}>{data?.name}</div>
        <div className={cl('text')}>{data?.type || 'Petro station'}</div>
      </div>
      <div className={cl('group')}>
        <InfoItem
          icon={<FontAwesomeIcon icon={faLocationDot} className={cl('icon')} />}
          text={data?.address}
        ></InfoItem>
      </div>
      <div className={cl('group')}>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault()
            onGoToPosition([latlng.lat, latlng.lng])
            map.setView([latlng.lat, latlng.lng], 10, {
              animate: animateRef.current || false,
            })
            map.panTo([latlng.lat, latlng.lng])
          }}
        >
          <Input
            name="lat"
            onChange={(e) =>
              setLatlng((prev) => ({ ...prev, lat: e.target.value }))
            }
          ></Input>
          <Input
            name="lng"
            onChange={(e) =>
              setLatlng((prev) => ({ ...prev, lng: e.target.value }))
            }
          ></Input>
          <button>Pan to</button>
        </form> */}
      </div>
    </Drawer>
  )
}

export default Pane
