import Login from '../components/molecule/Auth/login'
import Map from '../features/map'

const routes = [
    { path: '/', component: Map, layout: null },
    { path: '/login', component: Login, layout: null },
]

export default routes
