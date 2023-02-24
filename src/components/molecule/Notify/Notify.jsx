import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './Notify.module.scss'
import { Button, Drawer } from 'antd'
import { getNotifications } from '../../../services/station'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment/moment'
const cl = classNames.bind(styles)

function Notify() {
  const [open, setOpen] = useState(false)
  const notifyQuery = useQuery(['notify'], getNotifications)
  return (
    <div className={cl('wrapper')}>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer onClose={() => setOpen(false)} title="Notificaiton" open={open}>
        {notifyQuery?.data?.late?.map((x) => (
          <div key={x._id} className={cl('late')}>
            {x.name}:{' '}
            {moment(x.fuelColumns[0].inspectionDate).format('DD/MM/yyyy')}
          </div>
        ))}
        {notifyQuery?.data?.upcoming?.map((x) => (
          <div key={x._id} className={cl('upcoming')}>
            {x.name}
          </div>
        ))}
      </Drawer>
    </div>
  )
}

export default Notify
