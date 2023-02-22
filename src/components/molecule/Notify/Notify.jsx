import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './Notify.module.scss'
import { Button, Drawer } from 'antd'
import { getNotifications } from '../../../services/station'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
const cl = classNames.bind(styles)

function Notify() {
  const [open, setOpen] = useState(false)
  const notifyQuery = useQuery(['notify'], getNotifications)
  return (
    <div className={cl('wrapper')}>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer onClose={() => setOpen(false)} title="Notificaiton" open={open}>
        {notifyQuery?.data?.map((x) => (
          <div>
            {x.name} /
            {x.fuelColumns.map((y) => (
              <p>
                {y.fuelNumber}: {dayjs(y.inspectionDate).format('DD/MM/YYYY')}
              </p>
            ))}
          </div>
        ))}
      </Drawer>
    </div>
  )
}

export default Notify
