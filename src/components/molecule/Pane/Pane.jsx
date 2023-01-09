import React, { useMemo } from 'react'
import classNames from 'classnames/bind'
import styles from './Pane.module.scss'
import { Drawer, Image, Input } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import InfoItem from '../../atom/InfoItem/InfoItem'
import FuelColumn from '../../atom/FuelColumn/FuelColumn'
import ActionButton from '../../atom/ActionButton'
import { EditOutlined } from '@ant-design/icons'
const cl = classNames.bind(styles)

function Pane({ data, active, onClose, onEdit }) {
  const titleDiv = (
    <div className={cl('top-title')}>
      <div className={cl('top-main')}>Thông tin cửa hàng</div>
      <ActionButton
        onClick={() => onEdit()}
        icon={<EditOutlined />}
        type="approve"
        showConfirm={false}
      ></ActionButton>
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
