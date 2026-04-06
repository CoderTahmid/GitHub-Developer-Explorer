import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import MainLayout from './pages/MainLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import SearchDeveloper from './pages/SearchDeveloper.jsx';
import DeveloperProfile from './pages/DeveloperProfile.jsx';
import { ProtectedRoute, PublicOnlyRoute } from './routes/RouteGuards.jsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
				element: (
					<PublicOnlyRoute>
						<Login></Login>
					</PublicOnlyRoute>
				)
			},
			{
				path: "/dashboard",
				element: (
					<ProtectedRoute>
						<Dashboard></Dashboard>
					</ProtectedRoute>
				)
			},
			{
				path: "/search",
				element: (
					<ProtectedRoute>
						<SearchDeveloper></SearchDeveloper>
					</ProtectedRoute>
				)
			},
			{
				path: "/developer/:username",
				element: (
					<ProtectedRoute>
						<DeveloperProfile></DeveloperProfile>
					</ProtectedRoute>
				)
			},
    ]
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
