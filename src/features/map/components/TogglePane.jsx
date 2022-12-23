import { useMapEvents } from 'react-leaflet'

function TogglePane({ toggle, markers }) {
  const map = useMapEvents({
    click: (e) => {
      // toggle(false)

      // console.log('Click')
    },
  })
  return null
}

export default TogglePane
