import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from './App.jsx'
import MainLayout from './pages/MainLayout.jsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <p>kinggg</p>
      }
    ]
	},
]);

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
