import Login from '../components/molecule/Auth/login'
import Map from '../features/map'

const routes = [
    { path: '/login', component: Login, layout: null },
    { path: '/', component: Map, layout: null },
]

export default routes
