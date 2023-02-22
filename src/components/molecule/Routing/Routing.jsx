import L from 'leaflet'
import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'

const createRoutineMachineLayer = ({ start, destination }) => {
  if (!start || !destination) return null

  const instance = L.Routing.control({
    waypoints: [start, destination],
  })

  return instance
}

const RoutingMachine = createControlComponent(createRoutineMachineLayer)

export default RoutingMachine
