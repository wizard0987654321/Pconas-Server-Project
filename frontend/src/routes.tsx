import App from "./pages/App";
import ErrorPage from "./pages/ErrorPage";
import TestPage from "./pages/TestPage";
import Navigation from "./pages/Navigation";

const routes = [
    {
        path: '/',
        element: <Navigation />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <App /> },
            { path: 'rooms', element: <TestPage />},
        ],
    },
]

export default routes;