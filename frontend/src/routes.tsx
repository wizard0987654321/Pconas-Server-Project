import Homepage from "./pages/Homepage";
import ErrorPage from "./pages/ErrorPage";
import TestPage from "./pages/TestPage";
import Navigation from "./pages/Navigation";
import DevicesPage from "./pages/DevicesPage";
import RoomsPage from "./pages/RoomsPage";
import RacksPage from "./pages/RacksPage";
import VmsPage from "./pages/VmsPage";
import ServicesPage from "./pages/ServicesPage";

const routes = [
    {
        path: '/',
        element: <Navigation />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'rooms', element: <RoomsPage />},
            { path: 'racks', element: <RacksPage />},
            { path: 'racks/:roomId', element: <RacksPage />},
            { path: 'devices', element: <DevicesPage />},
            { path: 'vms', element: <VmsPage />},
            { path: 'services', element: <ServicesPage />}
        ],
    },
]

export default routes;