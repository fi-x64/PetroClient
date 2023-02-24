import React, { useState } from 'react'
import classNames from 'classnames/bind'
import styles from './Notify.module.scss'
import { Button, Drawer, Tabs } from 'antd'

import { getNotifications } from '../../../services/station'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment/moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleExclamation,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
const cl = classNames.bind(styles)

function Notify({ handleGoToStation }) {
  const [open, setOpen] = useState(false)
  const notifyQuery = useQuery(['notify'], getNotifications)

  return (
    <div className={cl('wrapper')}>
      <Button onClick={() => setOpen(true)}>Notify</Button>
      <Drawer onClose={() => setOpen(false)} title="Notificaiton" open={open}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: (
                <span>
                  <FontAwesomeIcon
                    className={cl('icon')}
                    icon={faTriangleExclamation}
                  />
                  Expired
                </span>
              ),
              key: 1,
              children: [
                notifyQuery?.data?.late?.map((x) => (
                  <div key={x._id} className={cl('item')}>
                    {x.name}:{' '}
                    {moment(x.fuelColumns[0].inspectionDate).format(
                      'DD/MM/yyyy'
                    )}
                    <button
                      onClick={() => {
                        handleGoToStation(x)
                        setOpen(false)
                      }}
                    >
                      Show
                    </button>
                  </div>
                )),
              ],
            },
            {
              label: (
                <span>
                  <FontAwesomeIcon
                    className={cl('icon')}
                    icon={faCircleExclamation}
                  />
                  Upcoming
                </span>
              ),
              key: 2,
              children: [
                notifyQuery?.data?.upcoming?.map((x) => (
                  <div key={x._id} className={cl('item')}>
                    {x.name}:{' '}
                    {moment(x.fuelColumns[0].inspectionDate).format(
                      'DD/MM/yyyy'
                    )}
                    <button
                      onClick={() => {
                        handleGoToStation(x)
                        setOpen(false)
                      }}
                    >
                      Show
                    </button>
                  </div>
                )),
              ],
            },
          ]}
        />
      </Drawer>
    </div>
  )
}

export default Notify
