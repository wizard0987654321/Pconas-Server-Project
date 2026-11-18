/* ==========================================================================
 * BOOK THREAD 0.5  routes   (Chapter 0: App start and layout)
 * File: src/routes.tsx
 *
 * Maps every URL to a page. Navigation (0.6) is the frame around all pages, the page of the current URL is
 * shown inside it.
 *
 * Used by: 0.1 main
 * Uses: 0.6 Navigation, 0.7 ErrorPage, 1 Homepage, 2 RoomsPage, 2.5 DetailedRoom, 2.6 DetailedRack,
 *   3 RacksPage, 4 DeviceTypesPage, 5 DevicesPage, 6 VmsPage, 7 ServicesPage, 8 CustomersPage
 * Table of contents: frontend/CODE_GUIDE.md
 * ========================================================================== */

import Homepage from "./pages/Homepage"; // 1 Homepage
import ErrorPage from "./pages/ErrorPage"; // 0.7 ErrorPage
import Navigation from "./components/navComponents/Navigation"; // 0.6 Navigation
import DevicesPage from "./pages/DevicesPage"; // 5 DevicesPage
import RoomsPage from "./pages/RoomsPage"; // 2 RoomsPage
import RacksPage from "./pages/RacksPage"; // 3 RacksPage
import VmsPage from "./pages/VmsPage"; // 6 VmsPage
import ServicesPage from "./pages/ServicesPage"; // 7 ServicesPage
import DetailedRack from "./components/detailedViews/DetailedRack"; // 2.6 DetailedRack
import CustomersPage from "./pages/CustomersPage"; // 8 CustomersPage
import DeviceTypesPage from "./pages/DeviceTypesPage"; // 4 DeviceTypesPage
import DetailedRoom from "./components/detailedViews/DetailedRoom"; // 2.5 DetailedRoom


const routes = [
    {
        path: '/',
        element: <Navigation /* 0.6 */ />,
        errorElement: <ErrorPage /* 0.7 */ />,
        children: [
            { index: true, element: <Homepage /* 1 */ /> },
            { path: 'rooms', element: <RoomsPage /* 2 */ /> },
            { path: 'rooms/:id', element: <DetailedRoom /* 2.5 */ /> }, //for room detailed view
            { path: 'rooms/:roomId/racks', element: <RacksPage /* 3 */ /> }, //for filterin RacksPage 
            { path: 'racks', element: <RacksPage /* 3 */ /> },
            { path: 'racks/:id', element: <DetailedRack /* 2.6 */ /> }, //for rack detailed view
            { path: 'deviceTypes', element: <DeviceTypesPage /* 4 */ /> },
            { path: 'devices', element: <DevicesPage /* 5 */ /> },
            { path: 'vms', element: <VmsPage /* 6 */ /> },
            { path: 'services', element: <ServicesPage /* 7 */ /> },
            { path: 'customers', element: <CustomersPage /* 8 */ /> }
        ],
    },
]

export default routes;

// → Next in the book: 0.6 Navigation  (src/components/navComponents/Navigation.tsx)
