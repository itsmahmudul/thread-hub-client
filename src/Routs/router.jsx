import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
        {
            path: '/',
            Component: Home
        }
    ]
  },
]);